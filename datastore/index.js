const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(new Error('Error'));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error('error writing counter'));
        } else {
          callback(null, {
            id: id,
            text: text
          });
        }
      });
    }
  });
};


exports.readAll = (callback) => {
  return fs.readdirAsync(exports.dataDir)
    .then((files) => {
      const readFiles = files.map((item) => {
        return fs.readFileAsync(path.join(exports.dataDir, item))
          .then((data) => {
            return {
              id: path.parse(item).name,
              text: data.toString()
            };
          })
          .catch((err) => {
            console.log(err);
          });
      });
      return Promise.all(readFiles);
    })
    .then((arr) => {
      callback(null, arr);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.readAll = (callback) => {
  return fs.readdirAsync(exports.dataDir)
    .then((files) => {
      const readFiles = files.map((item) => {
        return fs.readFileAsync(path.join(exports.dataDir, item))
          .then((data) => {
            return {
              id: path.parse(item).name,
              text: data.toString()
            };
          })
          .catch((err) => {
            console.log(err);
          });
      });
      return Promise.all(readFiles);
    })
    .then((arr) => {
      callback(null, arr);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {
        id: id,
        text: data.toString()
      });
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`Error locating  file: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error ('error updating file'));
        } else {
          callback(null, {
            id: id,
            text: text
          });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`Error locating file: ${id}`));
    } else {
      fs.rm(path.join(exports.dataDir, `${id}.txt`), (err) => {
        if (err) {
          callback(new Error ('error deleting file'));
        } else {
          callback(null);
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
