function DateTime (date) {
    if (arguments.length === 0) this.date = new Date()
    else if (date instanceof Date) this.date = new Date(date)
    else throw Error('Argument must be a date object. ' + date + ' was given')
}

DateTime.SUNDAY = 0
DateTime.MONDAY = 1
DateTime.TUESDAY = 2
DateTime.WEDNESDAY = 3
DateTime.THURSDAY = 4
DateTime.FRIDAY = 5
DateTime.SATURDAY = 6

DateTime.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
DateTime.y2kYear = 50
DateTime.monthNumbers = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
}

/**
 * Returns DateTime for given date and time
 * 返回给定的日期和时间DateTime
 * @param year
 * @param month 1-12
 * @param day 1-31
 * @param hours 0-23
 * @param minutes 0-59
 * @param seconds 0-59
 * @returns {DateTime} new DateTime object or throws error
 */
DateTime.fromDateTime = function (year, month, day, hours, minutes, seconds) {
    return new DateTime(createSafeDate(+year, +month, +day, +hours, +minutes, +seconds || 0))
}

/**
 * Returns DateTime for given date by setting time to midnight
 * 返回给定日期DateTime通过设置时间午夜
 * @param year
 * @param month
 * @param day
 * @returns {DateTime} new DateTime object or throws error
 */
DateTime.fromDate = function (year, month, day) {
    return DateTime.fromDateTime(year, month, day, 0, 0, 0)
}

/**
 * Returns DateTime from given Date object
 * 返回给定日期的DateTime对象
 * @param date
 * @returns {DateTime}
 */
DateTime.fromDateObject = function (date) {
    return new DateTime(date)
}

/**
 * Returns DateTime from ISO date ignoring time information
 * 返回从ISO DateTime日期忽略时间信息
 * @param isoDate String YYYY-MM-DDTHH-MM
 * @return {DateTime}
 */
DateTime.fromIsoDate = function (isoDate) {
    var optionalTimePattern = /^\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?))?$/
    if (!optionalTimePattern.test(isoDate)) throw Error(isoDate + ' is not valid ISO Date (YYYY-MM-DD or YYYY-MM-DDTHH:MM)')
    var date = parseDate(isoDate.split('T')[0])
    return DateTime.fromDate(date.year, date.month, date.day)
}

/**
 * Returns DateTime with time from ISO date
 * 返回DateTime从ISO日期与时间
 * @param isoDateTime String YYYY-MM-DDTHH-MM
 * @return {DateTime} Returns DateTime or throws error for invalid syntax
 */
DateTime.fromIsoDateTime = function (isoDateTime) {
    var fullPatternTest = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z?)/
    if (!fullPatternTest.test(isoDateTime)) throw Error(isoDateTime + ' is not valid ISO Date (YYYY-MM-DDTHH:MM)')

    var dateAndTime = isoDateTime.split('T')
    var time = parseTime(dateAndTime.length === 2 && dateAndTime[1])
    var date = parseDate(dateAndTime[0])
    return DateTime.fromDateTime(date.year, date.month, date.day, time.hours, time.minutes, time.seconds)
}

/**
 * Returns DateTime from current time in milliseconds
 * 返回日期时间以毫秒为单位的当前时间
 * @param ms
 * @returns {DateTime}
 */
DateTime.fromMillis = function (ms) {
    return new DateTime(new Date(ms))
}

/**
 * Returns new DateTime with milliseconds set to 0
 * 返回新DateTime毫秒设置为0
 */
DateTime.prototype.withResetMS = function () {
    var newDate = this.clone()
    newDate.date.setMilliseconds(0)
    return newDate
}

/**
 * Returns new DateTime with given hours and minutes and 0 milliseconds
 * 返回与给定的小时和分钟新DateTime和0毫秒
 * @param h 0-23
 * @param m 0-59
 */
DateTime.prototype.withTime = function (h, m) {
    if (typeof h === 'string') {
        var hoursAndMinutes = h.split(':')
        h = hoursAndMinutes[0]
        m = hoursAndMinutes[1]
    }
    var dateWithTime = this.clone()
    dateWithTime.date.setHours(h)
    dateWithTime.date.setMinutes(m)
    dateWithTime.date.setSeconds(0)
    dateWithTime.date.setMilliseconds(0)
    return dateWithTime
}

DateTime.SECOND = 1000
DateTime.MINUTE = 60 * DateTime.SECOND
DateTime.HOUR = 60 * DateTime.MINUTE
DateTime.DAY = 24 * DateTime.HOUR
DateTime.WEEK = 7 * DateTime.DAY

