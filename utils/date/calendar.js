"use strict";
const format = require('./format'),
    range = require('./range'),
    getDate = require('./getDate');


function getWeekCount (y, m) {// 传参是实际时间，如：今天是2018-5，传 2018, 5
    var date = new Date(y, m - 1, 1);// m等于实际月份，m-1等于日历月份,最后的1是为了模拟本月初始时间1号来计算1号是不是第一周
    // 为了模拟本月1号是否为本月第1周的判断
    var firstWeekDate = 1;// 默认第一周是本月1号
    var firstWeekDatek;
    if (date.getDay() === 1) { // 判断1号是周一
        firstWeekDatek = 1;
    } else if (date.getDay() === 0) { // 判断1号是周日
        firstWeekDate = 8 - 7 + 1;
    } else { // 判断1号是周二至周六之间
        firstWeekDate = 8 - date.getDay() + 1;
    }
    console.info('今天是' + date.getFullYear() + '年' + (date.getMonth() + 1) + '月：');
    console.info('本月第一周是-----:' + firstWeekDate + '号');
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    var monthHasDays = date.getDate();// 本月天数
    console.info('本月有-----:' + date.getDate() + '天');
    monthHasDays = date.getDate() - firstWeekDate + 1;
    var hasWeek = Math.ceil(monthHasDays / 7); // 计算本月有几周
    console.info('本月有-----:' + hasWeek + '周');
    return hasWeek;
};

/**
 * 获取今天的信息
 */
function getTodayWeekInfo () {
    var nowDate = new Date(); // 今天的年份
    var nowMonth = nowDate.getMonth() + 1; // 今天的月份
    var timeIsWeek = ''; // 今天属于第几周
    var timeHasWeeks = ''; // 本月共有几周
    timeIsWeek = getMonthWeek(nowDate.getFullYear(), nowMonth, nowDate.getDate());// 今天是第几周
    timeHasWeeks = getWeekCount(nowDate.getFullYear(), nowMonth);// 本月共几周
    if (timeIsWeek < 1) { // 如果小于1，说明属于上个月的最后一周
        timeHasWeeks = getWeekCount(nowDate.getFullYear(), nowMonth);// 上月共几周
        timeIsWeek = Math.abs(timeIsWeek);
    }
    console.info('今天是第' + timeIsWeek + '周--本月有' + timeHasWeeks + '周--本月是' + nowMonth + '月');
}

/**
 * 获取今天是今年的第几周
 */
function weekNumInYear () {
    var nowDate = new Date();
    var initTime = new Date();
    initTime.setMonth(0); // 本年初始月份
    initTime.setDate(1); // 本年初始时间
    var differenceVal = nowDate - initTime; // 今天的时间减去本年开始时间，获得相差的时间
    var todayYear = Math.ceil(differenceVal / (24 * 60 * 60 * 1000)); // 获取今天是今年第几天
    var weekYear = Math.ceil(todayYear / 7); // 获取今天是今年第几周
    console.info("今天是本年第" + todayYear + "天，第" + weekYear + "周");//周日做为下周的开始计算
}

/**
 * 获取今天是第几周
 * @param a
 * @param b
 * @param c
 * @return {number}
 */
// function getMonthWeek (y, m, d) {// 传参是实际时间，如：今天是2018-5-7，传 2018, 5, 7
//     var date = new Date(y, m - 1, d);// m等于实际月份，m-1等于日历月份
//     var dateStart = new Date(y, m - 1, 1);// 本月初
//     var weekNum = 1;// 默认今天是本月第一周
//     var firstWeekDate = 1, // 默认第一周是本月1号
//         weekIndex, firstWeekDatek;
//     if (dateStart.getDay() === 1) { // 判断1号是周一
//         firstWeekDatek = 1;
//     } else if (dateStart.getDay() === 0) { // 判断1号是周日
//         firstWeekDate = 8 - 7 + 1;
//     } else { // 判断1号是周二至周六之间
//         firstWeekDate = 8 - dateStart.getDay() + 1;
//     }
//     if (date.getDay() === 1 && date.getDate() < 7) {// 如果今天是周一，且小于7号，那么本周就是本月第一周
//         weekNum = 1;
//     } else if (date.getDate() < firstWeekDate) {// 如果今天不在本月第一周内，则是上个月的最后一周
//         console.info('今天是上个月最后一周');
//         weekNum = getWeekCount(y, m - 1);// 在此可以区分本周属于上月
//     } else {
//         // 如果不符合上面判断，那么本周数据本月内的周
//         // 今天是几号/7
//         if (c < 7) {
//             weekIndex = Math.ceil(c / 7); // 当前日期小于7，向上取整
//         } else {
//             c = c - (firstWeek - 1); // 大于7，减去属于上周的天数
//             if (c % 7 === 0) { // 如果能被7整除
//                 if (dateStart.getDay() !== 6) {
//                     weekIndex = c / 7;
//                 } else {
//                     weekIndex = c / 7 + 1; // 今天如果是周日，需要加1周
//                 }
//             } else {
//                 weekIndex = Math.ceil(c / 7); // 如果不能被7整除，需要向上取整
//             }
//         }
//     }
//     return weekNum;
// };

