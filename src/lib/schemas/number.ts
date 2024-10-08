import { IsNumberOptions } from '../../type';
import { Is } from '../is';
import { Util } from '../util';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { schemaErrors } from './constant';

export class NumberSchema extends BaseSchema {
   protected options: IsNumberOptions = {};

   integer(integer?: boolean): this {
      this.options.integer = integer === undefined || integer === true;

      return this;
   }

   min(min: number): this {
      this.options.min = min;

      return this;
   }

   max(max: number): this {
      this.options.max = max;

      return this;
   }

   buildSchema() {
      const type = this.options.integer === true ? 'integer' : 'number';

      return {
         type: this.isNullable() ? ['null', type] : type,
         minimum: this.options.min,
         maximum: this.options.max,
         description: this.options.description,
      };
   }

   buildSwagger(): Record<string, any> {
      return {
         type: this.options.integer === true ? 'integer' : 'number',
         required: !this.isOptional(),
         nullable: this.isNullable(),
         description: this.options.description,
         example: this.options.example,
         minimum: this.options.min,
         maximum: this.options.max,
      };
   }

   protected checkError(input: { value: any }): void {
      const { value } = input;

      if (Is.number(value)) {
         if (this.options.integer && !Number.isInteger(value)) {
            this.errors.push({ code: schemaErrors.NOT_AN_INTEGER });
         }

         if (Is.number(this.options.min) && value < this.options.min) {
            this.errors.push({ code: schemaErrors.NUMBER_MINIMUM, meta: { min: this.options.min } });
         }

         if (Is.number(this.options.max) && value > this.options.max) {
            this.errors.push({ code: schemaErrors.NUMBER_MAXIMUM, meta: { min: this.options.max } });
         }
      } else {
         this.errors.push({ code: this.options.integer ? schemaErrors.NOT_AN_INTEGER : schemaErrors.NOT_A_NUMBER });
      }
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }

   clone(): NumberSchema {
      return new NumberSchema().setOptions(Util.clone(this.options));
   }
}