/**
 * Returns new DateTime with current time
 * 返回新日期时间与当前时间
 * @returns {DateTime}
 */
DateTime.now = function () {
    return new DateTime()
}

/**
 * Returns new DateTime with current date and midnight time
 * 返回新DateTime午夜与当前日期和时间
 */
DateTime.today = function () {
    return DateTime.now().getOnlyDate()
}

/**
 * Returns time in milliseconds
 * 返回时间以毫秒为单位
 * @returns {number} milliseconds
 */
DateTime.prototype.getTime = function () {
    return this.date.getTime()
}

/**
 * Returns year
 * @returns {number} year
 */
DateTime.prototype.getFullYear = function () {
    return this.date.getFullYear()
}

/**
 * Returns day of month
 * @returns {number} 1-31
 */
DateTime.prototype.getDate = function () {
    return this.date.getDate()
}

/**
 * Returns month
 * @returns {number} 1-12
 */
DateTime.prototype.getMonth = function () {
    return this.date.getMonth() + 1
}

/**
 * Returns day of week. 0=sunday, 1=monday, ...
 * @returns {number} 0-6
 */
DateTime.prototype.getDay = function () {
    return this.date.getDay()
}

/**
 * Returns hours
 * @returns {number} 0-23
 */
DateTime.prototype.getHours = function () {
    return this.date.getHours()
}

/**
 * Returns minutes
 * @returns {number} 0-59
 */
DateTime.prototype.getMinutes = function () {
    return this.date.getMinutes()
}

/**
 * Returns seconds
 * @returns {number} 0-59
 */
DateTime.prototype.getSeconds = function () {
    return this.date.getSeconds()
}

/**
 * Returns milliseconds
 * @returns {number} 0-999
 */
DateTime.prototype.getMilliseconds = function () {
    return this.date.getMilliseconds()
}

/**
 * Returns days in month for current DateTime
 * 返回当前日期时间天月
 * @returns {number}
 */
DateTime.prototype.getDaysInMonth = function () {
    return DateTime.getDaysInMonth(this.getFullYear(), this.getMonth())
}

/**
 * Returns number of days for given month
 * 返回指定月天数
 * @param {Number} year Year of month
 * @param {Number} month Number of month (1-12)
 * @returns {Number} [28-31]
 */
DateTime.getDaysInMonth = function (year, month) {
    if (month > 12 || month < 1)
        throw new Error('Month must be between 1-12')
    var yearAndMonth = year * 12 + month
    return DateTime.fromDate(Math.floor(yearAndMonth / 12), yearAndMonth % 12 + 1, 1).minusDays(1).getDate()
}

/**
 * Returns days in year for current Date
 * 返回当前日期年天
 * @returns {*}
 */
DateTime.prototype.getDayInYear = function () {
    return DateTime.getDayInYear(this.getFullYear(), this.getMonth(), this.getDate())
}

/**
 * Returns new DateTime with given days later
 * 返回新DateTime天后
 * @param days
 * @returns {DateTime}
 */
DateTime.prototype.plusDays = function (days) {
    var newDateTime = DateTime.fromMillis(this.getTime() + days * DateTime.DAY)
    var hours = this.getHours()

    // Fix the DateTime offset caused by daylight saving time
    var delta = hours - newDateTime.getHours()
    if (delta !== 0) {
        // Correct the delta to be between [-12, 12]
        if (delta > 12) {
            delta -= 24
        }
        if (delta < -12) {
            delta += 24
        }
        return DateTime.fromMillis(newDateTime.getTime() + (delta * DateTime.HOUR))
    }
    return newDateTime
}

/**
 * Returns new DateTime with given minutes later
 * 返回新DateTime分钟后
 * @param minutes
 * @returns {DateTime}
 */
DateTime.prototype.plusMinutes = function (minutes) {
    return DateTime.fromMillis(this.clone().getTime() + (minutes * DateTime.MINUTE))
}

/**
 * Returns new DateTime with given minutes earlier
 * 返回新DateTime分钟前
 * @param minutes
 * @returns {DateTime}
 */
DateTime.prototype.minusMinutes = function (minutes) {
    return this.plusMinutes(-minutes)
}

/**
 * Returns new DateTime with given days earlier
 * 返回新DateTime天前
 * @param days
 * @returns {DateTime}
 */
