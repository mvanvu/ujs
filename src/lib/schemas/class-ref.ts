import { ClassConstructor } from '../../type';
import { Is } from '../is';
import { Util } from '../util';
import { ArraySchema } from './array';
import { BaseSchema } from './base';
import { UJS_CLASS_PROPERTIES, UJS_SWAGGER_PROPERTIES_ARRAY, UJS_SWAGGER_PROPERTIES_MODEL } from './constant';
import { ObjectSchema, ObjectSchemaProps } from './object';
import 'reflect-metadata';
export class ClassRefSchema<T extends object> extends ObjectSchema<T> {
   constructor(private readonly classRef: ClassConstructor<T>) {
      super(ClassRefSchema.collectAllProperties(classRef).schemaProps);
   }

   static collectAllProperties<T extends object>(classRef: ClassConstructor<T>): { schemaProps: ObjectSchemaProps<T>; swaggerProps: Record<string, any> } {
      const swaggerProps: Record<string, any> = {};
      const schemaProps = Util.clone(Reflect.getMetadata(UJS_CLASS_PROPERTIES, classRef.prototype) || {});
      const collectSwaggerProperties = (target: Object) => {
         Util.clone(Reflect.getMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, target) || []).forEach((prop: string) => {
            const property = prop.replace(/^:/, '');

            if (!swaggerProps[property]) {
               const swaggerProperty = Reflect.getMetadata(UJS_SWAGGER_PROPERTIES_MODEL, target, property);

               if (swaggerProperty) {
                  swaggerProps[property] = Util.clone(swaggerProperty);
               }
            }
         });
      };

      let parentClass = classRef;

      while (parentClass) {
         if ((Is.object(parentClass) || Is.func(parentClass)) && Is.object(parentClass.prototype)) {
            collectSwaggerProperties(parentClass.prototype);
            const parentProps = Reflect.getMetadata(UJS_CLASS_PROPERTIES, parentClass.prototype);

            if (Is.object(parentProps)) {
               for (const key in parentProps) {
                  if (!schemaProps[key]) {
                     schemaProps[key] = Util.clone(parentProps[key]);
                  }
               }
            }
         }

         parentClass = Object.getPrototypeOf(parentClass);
      }

      return { schemaProps, swaggerProps };
   }

   static Pick<T extends object, K extends keyof T>(classRef: ClassConstructor<T>, properties: K[]): ClassConstructor<Pick<T, (typeof properties)[number]>> {
      const pickedSchemaProps = {};
      const pickedSwaggerProps: string[] = [];
      const { schemaProps, swaggerProps } = ClassRefSchema.collectAllProperties(classRef);

      class UjsClassRefPickType {}
      Object.entries(schemaProps).forEach(([k, v]) => {
         if (properties.includes(k as any)) {
            pickedSchemaProps[k] = v;

            if (swaggerProps[k]) {
               pickedSwaggerProps.push(`:${k}`);
               Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, swaggerProps[k], UjsClassRefPickType.prototype, k);
            }
         }
      });
      Reflect.defineMetadata(UJS_CLASS_PROPERTIES, pickedSchemaProps, UjsClassRefPickType.prototype);
      Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, pickedSwaggerProps, UjsClassRefPickType.prototype);

      return UjsClassRefPickType as ClassConstructor<Pick<T, (typeof properties)[number]>>;
   }

   static Omit<T extends object, K extends keyof T>(classRef: ClassConstructor<T>, properties: K[]): ClassConstructor<Omit<T, (typeof properties)[number]>> {
      const omitSchemaProps = {};
      const omitSwaggerProps: string[] = [];
      const { schemaProps, swaggerProps } = ClassRefSchema.collectAllProperties(classRef);
      class UjsClassRefOmitType {}
      Object.entries(schemaProps).forEach(([k, v]) => {
         if (!properties.includes(k as any)) {
            omitSchemaProps[k] = v;

            if (swaggerProps[k]) {
               omitSwaggerProps.push(`:${k}`);
               Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, swaggerProps[k], UjsClassRefOmitType.prototype, k);
            }
         }
      });
      Reflect.defineMetadata(UJS_CLASS_PROPERTIES, omitSchemaProps, UjsClassRefOmitType.prototype);
      Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, omitSwaggerProps, UjsClassRefOmitType.prototype);

      return UjsClassRefOmitType as ClassConstructor<Omit<T, (typeof properties)[number]>>;
   }

   static Partial<T extends object>(classRef: ClassConstructor<T>): ClassConstructor<Partial<T>> {
      const partialSchemaProps = {};
      const partialSwaggerProps: string[] = [];
      const { schemaProps, swaggerProps } = ClassRefSchema.collectAllProperties(classRef);

      // Partial shouldn't have default value
      const removeDefaultValue = (schema: BaseSchema) => {
         schema.default(undefined);

         if (schema instanceof ObjectSchema) {
            const properties = schema.getProperties();

            if (properties) {
               Object.entries(properties).forEach(([, sc]) => removeDefaultValue(sc));
            }
         } else if (schema instanceof ArraySchema) {
            const items = schema.getItems();

            if (items) {
               if (Is.array(items)) {
                  items.forEach((item) => removeDefaultValue(item));
               } else {
                  removeDefaultValue(items);
               }
            }
         }
      };

      class UjsClassRefPartialType {}
      Object.entries<BaseSchema>(schemaProps).forEach(([k, v]) => {
         removeDefaultValue(v);
         partialSchemaProps[k] = v.optional();

         if (swaggerProps[k]) {
            partialSwaggerProps.push(`:${k}`);
            Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_MODEL, { ...swaggerProps[k], required: false }, UjsClassRefPartialType.prototype, k);
         }
      });
      Reflect.defineMetadata(UJS_CLASS_PROPERTIES, partialSchemaProps, UjsClassRefPartialType.prototype);
      Reflect.defineMetadata(UJS_SWAGGER_PROPERTIES_ARRAY, partialSwaggerProps, UjsClassRefPartialType.prototype);

      return UjsClassRefPartialType as ClassConstructor<Partial<T>>;
   }

   buildSwagger(): Record<string, any> {
      return {
         type: this.classRef,
         required: !this.isOptional(),
         nullable: this.isNullable(),
         description: this.options.description,
         example: this.options.example,
      };
   }

   array(): ArraySchema<this> {
      return new ArraySchema(this);
   }

   clone(): ClassRefSchema<T> {
      return new ClassRefSchema(this.classRef).setOptions(Util.clone(this.options));
   }
}
