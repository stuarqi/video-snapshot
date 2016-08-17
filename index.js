'use strict';
const exec = require('child_process').exec;

const video = require('./lib/video');

const { getInfo } = video;

function getVideoInfo(filePath) {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i "${filePath}"`, (err, stdout, stderr) => {
      resolve(getInfo(stderr));
    });
  });
}

getVideoInfo('f:/nx.mp4')
  .then(info => console.log(info));
