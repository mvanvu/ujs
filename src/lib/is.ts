'use strict';
import { DateTime } from './datetime';
import {
   CreditCardType,
   IsBaseOptions,
   IsEnumOptions,
   IsIncludesOptions,
   IsNumberOptions,
   IsPrimitiveOptions,
   IsStringOptions,
   IsStrongPasswordOptions,
   ReturnsIsArray,
   ReturnsIsBoolean,
   ReturnsIsClass,
   ReturnsIsNumber,
   ReturnsIsObject,
   ReturnsIsPrimitive,
   ReturnsIsString,
} from '../type';

export class Is {
   static equals(a: any, b: any): boolean {
      if (a === b) {
         return true;
      }

      if ((a instanceof Date || a instanceof DateTime) && (b instanceof Date || b instanceof DateTime)) {
         return a.valueOf() === b.valueOf();
      }

      if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
         if (a.constructor !== b.constructor) {
            return false;
         }

         let length: number, i: number | IteratorResult<[any, any], any>;

         if (a.constructor === Array) {
            length = a.length;

            if (length !== b.length) {
               return false;
            }

            for (i = length; i-- !== 0; ) {
               if (Is.equals(a[i], b[i]) !== true) {
                  return false;
               }
            }

            return true;
         }

         if (a.constructor === Map) {
            if (a.size !== b.size) {
               return false;
            }

            let iter = a.entries();
            i = iter.next();
            while (i.done !== true) {
               if (b.has(i.value[0]) !== true) {
                  return false;
               }

               i = iter.next();
            }

            iter = a.entries();
            i = iter.next();

            while (i.done !== true) {
               if (Is.equals(i.value[1], b.get(i.value[0])) !== true) {
                  return false;
               }
               i = iter.next();
            }

            return true;
         }

         if (a.constructor === Set) {
            if (a.size !== b.size) {
               return false;
            }

            const iter = a.entries();
            i = iter.next();
            while (i.done !== true) {
               if (b.has(i.value[0]) !== true) {
                  return false;
               }
               i = iter.next();
            }

            return true;
         }

         if (a.buffer != null && a.buffer.constructor === ArrayBuffer) {
            length = a.length;

            if (length !== b.length) {
               return false;
            }

            for (i = length; i-- !== 0; ) {
               if (a[i] !== b[i]) {
                  return false;
               }
            }

            return true;
         }

         if (a.constructor === RegExp) {
            return a.source === b.source && a.flags === b.flags;
         }

         if (a.valueOf !== Object.prototype.valueOf) {
            return a.valueOf() === b.valueOf();
         }

         if (a.toString !== Object.prototype.toString) {
            return a.toString() === b.toString();
         }

         const keys = Object.keys(a).filter((key) => a[key] !== void 0);
         length = keys.length;

         if (length !== Object.keys(b).filter((key) => b[key] !== void 0).length) {
            return false;
         }

         for (i = length; i-- !== 0; ) {
            const key = keys[i];

            if (Is.equals(a[key], b[key]) !== true) {
               return false;
            }
         }

         return true;
      }

