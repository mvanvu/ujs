import { Obj } from '../../src';

it('Core Object', () => {
   // # Pick
   expect(Obj.pick({ foo: 1, bar: 2 }, ['foo'])).toMatchObject({ foo: 1 });
   expect(Obj.pick({ foo: 1, bar: 2 }, ['bar'])).toMatchObject({ bar: 2 });
   expect(Obj.pick({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep'])).toMatchObject({ deep: { foo: 123, bar: 456 } });
   expect(Obj.pick({ foo: 1, bar: 2, deep: { foo: 123 } }, ['deep.foo'])).toMatchObject({ deep: { foo: 123 } });

   // # Omit
   expect(Obj.omit({ foo: 1, bar: 2 }, ['foo'])).toMatchObject({ bar: 2 });
   expect(Obj.omit({ foo: 1, bar: 2 }, ['bar'])).toMatchObject({ foo: 1 });
   expect(Obj.omit({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, ['deep'])).toMatchObject({ foo: 1, bar: 2 });

   const fromObj = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
   expect(Obj.omit(fromObj, ['deep.foo'])).toMatchObject({ foo: 1, bar: 2, deep: { bar: 456 } });

   // # Contains
   expect(Obj.contains({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { foo: 1 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { bar: 2 })).toBeTruthy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { bar: '2' })).toBeFalsy();
   expect(Obj.contains({ foo: 1, bar: 2 }, { deep: { foo: 123, bar: 456 } })).toBeFalsy();
   expect(Obj.contains({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }, { deep: { foo: 123, bar: 456 } })).toBeTruthy();
   expect(Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains({ deep: { foo: 123, bar: 456 } })).toBeTruthy();
   expect(Obj.from({ foo: 1, bar: 2, deep: { foo: 123, bar: 456 } }).contains('deep.bar')).toBeTruthy();

   // # Excludes
   const target = { foo: 1, bar: 2, deep: { foo: 123, bar: 456 } };
   Obj.excludes(target, 'bar');
   expect(target).not.toHaveProperty('bar');

   Obj.excludes(target, ['deep']);
   expect(target).toMatchObject({ foo: 1 });

   // # Extends
   const obj = Obj.extends({ foo: 1, bar: 2 }, { bar2: { num: 789 } }, { bar2: { num2: 91011 } });
   expect(obj).toHaveProperty('bar2.num', 789);
   expect(obj).toHaveProperty('bar2.num2', 91011);

   const obj2 = Obj.from({ foo: 1, bar: 2 });
   expect(obj2.extends({ bar2: { num: 789 } }, { bar2: { num2: 91011 } })).toHaveProperty('bar2.num2', 91011);

   // # Reset
   expect(Obj.from({ foo: 1, bar: 2 }).reset()).toMatchObject({});
});