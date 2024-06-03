import { Is, DateTime } from '../../src';

it('Core Is', () => {
   // # Common Type
   /**
   -- 'string'       -> String (native)
   -- 'number'       -> Number (native)
   -- 'snumber'      -> Signed number
   -- 'unumber'      -> Unsigned number
   -- 'int'          -> Integer
   -- 'sint'         -> Signed integer
   -- 'uint'         -> Unsigned integer
   -- 'bigint'       -> Bigint (native)
   -- 'sbigint'      -> Signed bigint
   -- 'ubigint'      -> Unsigned bigint
   -- 'object'       -> Object (native)
   -- 'array'        -> Array (native)
   -- 'boolean'      -> Boolean (native)
   -- 'undefined'    -> undefined (primitive)
   -- 'symbol'       -> Symbol (native)
   -- 'function'     -> Function (native)
   -- 'null'         -> null (primitive)
   -- 'regex'        -> Regex (native)
   -- 'set'          -> Set (native)
   -- 'map'          -> Map (native)
   -- 'NaN'          -> NaN (native)
   -- 'date'         -> Date (native)
   -- 'datetime'     -> [DateTime](/Datetime.md)
   -- 'datestring'   -> String date
    */
   // # Is.emptyObject(obj: any): boolean
   // ## Check the object is empty, returns false if the value is not an object
   expect(Is.emptyObject(null)).toBeFalsy();
   expect(Is.emptyObject([])).toBeFalsy();
   expect(Is.emptyObject({ foo: 'bar' })).toBeFalsy();
   expect(Is.emptyObject({})).toBeTruthy();

   // # Is.date(d: any): boolean
   // ## Check the value is instance of Date
   expect(Is.date(new Date())).toBeTruthy();
   expect(Is.date('')).toBeFalsy();

   // # Is.datetime(d: any): boolean
   // ## Check the value is instance of [DateTime](Datetime.md)
   expect(Is.datetime(DateTime.now())).toBeTruthy();

   // # Is.dateString(d: any): boolean
   // ## Check the value is a valid string date, returns false if the value is not a string
   expect(Is.dateString('2024-02-28')).toBeTruthy();

   // # Is.asyncFunc(value: any): boolean
   // ## Check the value is an async function
   expect(Is.asyncFunc(null)).toBeFalsy();
   expect(Is.asyncFunc(() => {})).toBeFalsy();
   expect(Is.asyncFunc(async () => {})).toBeTruthy();

   // # Is.int(value: any, each = false): boolean
   // ## Check the value is an integer number
   expect(Is.int(123)).toBeTruthy();

   // ## Check the value is a signed integer number
   expect(Is.sInt(1)).toBeFalsy();

   // ## Check the value is a unsigned integer number
   expect(Is.uInt(-123.4)).toBeFalsy();

   // ## Check for each element of the array
   expect(Is.int([123, 456, 789], true)).toBeTruthy();
   expect(Is.int([123, '456', 789], true)).toBeFalsy();

   // # Is.bigInt(value: any, each = false): boolean
   // ## Check the value is a big integer number
   expect(Is.bigInt(1)).toBeFalsy();
   expect(Is.bigInt(1n)).toBeTruthy();

   // ## Check the value is a signed integer number
   expect(Is.sBigInt(-1n)).toBeTruthy();

   // ## Check the value is a unsigned integer number
   expect(Is.uBigInt(1n)).toBeTruthy();

   // ## Check for each element of the array
   expect(Is.bigInt([1n, 2n, 3n], true)).toBeTruthy();
   expect(Is.bigInt([1n, 2n, 3], true)).toBeFalsy();

   // # Is.number(value: any, each = false): boolean
   // ## Check the value is a number
   expect(Is.number(-123)).toBeTruthy();

   const n = Is.number('123');

   // ## Check the value is a signed number
   expect(Is.sNumber(123)).toBeFalsy();

   // ## Check the value is a unsigned number
   expect(Is.uNumber(123.456)).toBeTruthy();

   // ## Check for each element of the array
   expect(Is.number([1, 1.5, 2], true)).toBeTruthy();
   expect(Is.uNumber([1, 2, 3], true)).toBeTruthy();
   expect(Is.sNumber([1, 2, 3], true)).toBeFalsy();

   // # Is.undefined(value: any, each = false): boolean
   // ## Check the value is undefined
   expect(Is.undefined(undefined)).toBeTruthy();

   // ## Check for each element of the array
   expect(Is.undefined([undefined, null], true)).toBeFalsy();

   // # Is.null(value: any, each = false): boolean
   // ## Check the value is null
   expect(Is.null(null)).toBeTruthy();

   // ## Check for each element of the array
   expect(Is.null([undefined, null], true)).toBeFalsy();

   // # Is.object(value: any, options?: { rules: ObjectCommonType; suitable?: boolean }): boolean
   // ## Check the value is a valid object key-value pair
   expect(Is.object(null)).toBeFalsy();
   expect(Is.object({})).toBeTruthy();
   expect(Is.object([])).toBeFalsy();

   // ## Check and validate the object
   // ## Must only "foo" property
   expect(Is.object({ foo: 123, bar: 456 }, { rules: { foo: 'number' } })).toBeFalsy();

   // ## Check rules only
   expect(Is.object({ foo: 123, bar: 456 }, { rules: { foo: 'number' }, suitable: false })).toBeTruthy();

   // ## Matched any properties
   expect(Is.object({ foo: 123, bar: false }, { rules: { foo: 'number', bar: 'boolean' } })).toBeTruthy();

   // ## Deep check
   expect(Is.object({ foo: 123, bar: false }, { rules: { foo: 'number', bar: { number: 'number' } } })).toBeFalsy();

   // # Is.array(value: any, options?: { rules: CommonType | ObjectCommonType; suitable?: boolean; notEmpty?: boolean }): boolean
   // ## Check the value is a valid array
   expect(Is.array({})).toBeFalsy();
   expect(Is.array([1, 2, 3])).toBeTruthy();

   // ## Check and validate each element of the array
   expect(Is.array([1, 2, 3], { rules: 'uint' })).toBeTruthy();
   expect(Is.array([1, 2, -3], { rules: 'sint' })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number', bar: 'string' } })).toBeFalsy();
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' } })).toBeFalsy();

   // ## Defaults of suitable is true, the object must be matched with the option rules
   expect(Is.array([{ foo: 123, bar: 456 }], { rules: { foo: 'number' }, suitable: false })).toBeTruthy();
   expect(Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: 'boolean' } })).toBeTruthy();
   expect(Is.array([{ foo: 123, bar: false }], { rules: { foo: 'number', bar: { number: 'number' } } })).toBeFalsy();

   // # Is.equals(a: any, b: any): boolean
   // ## Compare two values are equals or not
   expect(Is.equals(123, '123')).toBeFalsy();
   expect(Is.equals(undefined, null)).toBeFalsy();
   expect(Is.equals(123, 123)).toBeTruthy();

   const date = new Date();
   const date2 = DateTime.from(date).native;
   expect(Is.equals(date, date2)).toBeTruthy();
   expect(Is.equals(date2, DateTime.from(date))).toBeTruthy();

   // ## Deep
   expect(Is.equals({}, {})).toBeTruthy();
   expect(Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar' })).toBeTruthy();
   expect(Is.equals({ foo: 'bar', bar: 123 }, { bar: 123, foo: 'bar2' })).toBeFalsy();
   expect(Is.equals({ foo: 'bar', bar: 123 }, { bar: 123 })).toBeFalsy();

   // # @deprecated Is.flatValue(value: any): boolean
   // Is.primitive(value: any): boolean

   expect(Is.primitive(123)).toBeTruthy();
   expect(Is.primitive(-123)).toBeTruthy();
   expect(Is.primitive(null)).toBeTruthy();
   expect(Is.primitive(void 0)).toBeTruthy();
   expect(Is.primitive('')).toBeTruthy();
   expect(Is.primitive(true)).toBeTruthy();
   expect(Is.primitive(false)).toBeTruthy();
   expect(Is.primitive(NaN)).toBeTruthy();
   expect(Is.primitive([])).toBeFalsy();
   expect(Is.primitive({})).toBeFalsy();
   expect(Is.primitive(() => {})).toBeFalsy();
   expect(Is.primitive(new Set())).toBeFalsy();
   expect(Is.primitive(new Map())).toBeFalsy();

   // # Is.empty(value: any): boolean
   expect(Is.empty(0)).toBeTruthy();
   expect(Is.empty(0.0)).toBeTruthy();
   expect(Is.empty(false)).toBeTruthy();
   expect(Is.empty(null)).toBeTruthy();
   expect(Is.empty('  ')).toBeTruthy();
   expect(Is.empty([])).toBeTruthy();
   expect(Is.empty({})).toBeTruthy();
   expect(Is.empty(new Date(''))).toBeTruthy();
   expect(Is.empty(new Date())).toBeFalsy();
   expect(Is.empty(true)).toBeFalsy();
   expect(Is.empty(-1)).toBeFalsy();
   expect(Is.empty('foo')).toBeFalsy();
   expect(Is.empty([1])).toBeFalsy();
   expect(Is.empty({ foo: 'bar' })).toBeFalsy();

   // # Is.nothing(value: any): boolean
   // ## Check the value is null | undefined | NaN
   expect(Is.nothing(null)).toBeTruthy();
   expect(Is.nothing(undefined)).toBeTruthy();
   expect(Is.nothing(NaN)).toBeTruthy();
   expect(Is.nothing(false)).toBeFalsy();

   const arr = [{ foo: 123, bar: { number: { digit: 123 } } }];
   expect(Is.array(arr, { rules: { foo: 'number', bar: { number: { digit: 'uint' } } } })).toBeTruthy();

   // # Is.strongPassword(value: string, options?: { minLength?: number; noSpaces?: boolean; minSpecialChars?: number; minUpper?: number; minLower?: number; minNumber?: number; }): boolean
   // ## Check the value is a strong password, returns false if the value is not a string
   const pwd = 'MyStrongPwd@123';
   expect(Is.strongPassword(pwd)).toBeTruthy();
   expect(Is.strongPassword(pwd, { minLength: pwd.length + 1 })).toBeFalsy();
   expect(Is.strongPassword('MyWeakPwd@')).toBeFalsy();
   expect(Is.strongPassword(`${pwd} has space`)).toBeFalsy();
   expect(Is.strongPassword(`${pwd} has space`, { noSpaces: false })).toBeTruthy();

   // # Is.flatObject(value: any, allowArray?: boolean | { root?: boolean; deep?: boolean }): boolean
   // ##  The flat object contains all the properties which are flat value (primitive)
   expect(Is.flatObject({ foo: new Map(), bar: new Set() })).toBeFalsy();

   // ## Defaults to allow deep properties as array
   expect(Is.flatObject({ foo: 1, bar: [{ bar: 2 }] })).toBeTruthy();

   // ## Don't allow deep properties as  array
   expect(Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, false)).toBeFalsy();

   // ## More options: Allow properies as array on root level and don't allow properties as array on deep level
   expect(Is.flatObject({ foo: 1, bar: [{ bar: 2 }] }, { root: false, deep: true })).toBeFalsy();
   expect(Is.flatObject({ foo: 1, bar: 2 }, { root: false, deep: true })).toBeTruthy();

   // # Is.includes(value: any, target: any): boolean
   // ## When the value is string or array
   expect(Is.includes('Hello World', 'ello Wor')).toBeTruthy();
   expect(Is.includes(['Hello World'], 'ello Wor')).toBeFalsy();
   expect(Is.includes(['Hello', 'World'], 'World')).toBeTruthy();

   // ## When the value is object and the target is object or string
   expect(Is.includes({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { foo: 1 })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { bar: 2 })).toBeTruthy();
   expect(Is.includes({ foo: 1, bar: 2 }, { bar: '2' })).toBeFalsy();
   expect(Is.includes({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } })).toBeFalsy();
   expect(Is.includes({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } })).toBeTruthy();

   // ## Otherwise will returns false
   expect(Is.includes(123, 'string')).toBeFalsy();
   expect(Is.includes('string', false)).toBeFalsy();
   expect(Is.includes(null, 'string')).toBeFalsy();
   expect(Is.includes({}, false)).toBeFalsy();

   // # Is.class(value: any, each = false): boolean
   expect(Is.class(class Foo {})).toBeTruthy();
   expect(Is.class([class Foo {}, class Bar {}], true)).toBeTruthy();
   expect(Is.class(function () {})).toBeFalsy();

   // # Is.mongoId(value: any, each = false): boolean
   expect(Is.mongoId('507f1f77bcf86cd799439011')).toBeTruthy();
   expect(Is.mongoId(['507f1f77bcf86cd799439011', '507f191e810c19729de860ea'], true)).toBeTruthy();
   expect(Is.mongoId(1)).toBeFalsy();
   expect(Is.mongoId([1, 2], true)).toBeFalsy();

   // # Is.creditCard(value: any, type?: CreditCardType, each = false): boolean\
   expect(Is.creditCard('4000056655665556', 'VISA')).toBeTruthy();
   expect(Is.creditCard('2223003122003222', 'MASTERCARD')).toBeTruthy();
   expect(Is.creditCard('6011111111111117', 'DISCOVER')).toBeTruthy();
   expect(Is.creditCard('36227206271667', 'DINERS')).toBeTruthy();
   expect(Is.creditCard('3566002020360505', 'JCB')).toBeTruthy();

   // # Is.arrayUnique
   expect(Is.arrayUnique([1, 2, 3])).toBeTruthy();
   expect(Is.arrayUnique([1, 1, 2])).toBeFalsy();
   expect(Is.arrayUnique([{ foo: 123 }, { foo: 456 }])).toBeTruthy();
   expect(Is.arrayUnique([{ foo: 123 }, { foo: 123 }])).toBeFalsy();

   // # Is.valid<T extends IsValidType>(value: any, options: IsValidOptions<T>): boolean
   // ## Validate the value with the specific options
   expect(Is.valid('I am a string', { type: 'string' })).toBeTruthy();
   expect(Is.valid(['Str 1', 'Str 2'], { type: 'string', each: true })).toBeTruthy();
   expect(Is.valid(['Str 1', 'Str 2', 3], { type: 'string', each: true })).toBeFalsy();
   expect(Is.valid({}, { type: 'object' })).toBeTruthy();
   expect(Is.valid({ foo: 1, bar: false }, { type: 'object', meta: { suitable: true, rules: { foo: 'number', bar: 'boolean' } } })).toBeTruthy();
   expect(Is.valid({ foo: 1, bar: false }, { type: 'flatObject' })).toBeTruthy();
   expect(Is.valid({ foo: 1, bar: false }, { type: 'objectOrArray', meta: { object: { rules: { foo: 'number', bar: 'boolean' } } } })).toBeTruthy();
   expect(Is.valid([{ foo: 1, bar: false }], { type: 'objectOrArray', meta: { array: { rules: { foo: 'number', bar: 'boolean' } } } })).toBeTruthy();
   expect(Is.valid([{ foo: 123, bar: 456 }], { type: 'array', meta: { rules: { foo: 'number' }, suitable: false } })).toBeTruthy();
   expect(Is.valid([{ foo: 123, bar: 456 }], { type: 'array', meta: { rules: { foo: 'number' }, suitable: true } })).toBeFalsy();
   expect(Is.valid({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { type: 'includes', meta: { deep: { foo: 123, bar: 456 } } })).toBeTruthy();
   expect(Is.valid(class Foo {}, { type: 'class' })).toBeTruthy();
   expect(Is.valid(['4242424242424242', '4000056655665556'], { type: 'creditCard', each: true, meta: 'VISA' })).toBeTruthy();
   expect(Is.valid(['5555555555554444', '2223003122003222', '5105105105105100'], { type: 'creditCard', each: true, meta: 'MASTERCARD' })).toBeTruthy();
   expect(Is.valid(['6011111111111117', '6011000990139424', '6011981111111113'], { type: 'creditCard', each: true, meta: 'DISCOVER' })).toBeTruthy();
   expect(Is.valid(['3056930009020004', '36227206271667'], { type: 'creditCard', each: true, meta: 'DINERS' })).toBeTruthy();
});
