'use strict';
const path = require('path');
const fs = require('fs');
const co = require('co');
const walker = require('files-walker');
const video = require('./lib/video');
const utils = require('./lib/utils');

const {
  getVideoInfo,
  snapshot
} = video;

const { fileExists, createDir } = utils;


function snapshotVideo(filePath, opts) {
  opts = opts || {};
  const interval = opts.interval || 300;
  const savePath = opts.savePath;

  return fileExists(filePath)
    .then(() => getVideoInfo(filePath))
    .then(info => info.duration)
    .then(duration => co(function* () {
      for (let i = 60; i < duration; i += interval) {
        console.log(`${i} / ${duration}`);
        yield snapshot(filePath, i, path.resolve(savePath, `${path.basename(filePath)}_${i}.jpg`));
      }
    }))
    .catch(err => console.log(err));
}

function snapshotDir(dirPath, opts) {
  opts = opts || {};
  const filter = filename => /\.(avi|mp4|rmvb|mkv)$/.test(filename);
  return walker.walk(dirPath, filter, filePath => {
    // Promise.resolve(console.log(filePath));
    console.log(filePath);
    const savePath = path.isAbsolute(opts.savePath) ? opts.savePath : path.resolve(path.dirname(filePath), opts.savePath);
    // return Promise.resolve(console.log(savePath));
    console.log(path.resolve(savePath, `${path.basename(filePath)}_60.jpg`));
    return fileExists(savePath)
      .catch(() => createDir(savePath))
      .then(() => fileExists(path.resolve(savePath, `${path.basename(filePath)}_60.jpg`)))
      .catch(err => {
        return snapshotVideo(filePath, Object.assign({}, opts, {
          savePath
        }));
      });
    /* return createDir(path.resolve(opts.savePath, path.basename(filePath)))
      .then(savePath => {
        console.log(path.basename(filePath));
        return snapshotVideo(filePath, Object.assign({}, opts, {
          savePath: savePath
        }));
      });*/
  });
}

snapshotDir('\\\\192.168.0.116\\var\\other', {
// snapshotDir('D:\\', {
  savePath: 'snapshot',
  interval: 120
})
  .then(() => console.log('Done'))
  .catch(err => console.log(err));
