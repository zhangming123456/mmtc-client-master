"use strict";

module.exports = function (dateStr) {
    let dateArr = dateStr.split(/[- : \/]/);
    return new Date(+dateArr[0], +dateArr[1] - 1, dateArr[2] || '01', dateArr[3] || '00', dateArr[4] || '00', dateArr[5] || '00');
}