DateTime.prototype.minusDays = function (days) {
    return this.plusDays(-days)
}

/**
 * Compares DateTimes. Examples:
 * earlier.compareTo(later)) < 0
 * later.compareTo(earlier)) > 0
 * later.compareTo(later)) == 0

 * @param date {DateTime}
 * @returns {number}
 */
DateTime.prototype.compareTo = function (date) {
    if (!date) {
        return 1
    }
    var diff = this.getTime() - date.getTime()
    return diff === 0 ? 0 : diff / Math.abs(diff)
}

/**
 * Returns true if DateTime is within today
 */
DateTime.prototype.isToday = function () {
    return this.equalsOnlyDate(DateTime.today())
}

/**
 * Returns the week number of current DateTime
 * 返回当前日期时间的周数 (一年)
 * @param {string} weekNumberingSystem US or ISO
 * @returns {number}
 */
DateTime.prototype.getWeekInYear = function (weekNumberingSystem) {
    if (weekNumberingSystem !== 'US' && weekNumberingSystem !== 'ISO') {
        throw('Week numbering system must be either US or ISO, was ' + weekNumberingSystem)
    }

    var firstDay = new Date(this.getFullYear(), 0, 1).getDay()
    if (weekNumberingSystem === 'US') {
        return Math.ceil((this.getDayInYear() + firstDay) / 7)
    }
    var THU = 4
    var weekday = this.getDay()
    if (weekday === 0) weekday = 7
    if (firstDay === 0) firstDay = 7
    // If Dec 29 falls on Mon, Dec 30 on Mon or Tue, Dec 31 on Mon - Wed, it's on the first week of next year
    // 如果12月29日落在星期一,12月30日星期一或星期二,12月31日星期一,结婚,在明年的第一个星期
    if (this.getMonth() === 12 && this.getDate() >= 29 && (this.getDate() - weekday) > 27) {
        return 1
    }
    // If Jan 1-3 falls on Fri, Sat or Sun, it's on the last week of the previous year
    // 如果1月1 - 3落在星期五,坐或太阳,它在前一年的最后一个星期
    if (this.getMonth() === 1 && this.getDate() < 4 && weekday > THU) {
        return new DateTime(new Date(this.getFullYear() - 1, 11, 31)).getWeekInYear('ISO')
    }
    var week = Math.ceil((this.getDayInYear() + firstDay - 1) / 7)
    // If first days of this year are on last year's last week, the above gives one week too much
    if (firstDay > THU) week--
    return week
};


/**
 * 返回当前日期时间周数 (一月)
 * @param weekNumberingSystem
 * @return {number}
 */
DateTime.prototype.getWeekInMonth = function (weekNumberingSystem) {
    return DateTime.getWeekInMonth(this.getFullYear(), this.getMonth(), weekNumberingSystem)
}


/**
 * 返回指定时间是周数 (一月)
 * @param year
 * @param month
 * @param weekNumberingSystem
 * @return {number}
 */
DateTime.getWeekInMonth = function (year, month, weekNumberingSystem = 'ISO') {
    if (month > 12 || month < 1)
        throw new Error('Month must be between 1-12')
    var date = new Date(year, month - 1, 1);
    var firstWeekDate = 1;// 默认第一周是本月1号  为了模拟本月1号是否为本月第1周的判断

    if (date.getDay() === 1) { // 判断1号是周一
        firstWeekDate = 1;
    } else if (date.getDay() === 0) { // 判断1号是周日
        firstWeekDate = 8 - 7 + 1;
    } else { // 判断1号是周二至周六之间
        firstWeekDate = 8 - date.getDay() + 1;
    }
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    var monthHasDays = 30;
    monthHasDays = date.getDate() - firstWeekDate + 1;
    var hasWeek = Math.ceil(monthHasDays / 7); // 计算本月有几周
    return hasWeek;
}

/**
 * 返回当前日期时间的第几周
 * @param weekNumberingSystem
 * @return {number}
 */
DateTime.prototype.getIndexInMonth = function (weekNumberingSystem) {
    return DateTime.getIndexInMonth(this.getFullYear(), this.getMonth(), this.getDate(), weekNumberingSystem)
}

/**
 * 返回指定时间的第几周
 * @param year
 * @param month
 * @param day
 * @param weekNumberingSystem
 * @return {number}
 */
