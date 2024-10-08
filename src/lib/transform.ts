'use strict';
import { LastElement, ObjectRecord, DefaultObject, TransformType } from '../type';
import { Is } from './is';

export class Transform {
   // Trim the string value
   static trim(value: any, options?: { specialChars?: string; pos?: 'left' | 'right' | 'both' }): string {
      const str = Transform.toString(value);
      const chars = options?.specialChars?.split('')?.join('|') ?? '';
      const pos = options?.pos || 'both';
      const regex = /[\n\t\s]/;
      const lftTrim = () => {
         for (let i = 0, n = str.length; i < n; i++) {
            if (!str[i].match(regex) && (!chars.length || !chars.includes(str[i]))) {
               return str.substring(i);
            }
         }

         return '';
      };
      const rgtTrim = () => {
         for (let i = str.length - 1; i >= 0; i--) {
            if (!str[i].match(regex) && (!chars.length || !chars.includes(str[i]))) {
               return str.substring(0, i + 1);
            }
         }

         return '';
      };
      const bothTrim = () => {
         const output = lftTrim().split('');

         for (let i = output.length - 1; i >= 0; i--) {
            if (!output[i].match(regex) && (!chars.length || !chars.includes(output[i]))) {
               break;
            }

            output.splice(i, 1);
         }

         return output.join('');
      };

      switch (pos) {
         case 'left':
            return chars ? lftTrim() : str.trimStart();

         case 'right':
            return chars ? rgtTrim() : str.trimEnd();

         case 'both':
         default:
            return chars ? bothTrim() : str.trim();
      }
   }

   // Convert to string
   static toString(value: any): string {
      const type = typeof value;

      switch (type) {
         case 'string':
            return value;

         case 'object':
            if (Array.isArray(value) || value !== null) {
               return JSON.stringify(value);
            }

         default:
            return String(value);
      }
   }

   // Convert to JSON
   static toJsonObject<T extends any[] | ObjectRecord>(value: any, defaultJson?: T): DefaultObject<T> {
      if (Is.object(value) || Is.array(value)) {
         // The Json object must be a flat key-pair value
         value = JSON.stringify(value);
      }

      if (Is.string(value) && ['{', '['].includes(value[0])) {
         try {
            return JSON.parse(value);
         } catch {}
      }

      return <T>(Is.object(defaultJson) ? defaultJson : value === null || value === undefined ? {} : [value]);
   }

   // Convert to boolean
   static toBoolean(value: any): boolean {
      const type = typeof value;

      switch (type) {
         case 'number':
         case 'bigint':
            return value !== 0;

         case 'boolean':
            return value;

         case 'string':
            value = value.trim().toLowerCase();

            if (value === 'true' || value === '1') {
               return true;
            }

            if (value === 'false' || value === '0') {
               return false;
            }
      }

      return Boolean(value);
   }

   // Convert to number
   static toNumber(value: any): number {
      const type = typeof value;

      switch (type) {
         case 'number':
         case 'bigint':
            return value;

         case 'boolean':
            return value ? 1 : 0;

         default:
            const number = Number(value);

            return isNaN(number) ? 0 : number;
      }
   }

   // Convert to unique array
   static toArrayUnique(value: any): any[] {
      if (Array.isArray(value)) {
         const unique = [];

         for (const val of value) {
            if (!unique.length || unique.findIndex((uni) => Is.equals(uni, val)) === -1) {
               unique.push(val);
            }
         }

         return unique;
      }

      return [value];
   }

   // Convert a string to a safe URL path
   static toPath(value: any): string {
      return Transform.toString(value)
         .split(/\/+/g)
         .map((p) => Transform.toSlug(p))
         .filter((p) => !!p.trim())
         .join('/');
   }

   // Convert a string to a safe URL path
   static toSlug(value: any): string {
      return Transform.toNonAccent(value)
         .trim()
         .toLowerCase()
         .replace(/[^a-z0-9-/]/gi, '-')
         .replace(/-+/g, '-')
         .replace(/\/+/g, '/')
         .replace(/^\/+|\/+$/g, '')
         .replace(/^-+|-+$/g, '');
   }

