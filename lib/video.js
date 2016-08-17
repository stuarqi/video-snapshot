'use strict';
const utils = require('./utils');

const { getSecond } = utils;

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
  return match(info, /,\s(\d+x\d+),/);
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

module.exports = {
  getInfo
};