DateTime.getIndexInMonth = function (year, month, day, weekNumberingSystem = 'ISO') {
    if (month > 12 || month < 1)
        throw new Error('Month must be between 1-12')
    var date = new Date(year, month - 1, day);
    var dateStart = new Date(year, month - 1, 1); // 本月初
    var firstWeek = 1;
    if (dateStart.getDay() === 1) {
        firstWeek = 1;
    } else if (dateStart.getDay() === 0) {
        firstWeek = 8 - 7 + 1;
    } else {
        firstWeek = 8 - dateStart.getDay() + 1;
    }
    var weekIndex = 1;
    var c = date.getDate();
    if (date.getDay() === 1 && date.getDate() < 7) {
        weekIndex = 1;
    } else if (c < firstWeek) {
        weekIndex = -1;
    } else {
        if (c < 7) {
            weekIndex = Math.ceil(c / 7);
        } else {
            c = c - firstWeek + 1;
            if (c % 7 === 0) {
                if (dateStart.getDay() !== 6) {
                    weekIndex = c / 7;
                } else {
                    weekIndex = c / 7 + 1;
                }
            } else {
                weekIndex = Math.ceil(c / 7);
            }
        }
    }
    return weekIndex;
};


/**
 * Creates clone of current DateTime
 * 创建当前DateTime的克隆
 * @returns {DateTime}
 */
DateTime.prototype.clone = function () {
    return new DateTime(this.date)
}

/**
 * Returs true if month is odd, ie. january=true
 * 收益的真实如果月是奇数,即。1 = true
 * @returns {boolean}
 */
DateTime.prototype.isOddMonth = function () {
    return this.getMonth() % 2 === 0
}

/**
 * Returns true if given DateTime has same day as current DateTime
 * 返回true如果DateTime同一天为当前日期时间
 * @param date
 * @returns {boolean}
 */
DateTime.prototype.equalsOnlyDate = function (date) {
    if (!date) return false
    return this.getMonth() === date.getMonth() && this.getDate() === date.getDate() && this.getFullYear() === date.getFullYear()
}

/**
 * Returns first date of month from current date
 * 从当前日期返回月的第一次约会
 * @returns {DateTime}
 */
DateTime.prototype.firstDateOfMonth = function () {
    return DateTime.fromDate(this.getFullYear(), this.getMonth(), 1)
}

/**
 * Returns last date of month from current date
 * 从当前日期返回最后一个月的日期
 * @returns {DateTime}
 */
DateTime.prototype.lastDateOfMonth = function () {
    return DateTime.fromDate(this.getFullYear(), this.getMonth(), this.getDaysInMonth())
}

/**
 * Returns number of days between current and given date
 * 返回当前和给定日期之间的天数
 * @param date
 * @returns {number}
 */
DateTime.prototype.distanceInDays = function (date) {
    var first = parseInt(this.getTime() / DateTime.DAY, 10)
    var last = parseInt(date.getTime() / DateTime.DAY, 10)
    return (last - first)
}

/**
 * Returns new DateTime from same week with given weekDay
 * 返回新DateTime从同一周工作日
 * @param weekday 0=sunday, 1=monday, ...
 * @returns {DateTime}
 */
DateTime.prototype.withWeekday = function (weekday) {
    return this.plusDays(weekday - this.getDay())
}

/**
 * Returns new DateTime with midnight time
 * 返回新DateTime午夜时间
 * @returns {DateTime}
 */
DateTime.prototype.getOnlyDate = function () {
    return DateTime.fromDate(this.getFullYear(), this.getMonth(), this.getDate())
}

/**
 * Returns true if date is in weekend
 * 如果日期是在周末返回true
 * @returns {boolean}
 */
DateTime.prototype.isWeekend = function () {
    return this.getDay() === 6 || this.getDay() === 0
}

/**
 * Returns default string representation
 * 返回默认的字符串表示
 */
DateTime.prototype.toString = function () {
    return this.toISOString()
}

/**
 * Returns first date from same week
 * 返回从同一周的第一天
 * @param locale Based on locale it can be a monday or a sunday 地区基于语言环境可以是周一还是周日
 * @returns {DateTime}
 */
DateTime.prototype.getFirstDateOfWeek = function (locale) {
    return DateTime.getFirstDateOfWeek(this.getFullYear(), this.getMonth(), this.getDate(), locale)
}


/**
 * 查询第几周的第一天
 * @param {number} week
 * @param locale Based on locale it can be a monday or a sunday 地区基于语言环境可以是周一还是周日
 * @returns {DateTime}
 */