   // Convert a string to alnum
   static toAlnum(value: any): string {
      return Transform.toString(value)
         .trim()
         .replace(/[^a-zA-Z0-9]/g, '');
   }

   static toNoneDiacritics(value: any): string {
      return Transform.toString(value)
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '');
   }

   static toNonAccent(value: any): string {
      value = Transform.toString(value)
         .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
         .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
         .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
         .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
         .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
         .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
         .replace(/đ/g, 'd')
         // Upper
         .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
         .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
         .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
         .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
         .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
         .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
         .replace(/Đ/g, 'D')
         .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // -> \/?~.
         .replace(/\u02C6|\u0306|\u031B/g, '');

      return Transform.toNoneDiacritics(value);
   }

   static toASCIIString(value: any): string {
      return Transform.toNoneDiacritics(Transform.toString(value)).replace(/[^a-zA-Z0-9\s]/g, '');
   }

   static toSafeFileName(value: any): string {
      let name = Transform.toNonAccent(value);
      let ext = '';

      if (name.includes('.')) {
         const parts = name.split('.');
         ext = <string>parts.pop();
         name = parts.join('.');
      }

      return `${Transform.toASCIIString(Transform.toPath(name))}${ext ? `.${ext}` : ''}`;
   }

   static toDefault<T extends any[]>(value: any, ...defValues: T): LastElement<T> {
      const nothing = [null, undefined, NaN];

      if (!nothing.includes(value)) {
         return value;
      }

      for (let i = 0, n = defValues.length; i < n; i++) {
         const def = defValues[i];

         if (!nothing.includes(def)) {
            return def;
         }
      }

      return undefined;
   }

   static toStripTags(value: any, allowedTags?: string): string {
      // Making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
      allowedTags = (((allowedTags || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
      const tags = /<\/?([a-z0-9]*)\b[^>]*>?/gi;
      const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
      let after = Transform.toString(value);
      // Removes the '<' char at the end of the string to replicate PHP's behaviour
      after = after.substring(after.length - 1) === '<' ? after.substring(0, after.length - 1) : after;

      // Recursively remove tags to ensure that the returned string doesn't contain forbidden tags after previous passes (e.g. '<<bait/>switch/>')
      while (true) {
         const before = after;
         after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowedTags.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
         });

         // Return once no more tags are removed
         if (before === after) {
            return after;
         }
      }
   }

   static toSafeHtml(value: any, options?: { allowedTags?: string[]; allowedAttributes?: string[] }): string {
      // Allowed HTML tags and attributes
      const allowedTags = Array.isArray(options?.allowedTags)
         ? options.allowedTags
         : [
              'p',
              'b',
              'i',
              'em',
              'strong',
              'a',
              'ul',
              'ol',
              'li',
              'br',
              'hr',
              'img',
              'table',
              'thead',
              'tfoot',
              'tr',
              'td',
              'th',
              'div',
              'span',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
           ];
      const allowedAttributes = Array.isArray(options?.allowedAttributes) ? options.allowedAttributes : ['href', 'src'];

      if (!allowedTags.length) {
         return Transform.toStripTags(value);
      }

      // Filter the input string
      return Transform.trim(value)
         .replace(/<\/?([^\>]+)>/gi, (match, foundStr) => {
            const tagName = foundStr.split(' ')[0];

            return allowedTags.includes(tagName)
               ? match
                    .replace(/([a-z0-9_-]+)\s*=\s*["']([^"']+)["']/gi, (match) => {
                       const attr = match.split('=')[0]?.trim();

                       return allowedAttributes.includes(attr) ? match.trim() : '';
                    })
                    .trim()
                    .replace(/<\s+/g, '<')
                    .replace(/\s+>/g, '>')
               : '';
         })
         .replace(/\s+/gi, ' ');
   }

   static clean<T>(value: T, toTypes: TransformType | TransformType[]): T {
      if (!Array.isArray(toTypes)) {
         toTypes = [toTypes];
      }

      for (const toType of toTypes) {
         value = Transform[toType].call(null, value);
      }

      return value;
   }
}
