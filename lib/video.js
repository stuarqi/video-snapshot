'use strict';
const exec = require('child_process').exec;

const utils = require('./utils');

const { getSecond, getTimeStr, fileExists } = utils;

function match(info, reg, idx) {
  const match = info.match(reg);
  return match ? match[1] : null;
}

function getDuration(info) {
  return match(info, /Duration:\s(\d{2}:\d{2}:\d{2})/);
}

function getBitrate(info) {
  return match(info, /bitrate:\s(\d+)\skb\/s/);
}

function getEncode(info) {
  return match(info, /Video:\s([^\s]+)/);
}

function getSize(info) {
  return match(info, /,\s(\d+x\d+)/);
}

function getFramerate(info) {
  return match(info, /(\d+)\sfps,/);
}



function getInfo(info) {
  const duration = getSecond(getDuration(info));   // 单位：s
  const bitrate = +getBitrate(info);  // 单位：kb/s
  const encode = getEncode(info);
  const size = getSize(info).split('x').reduce((obj, val, idx) => {
    obj[['width', 'height'][idx]] = +val;
    return obj;
  }, {});   // 单位：像素
  const framerate = +getFramerate(info);  // 单位：fps

  return {
    duration,
    bitrate,
    encode,
    size,
    framerate
  };
}

function getVideoInfo(filePath) {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i "${filePath}"`, (err, stdout, stderr) => {
      resolve(getInfo(stderr));
    });
  });
}

function snapshot(filePath, second, savePath) {
  console.log(savePath);
  return fileExists(filePath)
    .then(() => getVideoInfo(filePath))
    .then(info => info.duration)
    .then(duration => new Promise((resolve, reject) => {
      const time = getTimeStr(second);
      exec(`ffmpeg -ss ${time} -i "${filePath}" -f image2 -y "${savePath}"`, (err, stdout, stderr) => {
        /* if (/Conversion failed!/.test(stderr)) {
          reject('Conversion failed!');
        } else {
          resolve();
        }*/
        // console.log(stderr);
        resolve();
      });
    }));
}

module.exports = {
  getVideoInfo,
  snapshot
};
