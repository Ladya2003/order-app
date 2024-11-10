import dayjs, { Dayjs } from 'dayjs';

const today = dayjs();

export const isToday = (date: Dayjs) => date.isSame(today, 'day');

export const isTomorrow = (date: Dayjs) =>
  date.isSame(today.add(1, 'day'), 'day');

export const isDayAfterTomorrow = (date: Dayjs) =>
  date.isSame(today.add(2, 'day'), 'day');
