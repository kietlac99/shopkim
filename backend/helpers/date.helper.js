/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import moment from "moment";

import { DAY_OF_WEEK } from "../constants";

/**
 * Xử lý ngày của tháng
 * @param {*} date date = 1 => 01 | date = 11 =>11
 */

export function handleStringMonth(month) {
  if (month.toString().length === 1) {
    return `0${month.toString()}`;
  }
  return month.toString();
}

export function isValidateMonthRegex(dateString) {
  const regEx = /^\d{4}-\d{2}$/;
  return dateString.match(regEx) !== null;
}

export function isValidDate(stringDate) {
  const date = new Date(stringDate);
  const checkDate = date instanceof Date && !isNaN(date.valueOf());
  return checkDate;
}

/**
 * Chuyển giờ UTC sang giờ GMT + 7
 * @param {*} date String
 * @returns GMT +7 date
 */

export function convertUTCDateToLocalDate(date) {
  const parseDate = new Date(date);
  const newDate = new Date(
    parseDate.getTime() - parseDate.getTimezoneOffSet() * 60 * 1000
  );
  return newDate;
}

export function parseDateToStringWithFormat(Date) {
  return moment(Date.toString(), "YYYY-MM-DD");
}

export function parseISOToString() {
  const time = moment().format();
  const hasTime = `${time.substring(0, 19)}.000Z`;
  return hasTime;
}

export function subtractDay(dayInput, number) {
  const day = new Date(dayInput);
  day.setDate(day.getDate() - number);
  return day;
}

export function getWeekNumberOfYear(date) {
  const oneJan = moment(date, "YYYY-MM-DD");
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return result;
}

export function getAllDaysInMonth(year, month) {
  const date = moment(`${year}-${handleStringMonth(month)}`, "YYYY-MM");
  const dates = [];
  while (date.month() + 1 === month) {
    dates.push({
      date: date.format("YYYY-MM-DD"),
      // 1 => Monday
      // 7 => Sunday
      weekDay: DAY_OF_WEEK[date.isoWeekday()],
      weekYear: `${date.isoWeekYear()}-${handleStringMonth(date.isoWeek())}`,
    });
    date.add(1, "days");
  }
  return dates;
}
