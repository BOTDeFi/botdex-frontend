import { Moment } from 'moment';

/**
 * Returns `dateTime` as `Moment` object without hours, minutes, seconds and milliseconds.
 * It is useful for comparing dates (10.12.20 00:00:00.000 and 11.12.20 00:00:00.000).
 */
export const getMomentDate = (dateTime: Moment): Moment => {
  // Note: if you chain multiple actions to construct a date, you should start from a year, then a month, then a day etc. Otherwise you may get unexpected results, like when day=31 and current month has only 30 days
  return dateTime.clone().hours(0).minutes(0).seconds(0).milliseconds(0);
};

/**
 * Given (10.12.20) as `date` and (14:15:22.123) as `time`.
 * Returns compiled/merge date and time (10.12.20 14:15:0.000) WITHOUT seconds and milliseconds.
 */
export const getMomentMergedDateTime = (date: Moment, time: Moment): Moment => {
  // Note: if you chain multiple actions to construct a date, you should start from a year, then a month, then a day etc. Otherwise you may get unexpected results, like when day=31 and current month has only 30 days
  return date.clone().hours(time.hours()).minutes(time.minutes()).seconds(0).milliseconds(0);
};