DateTime.prototype.getWeekOfFirstDate = function (week, locale) {
    if (week <= 0 || week > 5)return;
    let _week = this.getIndexInMonth();
    let d = 0
    if (_week === week) {
        return this.getFirstDateOfWeek(locale)
    } else {
        let day = this.getDate()
        d = day + (week - _week) * 7
    }
    return DateTime.getFirstDateOfWeek(this.getFullYear(), this.getMonth(), d, locale)
}


/**
 * 返回指定日期一周的第一天
 * @param year
 * @param month
 * @param day
 * @param locale
 * @return {DateTime}
 */
DateTime.getFirstDateOfWeek = function (year, month, day, locale) {
    var date = new Date(year, month - 1, day),
        _this = new DateTime(date);
    var firstWeekday = locale ? locale.firstWeekday : DateTime.MONDAY
    if (firstWeekday == _this.getDay) return _this.clone()
    else return _this.plusDays(firstWeekday - _this.getDay() - (firstWeekday > _this.getDay() ? 7 : 0))
}


DateTime.getStrToDate = function (dateStr) {
    if (!/^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]/.test(dateStr))return;
    var dateArr = dateStr.split(/[- : \/]/);
    var year = +dateArr[0];
    var month = +dateArr[1] - 1;
    var day = +dateArr[2] || 1;
    var hour = +dateArr[3] || 0;
    var minute = +dateArr[4] || 0;
    var second = +dateArr[5] || 0;
    return new DateTime(new Date(year, month, day, hour, minute, second));
}

/**
 * Returns ISO DateTime string: YYYY-MM-DDT:HH:MM:SS
 * 返回ISO DateTime字符串:YYYY-MM-DDT:HH:MM:SS
 * @returns {string}
 */
DateTime.prototype.toISOString = function () {
    return isoDate.call(this) + 'T' + isoTime.call(this)
}

/**
 * Returns ISO Date string: YYYY-MM-DD
 */
DateTime.prototype.toISODateString = function () {
    return isoDate.call(this)
}

/**
 * Returns true if current DateTime is between start and end DateTimes
 * 返回true,如果当前日期时间开始和结束日期时间之间
 * @param {DateTime} start
 * @param {DateTime} end
 * @returns {boolean}
 */
DateTime.prototype.isBetweenDates = function (start, end) {
    if (start.getTime() > end.getTime()) throw Error("start date can't be after end date")
    var onlyDate = this.getOnlyDate()
    return onlyDate.compareTo(start.getOnlyDate()) >= 0 && onlyDate.compareTo(end.getOnlyDate()) <= 0
}
/**
 * Returns index of given day from beginning of year
 * 返回指数从年初的一天
 * @param year year
 * @param month month
 * @param day day
 * @returns {Number} index number starting grom beginning of year
 */
DateTime.getDayInYear = function (year, month, day) {
    return DateTime.fromDate(year, 1, 1).distanceInDays(DateTime.fromDate(year, month, day)) + 1
}

function isoDate () {
    return this.getFullYear() + '-' + twoDigits(this.getMonth()) + '-' + twoDigits(this.getDate())
}

function isoTime () {
    return twoDigits(this.getHours()) + ':' + twoDigits(this.getMinutes()) + ':' + twoDigits(this.getSeconds())
}

function twoDigits (value) {
    return value < 10 ? '0' + value : '' + value
}

function createSafeDate (year, month, date, hours, minutes, seconds) {
    hours = hours || 0
    minutes = minutes || 0
    seconds = seconds || 0
    var newDate = new Date(year, month - 1, date, hours, minutes, seconds, 0)
    if (newDate.toString() === 'Invalid Date' ||
        month !== newDate.getMonth() + 1 ||
        year !== newDate.getFullYear() ||
        date !== newDate.getDate() ||
        hours !== newDate.getHours() ||
        minutes !== newDate.getMinutes() ||
        seconds !== newDate.getSeconds()) throw Error('Invalid Date: ' + year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds)
    return newDate
}

function parseDate (str) {
    var dateComponents = str.split('-')
    return {
        year: +dateComponents[0],
        month: +dateComponents[1],
        day: +dateComponents[2]
    }
}

function parseTime (str) {
    if (str) {
        var timeComponents = str.split(':')
        return {
            hours: +timeComponents[0],
            minutes: +timeComponents[1],
            seconds: +timeComponents[2] || 0
        }
    } else {
        return {hours: 0, minutes: 0}
    }
}

module.exports = DateTime