      // true if both NaN, false otherwise
      return a !== a && b !== b; // eslint-disable-line no-self-compare
   }

   static primitive<O extends IsPrimitiveOptions>(value: any, options?: O): value is ReturnsIsPrimitive<O> {
      return Is.each(options, value, (item: any) => {
         const typeOf = typeof item;
         const isPrimitive = item === null || ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined'].includes(typeOf);

         if (options?.type) {
            return (options.type === 'null' && item === null) || options.type === typeOf;
         }

         return isPrimitive;
      });
   }

   static empty(value: any, options?: IsBaseOptions): boolean {
      return Is.each(options, value, (item: any) => {
         switch (typeof item) {
            case 'boolean':
               return item === false;

            case 'number':
            case 'bigint':
               return item === 0 || !item;

            case 'string':
               return !item.trim().length;
         }

         if (item instanceof Date || item instanceof DateTime) {
            return isNaN(+item);
         }

         if (item instanceof Map || item instanceof Set) {
            return !item.size;
         }

         if (item !== null && typeof item === 'object') {
            return !Object.keys(item).length;
         }

         if (Array.isArray(item) || Buffer.isBuffer(item)) {
            return !item.length;
         }

         return !Boolean(item);
      });
   }

   static object<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O> {
      return Is.each(options, value, (item: any) => item !== null && typeof item === 'object' && !Array.isArray(item));
   }

   static json<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsObject<O> {
      return Is.each(options, value, (item: any) => {
         if (!Is.object(item) || !Is.array(item)) {
            return false;
         }

         const deepCheck = (data: any) => {
            if (Is.array(data)) {
               for (const datum of data) {
                  deepCheck(datum);
               }
            } else if (Is.object(data)) {
               if (Object.prototype.toString.call(data) !== '[object Object]') {
                  throw new Error();
               }

               for (const k in data) {
                  deepCheck(data[k]);
               }
            } else if (!Is.primitive(data)) {
               throw new Error();
            }
         };

         try {
            deepCheck(item);
         } catch {
            return false;
         }

         return true;
      });
   }

   static array<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsArray<O> {
      return Is.each(options, value, (item: any) => Array.isArray(item));
   }

   static asyncFunc(value: any, options?: IsBaseOptions): boolean {
      return Is.each(options, value, (item: any) => item instanceof (async () => {}).constructor);
   }

   static func(value: any, options?: IsBaseOptions): boolean {
      return Is.each(options, value, (item: any) => typeof item === 'function');
   }

   static callable(value: any, options?: IsBaseOptions): boolean {
      return Is.each(options, value, (item: any) => Is.func(item) || Is.asyncFunc(item));
   }

   static number<O extends IsNumberOptions>(value: any, options?: O): value is ReturnsIsNumber<O> {
      return Is.each(options, value, (item: any) => {
         if (
            typeof item !== 'number' ||
            isNaN(item) ||
            (options?.integer && !Number.isInteger(item)) ||
            (options?.min && item < options.min) ||
            (options?.max && item > options.max)
         ) {
            return false;
         }

         return true;
      });
   }

   static boolean<O extends IsBaseOptions>(value: any, options?: IsBaseOptions): value is ReturnsIsBoolean<O> {
      return Is.each(options, value, (item: any) => typeof item === 'boolean');
   }

   static string<O extends IsStringOptions>(value: any, options?: O): value is ReturnsIsString<O> {
      return Is.each(options, value, (item: any) => {
         if (
            typeof item !== 'string' ||
            (Is.number(options?.minLength) && item.length < options.minLength) ||
            (Is.number(options?.maxLength) && item.length > options.maxLength) ||
            (options?.notEmpty && !!item.length) ||
            (options?.format === 'email' &&
               !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  item,
               )) ||
            (options?.format === 'date-time' && !DateTime.parse(item)) ||
            (options?.format === 'creditCard' && !Is.creditCard(item)) ||
            (options?.format === 'ipV4' &&
               !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                  item,
               )) ||
            (options?.format === 'mongoId' && !/^[0-9a-fA-F]{24}$/.test(item)) ||
            (options?.format === 'url' && !Boolean(new URL(item))) ||
            (options?.format instanceof RegExp && !options.format.test(item))
         ) {
            return false;
         }

         return true;
      });
   }

   static nodeJs(): boolean {
      return (
         typeof global !== 'undefined' &&
         global &&
         typeof global.process !== 'undefined' &&
         typeof global.process.versions !== 'undefined' &&
         typeof global.process.versions.node !== 'undefined'
      );
   }

   static strongPassword<O extends IsStrongPasswordOptions>(value: any, options?: O): value is ReturnsIsString<O> {
      return Is.each(options, value, (item: any) => {
         if (typeof item !== 'string') {
            return false;
         }

         const minLength = options?.minLength ?? 8;
         const minSpecialChars = options?.minSpecialChars ?? 1;
         const minUpper = options?.minUpper ?? 1;
         const minLower = options?.minLower ?? 1;
         const minNumber = options?.minNumber ?? 1;

         if (
            item.length < minLength ||
            (item.match(/[._-~`@#$%^&*()+=,]/g) || []).length < minSpecialChars ||
            (item.match(/[A-Z]/g) || []).length < minUpper ||
            (item.match(/[a-z]/g) || []).length < minLower ||
            (item.match(/[0-9]/g) || []).length < minNumber
         ) {
            return false;
         }

         return true;
      });
   }

   static enum(value: any, options: IsEnumOptions): boolean {
      return Is.each(options, value, (item: any) => options.enumArray.includes(item));
   }

   static includes(value: any, options: IsIncludesOptions): boolean {
      return Is.each(options, value, (item: any) => {
         const { target } = options;

         if (Is.string(item)) {
            return Is.string(target) ? item.includes(target) : false;
         }

         if (Is.array(item)) {
            return item.includes(target);
         }

         if (Is.object(item) && (Is.object(target) || Is.string(target))) {
            if (Is.string(target)) {
               const paths = target.split('.');
               let o = value;

               for (let i = 0, n = paths.length; i < n; i++) {
                  const prop = paths[i];

                  if (!Is.object(o) || !o.hasOwnProperty(prop)) {
                     return false;
                  }

                  o = o[prop];
               }
            } else {
               for (const key in target) {
                  if (!value.hasOwnProperty(key) || !Is.equals(item[key], target[key])) {
                     return false;
                  }
               }
            }

            return true;
         }
      });
   }

   static class<O extends IsBaseOptions>(value: any, options?: O): value is ReturnsIsClass<O> {
      return Is.each(options, value, (item: any) => Is.func(item) && item.toString()?.startsWith('class '));
   }

   private static each(options: IsBaseOptions | undefined, value: any, callback: (item: any) => boolean): boolean {
      try {
         if (options?.isArray) {
            if (!Array.isArray(value)) {
               return false;
            }

            const unique = [];

            for (const val of value) {
               if (!callback(val) || (options.isArray === 'unique' && unique.findIndex((uni) => Is.equals(uni, val)) !== -1)) {
                  return false;
               }

               unique.push(val);
            }

            return true;
         }

         return callback(value);
      } catch {
         return false;
      }
   }

   private static creditCard(value: string, type?: CreditCardType): boolean {
      const amex = new RegExp('^3[47][0-9]{13}$').test(value);
      const visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$').test(value);
      const cup1 = new RegExp('^62[0-9]{14}[0-9]*$').test(value);
      const cup2 = new RegExp('^81[0-9]{14}[0-9]*$').test(value);
      const mastercard = new RegExp('^5[1-5][0-9]{14}$').test(value);
      const mastercard2 = new RegExp('^2[2-7][0-9]{14}$').test(value);
      const disco1 = new RegExp('^6011[0-9]{12}[0-9]*$').test(value);
      const disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$').test(value);
      const disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$').test(value);
      const diners = new RegExp('^3[0689][0-9]{12}[0-9]*$').test(value);
      const jcb = new RegExp('^35[0-9]{14}[0-9]*$').test(value);

      if (type) {
         switch (type) {
            case 'VISA':
               return visa;

            case 'AMEX':
               return amex;

            case 'MASTERCARD':
               return mastercard || mastercard2;

            case 'DISCOVER':
               return disco1 || disco2 || disco3;

            case 'DINERS':
               return diners;

            case 'JCB':
               return jcb;

            case 'CHINA_UNION_PAY':
               return cup1 || cup2;
         }
      }

      return amex || visa || cup1 || cup2 || mastercard || mastercard2 || disco1 || disco2 || disco3 || diners || jcb;
   }
}
