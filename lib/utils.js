'use strict';
const fs = require('fs');

function getSecond(timeStr) {
  return timeStr.split(':').reduce((count, val, idx) => {
    count += +val * Math.pow(60, 2 - idx);
    return count;
  }, 0);
}

function getTimeStr(second) {
  const m = getTime(second);
  let minute = m[0];
  second = m[1];
  const h = getTime(minute);
  const hour = h[0];
  minute = h[1];

  return `${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`;
}

function getTime(num) {
  const quo = Math.floor(num / 60);
  const rem = num % 60;
  return [quo, rem];
}

function fileExists(path, mode) {
  /* return new Promise((resolve, reject) => {
    fs.access(path, mode, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });*/
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createDir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, err => {
      if (err) {
        reject(err);
      } else {
        resolve(path);
      }
    });
  });
}

module.exports = {
  getSecond,
  getTimeStr,
  fileExists,
  createDir
};
