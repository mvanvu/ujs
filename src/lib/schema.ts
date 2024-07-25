import { IsBaseOptions, IsNumberOptions, IsStringOptionFormat, IsStringOptions } from '../type';
import { Is } from './is';

export class BaseSchema {
   protected options: IsBaseOptions = {};

   protected errors?: Record<string, string> = null;

   private readonly isType!: string;

   constructor() {
      this.isType = this.constructor.name.replace('Schema', '').toLowerCase();
   }

   isArray(isArray?: boolean | 'unique'): this {
      this.options.isArray = isArray === undefined || isArray === true;

      return this;
   }

   optional(optional?: boolean): this {
      this.options.optional = optional === undefined || optional === true;

      return this;
   }

   nullable(nullable?: boolean): this {
      this.options.nullable = nullable === undefined || nullable === true;

      return this;
   }

   check(value: any): boolean {
      // Reset errors
      this.errors = null;

      switch (this.isType) {
         case 'number':
         case 'boolean':
         case 'string':
            return Is[this.isType].call(this, value, this.options);

         default:
            return false;
      }
   }
}

export class StringSchema extends BaseSchema {
   protected options: IsStringOptions = {};

   minLength(num: number): this {
      this.options.minLength = num;

      return this;
   }

   maxLength(num: number): this {
      this.options.maxLength = num;

      return this;
   }

   notEmpty(notEmpty?: boolean): this {
      this.options.notEmpty = notEmpty === undefined || notEmpty === true;

      return this;
   }

   format(format: IsStringOptionFormat): this {
      this.options.format = format;

      return this;
   }
}

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
}

export class BooleanSchema extends BaseSchema {}

type ItemSchema = NumberSchema | ArraySchema | StringSchema | BooleanSchema | ObjectSchema;

const handleWhiteList = (objSchema: ObjectSchema, value: any, isWhiteList: boolean) => {
   if (!Is.object(value)) {
      throw new Error();
   }

   for (const k in value) {
      if (!objSchema.keys.includes(k)) {
         if (isWhiteList) {
            delete value[k];
            continue;
         }

         throw new Error();
      }
   }
};

const checkProperty = (properties: ItemSchema, value: any, isWhiteList?: boolean, path?: string) => {
   if (properties instanceof ObjectSchema) {
      if (isWhiteList === undefined) {
         isWhiteList = properties.isWhiteList;
      }

      handleWhiteList(properties, value, isWhiteList);
      properties.each((property, k) => checkProperty(property, value[k], isWhiteList));
   } else if (properties instanceof BaseSchema && !properties.check(value)) {
      throw new Error();
   }
};

export class ObjectSchema extends BaseSchema {
   private _isWhiteList = false;

   private properties: Record<string, ItemSchema> = {};

   get isWhiteList(): boolean {
      return this._isWhiteList;
   }

   get keys(): string[] {
      return Object.keys(this.properties);
   }

   each(callback: (property: ItemSchema, k: string) => any): void {
      if (!Is.callable(callback) || Is.empty(this.properties)) {
         return;
      }

      for (const k in this.properties) {
         callback.call(this, this.properties[k], k);
      }
   }

   props(props: Record<string, ItemSchema>): this {
      this.properties = props;

      return this;
   }

   whiteList(isWhiteList?: boolean): this {
      this._isWhiteList = isWhiteList === undefined || isWhiteList === true;

      return this;
   }

   check(value: any): boolean {
      return Is.each(this.options, value, (item) => {
         try {
            handleWhiteList(this, item, this.isWhiteList);
            this.each((prop, k) => checkProperty(prop, item[k], this.isWhiteList, k));
         } catch (err) {
            return false;
         }

         return true;
      });
   }
}

export class ArraySchema extends BaseSchema {
   private itemsProps: ItemSchema | ItemSchema[];

   items(itemsProps: ItemSchema | ItemSchema[]): this {
      this.itemsProps = itemsProps;

      return this;
   }

   check(value: any): boolean {
      return Is.each(this.options, value, (item) => {
         if (!Is.array(item)) {
            return false;
         }

         const { itemsProps } = this;

         if (itemsProps) {
            if (Is.array(itemsProps)) {
               if (itemsProps.length !== item.length) {
                  return false;
               }

               for (let i = 0, n = itemsProps.length; i < n; i++) {
                  if (!itemsProps[i].check(item[i])) {
                     return false;
                  }
               }
            } else {
               for (const element of item) {
                  if (!itemsProps.check(element)) {
                     return false;
                  }
               }
            }
         }

         return true;
      });
   }
}

export class Schema {
   static string(): StringSchema {
      return new StringSchema();
   }

   static number(): NumberSchema {
      return new NumberSchema();
   }

   static boolean(): BooleanSchema {
      return new BooleanSchema();
   }

   static object(): ObjectSchema {
      return new ObjectSchema();
   }

   static array(): ArraySchema {
      return new ArraySchema();
   }
}