function getMonthWeek (a, b, c) {
    let date = a || new Date();
    if (arguments.length === 3) {
        date = getDate(`${a}-${parseInt(b) - 1}-${c}`)
    } else if (typeof date === 'string' && /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/.test(date)) {
        date = getDate(date)
    } else {
        date = getDate(format(date, 'YYYY-MM-DD'))
    }
    /*
     a = d = 当前日期
     b = 6 - w = 当前周的还有几天过完(不算今天)
     a + b 的和在除以7 就是当天是当前月份的第几周
     */
    var w = date.getDay(),
        d = date.getDate();
    return Math.ceil((d + 6 - w) / 7);
}

function getYearWeek (a, b, c) {
    /*
     date1是当前日期
     date2是当年第一天
     d是当前日期是今年第多少天
     用d + 当前年的第一天的周差距的和在除以7就是本年第几周
     */
    var date1 = new Date(a, parseInt(b) - 1, c),
        date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
};

function leapYear (Year) {//判断是否闰年
    if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
        return (true);
    } else {
        return (false);
    }
}

function leapMonth (date) {//判断月份天数
    if (/^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/.test(date)) {
        date = date.split('-')
        let t_days = [31, 28 + leapYear(date[0]), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        return t_days[+date[1] - 1] + 1
    }
}

function dateData (param = {}, options = {}) {
    let _date = param.date;
    if (typeof param === 'string') {
        _date = param
    }
    let toDay = new Date(),
        date = toDay;//今天日期
    if (/^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/.test(_date)) {
        date = getDate(_date)//当前日期
    } else if (_date instanceof Date) {
        date = _date;
        _date = format(date, 'YYYY-MM') + '-01'
    } else {
        _date = format(date, 'YYYY-MM') + '-01'
    }
    let selectDate = date;
    date = getDate(_date);
    let dataAll = []//总日历数据
    let dataAll2 = []//总日历数据
    let dataMonth = []//月日历数据

    let year = date.getFullYear()//当前年
    let week = date.getDay();//当天星期几
    let weeks = [];
    let oneWeeks = [];
    let month = date.getMonth() + 1;//当前月份
    let day = date.getDate();//当天
    let daysCount = leapMonth(_date);//一共显示多少天
    let dayscNow = 0;//计数器
    let monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];//月份列表
    let nowMonthList = [];//本年剩余年份
    for (let i = month; i < 13; i++) {
        nowMonthList.push(i)
    }
    let yearList = [year]//年份最大可能
    for (let i = 0; i < daysCount / 365 + 2; i++) {
        yearList.push(year + i + 1)
    }
    for (let i = 0; i < yearList.length; i++) {//遍历年
        let mList
        if (yearList[i] == year) {//判断当前年份
            mList = nowMonthList
        } else {
            mList = monthList
        }
        for (let j = 0; j < mList.length; j++) {//循环月份
            dataMonth = []
            let t_days = [31, 28 + leapYear(yearList[i]), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            let t_days_thisYear = []
            if (yearList[i] == year) {
                for (let m = 0; m < nowMonthList.length; m++) {
                    t_days_thisYear.push(t_days[mList[m] - 1])
                }
                t_days = t_days_thisYear
            } else {
                t_days = [31, 28 + leapYear(yearList[i]), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            }
            for (let k = 0; k < t_days[j]; k++) {
                //循环每天
                dayscNow++
                let nowData
                if (dayscNow < daysCount) {//如果计数器没满
                    let days = k + 1
                    if (days < 10) {
                        days = "0" + days
                    }
                    let _month = +mList[j] < 10 ? '0' + +mList[j] : +mList[j];
                    let date = getDate(yearList[i] + "-" + _month + "-" + days),
                        weekss = date.getDay();//获取每个月第一天是周几
                    nowData = {//组装自己需要的数据
                        year: yearList[i],
                        month: _month,
                        day: k + 1,
                        weeks: weekss,
                        date: yearList[i] + "" + _month + days,
                        selected: 0,
                        re: yearList[i] + "-" + _month + "-" + days,
                    };
                    dataMonth.push(nowData);
                    if (+weekss === 1) {
                        oneWeeks.push(nowData)
                    }
                    if (+yearList[i] === +year && +mList[j] === +month && k + 1 === day) {//判断当年当月
                        weeks.push(weekss)
                    } else if (k === 0) {
                        weeks.push(weekss)
                    }
                } else {
                    break
                }
            }
            dataAll.push(dataMonth)
        }
    }
    for (let i = 0; i < dataAll.length; i++) {
        if (dataAll[i].length !== 0) {
            dataAll2.push(dataAll[i]);
        }
    }
    return {
        // date1: dataAll,
        date: dataAll2,
        weeks: weeks,
        oneWeeks: oneWeeks,
    }
}

module.exports = {
    getDate,
    dateData,
    leapMonth,
    leapYear,
    format,
    range,
    getMonthWeek
}