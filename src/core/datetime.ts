'use strict';
export type DateTimeLike = number | string | Date | DateTime;
export type DateTimeUnit = 'year' | 'month' | 'week' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond';
export class DateTimeError extends Error {}
export class DateTime {
   private isValid: boolean;
   private offset: number;
   private date: Date;

   constructor(datetimeLike?: DateTimeLike, offset?: number | string) {
      const date = DateTime.parse(datetimeLike);
      this.isValid = !!date;

      if (date) {
         this.date = date;
         this.offset = this.date.getTimezoneOffset();

         if (offset !== undefined) {
            this.setOffset(offset);
         }
      } else {
         this.date = new Date(''); // An invalid date object
      }
   }

   public get valid() {
      return this.isValid;
   }

   public get iso() {
      return this.date.toISOString();
   }

   public get native() {
      return this.date;
   }

   public get tzOffset() {
      const hours = Math.floor(this.offset / 60);
      const minutes = Math.abs(this.offset) % 60;
      const prefix = hours <= 0 ? '+' : '-';

      return `${prefix}${String(Math.abs(hours)).padStart(2, '0')}:${String(Math.abs(minutes)).padStart(2, '0')}`;
   }

   static parseOffset(offset: number | string) {
      if (typeof offset === 'number') {
         return offset;
      }

      if (offset.match(/^[+-]?\d{2}:\d{2}$/)) {
         const [hours, minutes] = offset.split(':');
         let offsetNum = Number(minutes);

         if (['+', '-'].includes(hours[0])) {
            offsetNum += Number(hours.substring(1)) * 60;

            if (hours[0] === '-') {
               offsetNum = -offsetNum;
            }
         } else {
            offsetNum += Number(hours.substring(1)) * 60;
         }

         return -offsetNum;
      }

      throw new DateTimeError(`Invalid offset ${offset}, the offset format must be a number or the string like: +07:00`);
   }

   static from(datetimeLike?: DateTimeLike, offset?: number | string) {
      return new DateTime(datetimeLike, offset);
   }

   static now(offset?: number | string) {
      return DateTime.from('now', offset);
   }

   static utc() {
      return DateTime.now().utc();
   }

   static yesterday(offset?: number | string) {
      return DateTime.now(offset).prevDate().startOf();
   }

   static tomorrow(offset?: number | string) {
      return DateTime.now(offset).nextDate().startOf();
   }

   static parse(datetimeLike?: DateTimeLike) {
      if (datetimeLike instanceof DateTime) {
         datetimeLike = datetimeLike.valueOf();
      } else if (datetimeLike === 'now' || datetimeLike === undefined) {
         datetimeLike = Date.now();
      }

      if (!datetimeLike) {
         return false;
      }

      const date = new Date(datetimeLike);

      return Number.isNaN(date.getTime()) ? false : date;
   }

   static daysInMonth(month: number, year?: number) {
      const date = new Date(year || new Date().getFullYear(), month - 1, 27);
      const mon = date.getMonth();

      while (date.getMonth() === mon) {
         date.setDate(date.getDate() + 1);
      }

      date.setDate(date.getDate() - 1);

      return date.getDate();
   }

   static pad(value: number, number = 2) {
      return String(Math.abs(value)).padStart(number, '0');
   }

   daysInMonth() {
      return DateTime.daysInMonth(this.date.getMonth() + 1, this.date.getFullYear());
   }

   setOffset(offset: string | number) {
      offset = DateTime.parseOffset(offset);
      const offsetDifference = this.offset - offset;
      this.date.setTime(this.date.getTime() + offsetDifference * 60000);
      this.offset = offset;

      return this;
   }

   utc() {
      if (this.offset !== 0) {
         const utcTimeInMilliseconds = this.date.getTime() - -this.offset * 60000;
         this.date.setTime(utcTimeInMilliseconds);
         this.offset = 0;
      }

      return this;
   }

   clone() {
      const dt = DateTime.from(this.valueOf());
      dt.offset = this.offset;

      return dt;
   }

   add(interval: number, unit: DateTimeUnit = 'millisecond') {
      switch (unit) {
         case 'millisecond':
            this.date.setMilliseconds(this.date.getMilliseconds() + interval);
            break;

         case 'second':
            this.date.setSeconds(this.date.getSeconds() + interval);
            break;

         case 'minute':
            this.date.setMinutes(this.date.getMinutes() + interval);
            break;

         case 'hour':
            this.date.setHours(this.date.getHours() + interval);
            break;

         case 'date':
            this.date.setDate(this.date.getDate() + interval);
            break;

         case 'week':
            this.date.setDate(this.date.getDate() + 7 * interval);
            break;

         case 'month':
            this.date.setMonth(this.date.getMonth() + interval);
            break;

         case 'year':
            this.date.setFullYear(this.date.getFullYear() + interval);
            break;
      }

      return this;
   }

