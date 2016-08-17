'use strict';

function getSecond(timeStr) {
  return timeStr.split(':').reduce((count, val, idx) => {
    count += +val * Math.pow(60, 2 - idx);
    return count;
  }, 0);
}

module.exports = {
  getSecond
};