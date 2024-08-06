import { Schema } from '../../src';

it('Core Schema', async () => {
   // # Schema.string(options?: IsStringOptions): StringSchema
   expect(Schema.string().check(null)).toBeFalsy();
   expect(Schema.string().optional().check(null)).toBeTruthy();
   expect(Schema.string().nullable().check(null)).toBeTruthy();
   expect(Schema.string().nullable(false).check(null)).toBeFalsy();
   expect(Schema.string().check('')).toBeTruthy();
   expect(Schema.string().minLength(1).check('')).toBeFalsy();
   expect(Schema.string().minLength(0).check('')).toBeTruthy();
   expect(Schema.string().format('dateTime').check('2024-07-03T00:00:00.00')).toBeTruthy();
   expect(Schema.string().format('mongoId').check('507f1f77bcf86cd799439011')).toBeTruthy();
   expect(Schema.string().format('ipV4').check('192.168.1.1')).toBeTruthy();
   expect(Schema.string().format('ipV6').check('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBeTruthy();
   expect(Schema.string().format('mongoId').check('507f1f77bcf86cd799439011')).toBeTruthy();
   expect(Schema.string().format('email').check('example.email.com')).toBeFalsy();
   expect(Schema.string().format('email').check('example@email.com')).toBeTruthy();
   expect(Schema.string().format('creditCard').check('4000056655665556')).toBeTruthy();
   expect(Schema.string().format('url').check('https://www.domain.com/remove-an-item-from-an-array-in-javascript/')).toBeTruthy();
   expect(Schema.string().format('base64').check('SGVsbG8gV29ybGQ=')).toBeTruthy();
   expect(Schema.string().format('md5').check('3e25960a79dbc69b674cd4ec67a72c62')).toBeTruthy();
   expect(Schema.string().format('sha1').check('7b502c3a1f48c8609ae212cdfb639dee39673f5e')).toBeTruthy();
   expect(Schema.string().format('sha256').check('64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c')).toBeTruthy();
   expect(Schema.string().format('uuid').check('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBeTruthy();
   const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
   expect(Schema.string().format('jwt').check(jwt)).toBeTruthy();

   const regex = /^[0-9a-fA-F]{24}$/;
   expect(Schema.string().format(regex).check('507f1f77bcf86cd799439011')).toBeTruthy();
   expect(Schema.string().format(regex).check('507f1f77bcf86cd79943901g')).toBeFalsy();
   expect(Schema.string().strongPassword().check('MyStrongPwd@123')).toBeTruthy();
   expect(Schema.string().strongPassword({ minLength: 16 }).check('MyStrongPwd@123')).toBeFalsy();

   // # Schema.boolean(options?: IsBaseOptions): BooleanSchema
   expect(Schema.boolean().check(1)).toBeFalsy();
   expect(Schema.boolean().check(true)).toBeTruthy();
   expect(Schema.boolean().check(false)).toBeTruthy();
   expect(Schema.boolean().check([1, true])).toBeFalsy();
   expect(Schema.boolean().check([false, true])).toBeFalsy();
   expect(Schema.boolean().isArray().check([false, true])).toBeTruthy();
   expect(Schema.boolean().isArray('unique').check([false, false, true])).toBeFalsy();

   // # Schema.number(options?: IsNumberOptions): NumberSchema
   expect(Schema.number().check(1)).toBeTruthy();
   expect(Schema.number().check([1, 2, 3])).toBeFalsy();
   expect(Schema.number().isArray().check([1, 2, 3])).toBeTruthy();
   expect(Schema.number().check(1.25)).toBeTruthy();
   expect(Schema.number().integer().check(1.25)).toBeFalsy();
   expect(Schema.number().integer().min(3).check(2)).toBeFalsy();
   expect(Schema.number().integer().max(10).check(12)).toBeFalsy();
   expect(Schema.number().integer().max(10).check(9)).toBeTruthy();

   // # Object & Array
   // ## Schema.object<T extends object>(properties?: ObjectSchemaProps<T>): ObjectSchema<T>
   // ## array<T extends ItemSchema | ItemSchema[]>(itemsProps?: T): ArraySchema<T>
   expect(Schema.object().check({})).toBeTruthy();
   expect(Schema.object().check([])).toBeFalsy();
   expect(Schema.array().check([])).toBeTruthy();
   expect(Schema.array(Schema.number()).check([1, 1.5])).toBeTruthy();
   expect(Schema.array(Schema.number()).check([1, 1.5, true])).toBeFalsy();

   // # Deep Object/Array schema
   const schema = Schema.object({
      foo: Schema.number(),
      bar: Schema.object({ bar2: Schema.boolean() }),
      arrayAny: Schema.array(),
      arrayNumber: Schema.array(Schema.number()),
      arrayNumberBoolean: Schema.array([Schema.number(), Schema.boolean()]),
      arrayObject: Schema.array(
         Schema.object({
            number: Schema.number(),
            integer: Schema.number().integer(),
            boolean: Schema.boolean(),
            object: Schema.object({ array: Schema.array(Schema.array(Schema.number())) }),
         }).whiteList(),
      ),
      email: Schema.string().format('email'),
      minLength2: Schema.string().minLength(2),
      optional: Schema.string().optional(),
      nullable: Schema.string().nullable(),
   });

   const validValue = {
      foo: 123,
      bar: { bar2: true },
      arrayAny: ['1', 2, true, [], {}],
      arrayNumber: [1, 2.5, 3],
      arrayNumberBoolean: [123, false],
      arrayObject: [
         {
            number: 1.5,
            integer: 1,
            boolean: false,
            object: {
               array: [
                  [123, 456],
                  [789, 11112],
               ],
            },
         },
      ],
      email: 'admin@email.com',
      minLength2: '12',
      // optional: undefined, // No need to set undefined as it's already as undefined
      nullable: null,
   };

   expect(schema.check(validValue)).toBeTruthy();

   const invalidValue = {
      foo: 123,
      bar: { bar2: true, noAcceptProp: 'OOps!' },
      arrayAny: ['1', 2, true, [], {}],
      arrayNumber: [1, 2.5, 3],
      arrayNumberBoolean: [123, false],
      arrayObject: [
         {
            number: 1.5,
            integer: 1,
            boolean: false,
            object: {
               array: [
                  [123, 456],
                  [789, 11112],
               ],
            },
            noAcceptProp: 'OOps!',
         },
      ],
      email: 'admin@email.com',
      minLength2: '12',
      nullable: null,
      noAcceptProp: 'OOps!',
   };

   expect(schema.check(invalidValue)).toBeFalsy();
   expect(schema.whiteList().check(invalidValue)).toBeTruthy();
   expect(invalidValue).not.toHaveProperty('noAcceptProp');
   expect(invalidValue.bar).not.toHaveProperty('noAcceptProp');
   expect(invalidValue.arrayObject[0]).not.toHaveProperty('noAcceptProp');

   // # Schema.enum(emum: EnumElement[]): EnumSchema
   expect(Schema.enum(['Active', 'Inactive', true, false, 1, 0]).check('Inactive')).toBeTruthy();
   expect(Schema.enum(['Active', 'Inactive', true, false, 1, 0]).check(null)).toBeFalsy();

   console.log(JSON.stringify(schema.buildSchema(), null, 2));
});
