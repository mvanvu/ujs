import { ClassConstructor } from '../../type';
import { ObjectSchema, ObjectSchemaProps } from './object';
export declare class ClassRefSchema<T extends object> extends ObjectSchema<T> {
    private readonly classRef;
    constructor(classRef: ClassConstructor<T>);
    static collectAllProperties<T extends object>(ClassRef: ClassConstructor<T>): ObjectSchemaProps<T>;
    clone(): ClassRefSchema<T>;
}