   addYear(year: number) {
      return this.add(year, 'year');
   }

   addMonth(month: number) {
      return this.add(month, 'month');
   }

   addWeek(week: number) {
      return this.add(week, 'week');
   }

   addDate(date: number) {
      return this.add(date, 'date');
   }

   addHour(hour: number) {
      return this.add(hour, 'hour');
   }

   addMinute(minute: number) {
      return this.add(minute, 'minute');
   }

   addSecond(second: number) {
      return this.add(second, 'second');
   }

   addMillisecond(millisecond: number) {
      return this.add(millisecond, 'millisecond');
   }

   nextDate() {
      return this.addDate(1);
   }

   prevDate() {
      return this.addDate(-1);
   }

   nextWeek() {
      return this.addWeek(1);
   }

   prevWeek() {
      return this.addWeek(-1);
   }

   nextMonth() {
      return this.addMonth(1);
   }

   prevMonth() {
      return this.addMonth(-1);
   }

   nextYear() {
      return this.addYear(1);
   }

   prevYear() {
      return this.addYear(-1);
   }

   startOf() {
      this.date.setHours(0, 0, 0, 0);

      return this;
   }

   endOf() {
      this.date.setHours(23, 59, 59, 999);

      return this;
   }

   format(pattern = 'YYYY-MM-DD HH:mm:ss Z', locale?: string) {
      const { date, tzOffset } = this;
      const { pad } = DateTime;
      let output = pattern.replace(/YYYY/g, date.getFullYear().toString());
      output = output.replace(/YY/g, date.getFullYear().toString().substring(2));
      output = output.replace(/MMMM/g, date.toLocaleString(locale, { month: 'long' }));
      output = output.replace(/MMM/g, date.toLocaleString(locale, { month: 'short' }));
      output = output.replace(/MM/g, pad(date.getMonth() + 1));
      output = output.replace(/DD/g, pad(date.getDate()));
      output = output.replace(/HH/g, pad(date.getHours()));
      output = output.replace(/mm/g, pad(date.getMinutes()));
      output = output.replace(/sss/g, pad(date.getMilliseconds(), 3));
      output = output.replace(/ss/g, pad(date.getSeconds()));
      output = output.replace(/dddd/g, date.toLocaleString(locale, { weekday: 'long' }));
      output = output.replace(/ddd/g, date.toLocaleString(locale, { weekday: 'short' }));
      output = output.replace(/x/g, date.getTime().toString());
      output = output.replace(/Z/g, tzOffset);

      return output;
   }

   diff(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      if (datetime instanceof DateTime) {
         datetime = datetime.clone();
      } else {
         datetime = DateTime.from(datetime);
      }

      const milliseconds = this.clone().valueOf() - datetime.valueOf();

      switch (unit) {
         case 'millisecond':
            return milliseconds;

         case 'second':
            return milliseconds * 1000;

         case 'minute':
            return Math.round(milliseconds / 60000); // 60 * 1000

         case 'hour':
            return Math.round(milliseconds / 3600000); // 60 * 60 * 1000

         case 'date':
            return Math.round(milliseconds / 86400000); // 3600 * 24 * 1000

         case 'week':
            return Math.round(milliseconds / 604800000); // 86400 * 7 * 1000
      }
   }

   gt(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) > 0;
   }

   gte(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) >= 0;
   }

   lt(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) < 0;
   }

   lte(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) <= 0;
   }

   eq(datetime?: DateTimeLike, unit: DateTimeUnit = 'millisecond') {
      return this.diff(datetime, unit) === 0;
   }

   // Primitive methods: toString => `${DateTime.now()}`, valueOf => +DateTime.now()
   toString() {
      return this.iso;
   }

   valueOf() {
      return this.date.getTime();
   }

   // Array syntax: [...DateTime.now()]
   *[Symbol.iterator]() {
      yield this.date.getFullYear();
      yield this.date.getMonth();
      yield this.date.getDate();
      yield this.date.getHours();
      yield this.date.getMinutes();
      yield this.date.getSeconds();
      yield this.date.getMilliseconds();
   }
}
