import { IsBaseOptions } from '../../type';
import { Is } from '../is';
import { Util } from '../util';
import { UJS_CLASS_PROPERTIES, UJS_SWAGGER_PROPERTIES_ARRAY, UJS_SWAGGER_PROPERTIES_MODEL, schemaErrors } from './constant';
import 'reflect-metadata';

export abstract class BaseSchema {
   protected options: IsBaseOptions = {};
   protected errors?: any = null;
   protected value?: any = undefined;

   isNullable(): boolean {
      return this.options.nullable === true || (this.options.nullable === undefined && this.options.optional === true);
   }

   isOptional(): boolean {
      return this.options.optional === true;
   }

   isValidate(): boolean {
      return this.options.validate === undefined || this.options.validate === true;
   }

   setOptions(options: IsBaseOptions): this {
      this.options = options;

      return this;
   }

   getOptions(): IsBaseOptions {
      return this.options;
   }

   optional(optional?: boolean): this {
      this.options.optional = optional === undefined || optional === true;

      return this;
   }

   nullable(nullable?: boolean): this {
      this.options.nullable = nullable === undefined || nullable === true;

      return this;
   }

   allow(...values: any[]): this {
      this.options.allowValues = values;

      return this;
   }

   default<T>(value: T): this {
      this.options.defaultValue = value;

      return this;
   }

   reset(): this {
      this.value = undefined;
      this.errors = [];

      return this;
   }

   getErrors(): any {
      return this.errors;
   }

   getValue(): any {
      return this.value;
   }

   validate(validate?: boolean): this {
      this.options.validate = validate === undefined || validate;

      return this;
   }

   check(value: any): boolean {
      this.reset();
      this.value = value;
      const isOptional = this.isOptional();
      const isNullable = this.isNullable();
      const isAllowValue = Is.array(this.options.allowValues) && this.options.allowValues.findIndex((allowValue) => Is.equals(allowValue, value)) !== -1;

      if (!this.isValidate() || (isOptional && value === undefined) || (isNullable && value === null) || isAllowValue) {
         if (value === undefined && this.options.defaultValue !== undefined && !isAllowValue) {
            this.value = Util.clone(this.options.defaultValue);
         }

         return true;
      }

      if (value === undefined && !isOptional) {
         this.appendError('', { code: schemaErrors.REQUIRED });

         return false;
      }

      if (value === null && !isNullable) {
         this.appendError('', { code: schemaErrors.NOT_ALLOW_NULL });

         return false;
      }

      const input = { value };
      this.checkError(input, '');
      const isValid = Is.empty(this.errors);

      if (isValid && Is.primitive(value) && !Is.equals(value, input.value)) {
         // Update the primitive value
         this.value = input.value;
      }

      return isValid;
   }

   protected appendError(path: string, error: any): this {
      if (!Is.object(this.errors)) {
         this.errors = {};
      }

      const isLeafError = (e: any) => Is.array(e) && Is.object(e[0]) && Is.string(e[0].code);
      const setError = (p: string, e: any[]) => {
         p = p
            .replace(/\$|^\.|\.$/g, '')
            .replace(/\.+/g, '.')
            .replace(/\.\[/g, '[');

         if (!Is.array(this.errors[p])) {
            this.errors[p] = [];
         }

         this.errors[p].push(...e);
      };
      const flatten = (p: string, err: any) => {
         if (isLeafError(err)) {
            setError(p, err);
         } else if (Is.array(err)) {
            err.forEach((e, i) => {
               flatten(`${p}[${i}]`, e);
            });
         } else if (Is.object(err)) {
            if (Is.string(err.code)) {
               setError(p, [err]);
            } else {
               for (const k in err) {
                  const e = err[k];
                  const p2 = `${p}.${k}`;

                  if (isLeafError(e)) {
                     setError(p2, e);
                  } else {
                     flatten(p2, e);
                  }
               }
            }
         }
      };

      flatten(path, error);

      return this;
   }

   desc(description: string): this {
      this.options.description = description;

      return this;
   }

   eg(example: any): this {
      this.options.example = example;

      return this;
   }

   // Typesscript decorator for custom class
   decorate(): PropertyDecorator {
      const schema = this;

      return function (target: Object, propertyKey: PropertyKey): void {
         // Apply schema
         const schemaProperties = Reflect.getMetadata(UJS_CLASS_PROPERTIES, target) || {};
         Reflect.defineMetadata(UJS_CLASS_PROPERTIES, { ...schemaProperties, [propertyKey]: schema }, target);

         // Apply Swagger
         const swaggerProperties = (Reflect.getMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, target) || []) as string[];
         const property = `:${propertyKey as string}`;

         if (!swaggerProperties.includes(property)) {
            Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, [...swaggerProperties, property], target);
         }

         Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, schema.buildSwagger(), target, propertyKey as string);
      };
   }

   protected abstract checkError(input: { value: any }, path: string | undefined): void;
   abstract buildSchema(): Record<string, any>;
   abstract buildSwagger(): Record<string, any>;
   abstract clone(): BaseSchema;
}
