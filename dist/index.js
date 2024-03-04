!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("$ujs",[],e):"object"==typeof exports?exports.$ujs=e():t.$ujs=e()}(this,(()=>(()=>{"use strict";var t={611:function(t,e,r){var s,n=this&&this.__classPrivateFieldGet||function(t,e,r,s){if("a"===r&&!s)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!s:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?s:"a"===r?s.call(t):s?s.value:e.get(t)},i=this&&this.__classPrivateFieldSet||function(t,e,r,s,n){if("m"===s)throw new TypeError("Private method is not writable");if("a"===s&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===s?n.call(t,r):n?n.value=r:e.set(t,r),r};Object.defineProperty(e,"__esModule",{value:!0}),e.Arr=void 0;const a=r(667),o=r(336);class c extends Array{constructor(){super(...arguments),s.set(this,0)}get elements(){return[...this.values()]}get currentIndex(){return n(this,s,"f")}static calc(t,e){if(!t.length)return;const r=e.type,s=e?.key??"";switch(r){case"sum":case"avg":let e=0;for(const r of t)"number"==typeof r?e+=Number(r)||0:s&&o.Is.object(r)&&(e+=a.Registry.from(r).get(s,0,"toNumber"));return"sum"===r?e:e/t.length;case"min":case"max":const n={value:Number.MAX_VALUE*("min"===r?1:-1),index:-1};for(let e=0,i=t.length;e<i;e++){const i=t[e];if("number"==typeof i&&(i<n.value&&"min"===r||i>n.value&&"max"===r))n.value=i,n.index=e;else if(s&&o.Is.object(i)){const t=a.Registry.from(i).get(s);"number"==typeof t&&(t<n.value&&"min"===r||t>n.value&&"max"===r)&&(n.value=t,n.index=e)}}return t[n.index]}}static sum(t,e){return c.calc(t,{...e||{},type:"sum"})}static avg(t,e){return c.calc(t,{...e||{},type:"avg"})}static min(t,e){return c.calc(t,{...e||{},type:"min"})}static max(t,e){return c.calc(t,{...e||{},type:"max"})}static compare(t,e,r){const s=[];for(const n of t){let t=!!e.find((t=>o.Is.equals(t,n)));"diff"===r&&(t=!t),t&&!s.find((t=>o.Is.equals(t,n)))&&s.push(n)}for(const n of e){let e=!!t.find((t=>o.Is.equals(t,n)));"diff"===r&&(e=!e),e&&!s.find((t=>o.Is.equals(t,n)))&&s.push(n)}return s}static intersect(t,e){return c.compare(t,e,"intersect")}static diff(t,e){return c.compare(t,e,"diff")}static chunk(t,e=1){const r=[];let s=0;e=parseInt(e.toString());for(let n=0,i=t.length;n<i;n++){let i=r[s];i&&i.length>=e&&(i=r[++s]),i||r.push(i=[]),i.push(t[n])}return r}static from(t){const e=new c;return e.push(...Array.from(t)),e}sum(t){return c.sum(this.elements,t)}avg(t){return c.avg(this.elements,t)}min(t){return c.min(this.elements,t)}max(t){return c.max(this.elements,t)}intersect(t){return c.intersect(this.elements,t)}diff(t){return c.diff(this.elements,t)}chunk(t=1){return c.chunk(this.elements,t)}reset(){return i(this,s,0,"f"),this}current(){return this.elements[n(this,s,"f")]}first(){return this.elements[i(this,s,0,"f")]}last(){return this.elements[i(this,s,this.elements.length-1,"f")]}prev(){const t=n(this,s,"f")-1;return void 0!==this.elements[t]&&i(this,s,t,"f"),this.elements[t]}next(){const t=n(this,s,"f")+1;return void 0!==this.elements[t]&&i(this,s,t,"f"),this.elements[t]}walk(t,e){if("function"==typeof e){if("number"!=typeof t)switch(t){case"first":t=0;break;case"last":t=this.elements.length-1;break;case"prev":t=n(this,s,"f")-1;break;case"next":t=n(this,s,"f")+1}return void 0!==this.elements[t]?(i(this,s,t,"f"),e.apply(this,[t,this.elements])):void 0}}empty(){return this.splice(0,this.elements.length),this}update(t){return this.empty().push(...c.from(t)),this}}e.Arr=c,s=new WeakMap},845:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DateTime=e.DateTimeError=void 0;class r extends Error{}e.DateTimeError=r;class s{constructor(t,e){const r=s.parse(t);this.isValid=!!r,r?(this.date=r,this.offset=this.date.getTimezoneOffset(),void 0!==e&&this.setOffset(e)):this.date=new Date("")}get valid(){return this.isValid}get iso(){return this.date.toISOString()}get native(){return this.date}get tzOffset(){const t=Math.floor(this.offset/60),e=Math.abs(this.offset)%60;return`${t<=0?"+":"-"}${String(Math.abs(t)).padStart(2,"0")}:${String(Math.abs(e)).padStart(2,"0")}`}static parseOffset(t){if("number"==typeof t)return t;if(t.match(/^[+-]?\d{2}:\d{2}$/)){const[e,r]=t.split(":");let s=Number(r);return["+","-"].includes(e[0])?(s+=60*Number(e.substring(1)),"-"===e[0]&&(s=-s)):s+=60*Number(e.substring(1)),-s}throw new r(`Invalid offset ${t}, the offset format must be a number or the string like: +07:00`)}static from(t,e){return new s(t,e)}static now(t){return s.from("now",t)}static utc(){return s.now().utc()}static yesterday(t){return s.now(t).prevDate().startOf()}static tomorrow(t){return s.now(t).nextDate().startOf()}static parse(t){if(t instanceof s?t=t.valueOf():"now"!==t&&void 0!==t||(t=Date.now()),!t)return!1;const e=new Date(t);return!Number.isNaN(e.getTime())&&e}static daysInMonth(t,e){const r=new Date(e||(new Date).getFullYear(),t-1,27),s=r.getMonth();for(;r.getMonth()===s;)r.setDate(r.getDate()+1);return r.setDate(r.getDate()-1),r.getDate()}static pad(t,e=2){return String(Math.abs(t)).padStart(e,"0")}daysInMonth(){return s.daysInMonth(this.date.getMonth()+1,this.date.getFullYear())}setOffset(t){t=s.parseOffset(t);const e=this.offset-t;return this.date.setTime(this.date.getTime()+6e4*e),this.offset=t,this}utc(){if(0!==this.offset){const t=this.date.getTime()-6e4*-this.offset;this.date.setTime(t),this.offset=0}return this}clone(){const t=s.from(this.valueOf());return t.offset=this.offset,t}add(t,e="millisecond"){switch(e){case"millisecond":this.date.setMilliseconds(this.date.getMilliseconds()+t);break;case"second":this.date.setSeconds(this.date.getSeconds()+t);break;case"minute":this.date.setMinutes(this.date.getMinutes()+t);break;case"hour":this.date.setHours(this.date.getHours()+t);break;case"date":this.date.setDate(this.date.getDate()+t);break;case"week":this.date.setDate(this.date.getDate()+7*t);break;case"month":this.date.setMonth(this.date.getMonth()+t);break;case"year":this.date.setFullYear(this.date.getFullYear()+t)}return this}addYear(t){return this.add(t,"year")}addMonth(t){return this.add(t,"month")}addWeek(t){return this.add(t,"week")}addDate(t){return this.add(t,"date")}addHour(t){return this.add(t,"hour")}addMinute(t){return this.add(t,"minute")}addSecond(t){return this.add(t,"second")}addMillisecond(t){return this.add(t,"millisecond")}nextDate(){return this.addDate(1)}prevDate(){return this.addDate(-1)}nextWeek(){return this.addWeek(1)}prevWeek(){return this.addWeek(-1)}nextMonth(){return this.addMonth(1)}prevMonth(){return this.addMonth(-1)}nextYear(){return this.addYear(1)}prevYear(){return this.addYear(-1)}startOf(){return this.date.setHours(0,0,0,0),this}endOf(){return this.date.setHours(23,59,59,999),this}format(t="YYYY-MM-DD HH:mm:ss Z",e){const{date:r,tzOffset:n}=this,{pad:i}=s,a=r.getFullYear().toString(),o=r.getMonth()+1,c=r.getDate(),u=r.getHours(),l=u>12,f=Math.floor(l?24/u:u),d=r.getMinutes(),h=r.getSeconds(),g=r.getMilliseconds();let p=t.replace(/YYYY/g,a);return p=p.replace(/YY/g,a.substring(2)),p=p.replace(/MMMM/g,r.toLocaleString(e,{month:"long"})),p=p.replace(/MMM/g,r.toLocaleString(e,{month:"short"})),p=p.replace(/MM/g,i(o)),p=p.replace(/M/g,o.toString()),p=p.replace(/DD/g,i(c)),p=p.replace(/D/g,c.toString()),p=p.replace(/dddd/g,r.toLocaleString(e,{weekday:"long"})),p=p.replace(/ddd/g,r.toLocaleString(e,{weekday:"short"})),p=p.replace(/HH/g,i(u)),p=p.replace(/H/g,u.toString()),p=p.replace(/hh/g,i(f)),p=p.replace(/h/g,f.toString()),p=p.replace(/mm/g,i(d)),p=p.replace(/m/g,d.toString()),p=p.replace(/SSS/g,i(g,3)),p=p.replace(/SS/g,i(g,2)),p=p.replace(/ss/g,i(h)),p=p.replace(/s/g,g.toString()),p=p.replace(/A/g,l?"PM":"AM"),p=p.replace(/a/g,l?"pm":"am"),p=p.replace(/x/g,this.valueOf().toString()),p=p.replace(/Z/g,n),p}diff(t,e="millisecond"){t=t instanceof s?t.clone():s.from(t);const r=this.clone().valueOf()-t.valueOf();switch(e){case"millisecond":return r;case"second":return 1e3*r;case"minute":return Math.round(r/6e4);case"hour":return Math.round(r/36e5);case"date":return Math.round(r/864e5);case"week":return Math.round(r/6048e5)}}gt(t,e="millisecond"){return this.diff(t,e)>0}gte(t,e="millisecond"){return this.diff(t,e)>=0}lt(t,e="millisecond"){return this.diff(t,e)<0}lte(t,e="millisecond"){return this.diff(t,e)<=0}eq(t,e="millisecond"){return 0===this.diff(t,e)}toString(){return this.iso}valueOf(){return this.date.getTime()}*[Symbol.iterator](){yield this.date.getFullYear(),yield this.date.getMonth(),yield this.date.getDate(),yield this.date.getHours(),yield this.date.getMinutes(),yield this.date.getSeconds(),yield this.date.getMilliseconds()}}e.DateTime=s},740:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.JWT=e.JWTErrorExpired=e.JWTErrorInvalid=e.JWTError=e.Hash=void 0;const s=r(845),n=r(336);class i{static getCrypto(){return"undefined"!=typeof crypto?crypto:"undefined"!=typeof window?window.crypto||window.msCrypto:void 0}static randomBytes(t){const e=i.getCrypto();if(void 0!==e){if(void 0!==e.randomBytes)return e.randomBytes;if(void 0!==e.getRandomValues){const r=new Uint8Array(t);return e.getRandomValues(r),r}}const r=[];for(let e=t;e>0;e--)r.push(Math.floor(256*Math.random()));return r}static uuid(){const t=i.getCrypto();if("function"==typeof t?.randomUUID)return t.randomUUID();let e,r=0;const s=new Array(256);for(let t=0;t<256;t++)s[t]=(t+256).toString(16).substring(1);(void 0===e||r+16>4096)&&(r=0,e=i.randomBytes(4096));const n=Array.prototype.slice.call(e,r,r+=16);return n[6]=15&n[6]|64,n[8]=63&n[8]|128,s[n[0]]+s[n[1]]+s[n[2]]+s[n[3]]+"-"+s[n[4]]+s[n[5]]+"-"+s[n[6]]+s[n[7]]+"-"+s[n[8]]+s[n[9]]+"-"+s[n[10]]+s[n[11]]+s[n[12]]+s[n[13]]+s[n[14]]+s[n[15]]}static async sha256(t){const e=i.getCrypto();if("function"==typeof e?.subtle?.digest)return await e.subtle.digest("SHA-256",(new TextEncoder).encode(t)).then((t=>{const e=[],r=new DataView(t);for(let t=0;t<r.byteLength;t+=4)e.push(("00000000"+r.getUint32(t).toString(16)).slice(-8));return e.join("")}));throw new Error("Crypto not available in your environment")}static encodeBase64(t){return btoa(t)}static decodeBase64(t){return atob(t)}static base64UrlEncode(t){return i.encodeBase64(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}static base64UrlDecode(t){const e=(t=t.replace(/-/g,"+").replace(/_/g,"/")).length%4;return e&&(t+="=".repeat(4-e)),i.decodeBase64(t)}static jwt(){return new u}}e.Hash=i;class a extends Error{}e.JWTError=a;class o extends a{constructor(){super(u.INVALID_TOKEN)}}e.JWTErrorInvalid=o;class c extends a{constructor(){super(u.EXPIRED_TOKEN)}}e.JWTErrorExpired=c;class u{constructor(){this.validHeader={alg:"HS256",typ:"JWT"}}async sign(t,e){const r=s.DateTime.from(e.iat);if(!r.valid)throw new o;const n=i.base64UrlEncode(JSON.stringify(this.validHeader)),a=i.base64UrlEncode(JSON.stringify({data:t,iat:r.iso}));return`${n}.${a}.${i.base64UrlEncode(await i.sha256(`${n}.${a}.${e.secret}`))}`}async verify(t,e){const r=t.split(".");if(3!==r.length)throw new o;const a=JSON.parse(i.base64UrlDecode(r[0])),u=JSON.parse(i.base64UrlDecode(r[1]));let l;if(!(n.Is.equals(a,this.validHeader)&&n.Is.object(u)&&n.Is.equals(Object.keys(u).sort(),["data","iat"])&&(l=s.DateTime.from(u.iat)).valid&&i.base64UrlEncode(await i.sha256(`${r[0]}.${r[1]}.${e.secret}`))===r[2]))throw new o;if(l.lt("now","second"))throw new c;return u.data}}e.JWT=u,u.INVALID_TOKEN="INVALID_TOKEN",u.EXPIRED_TOKEN="INVALID_IAT",u.EXPIRED="EXPIRED_TOKEN"},894:function(t,e,r){var s=this&&this.__createBinding||(Object.create?function(t,e,r,s){void 0===s&&(s=r);var n=Object.getOwnPropertyDescriptor(e,r);n&&!("get"in n?!e.__esModule:n.writable||n.configurable)||(n={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,s,n)}:function(t,e,r,s){void 0===s&&(s=r),t[s]=e[r]}),n=this&&this.__exportStar||function(t,e){for(var r in t)"default"===r||Object.prototype.hasOwnProperty.call(e,r)||s(e,t,r)};Object.defineProperty(e,"__esModule",{value:!0}),n(r(611),e),n(r(845),e),n(r(508),e),n(r(740),e),n(r(336),e),n(r(735),e),n(r(667),e),n(r(429),e),n(r(638),e)},336:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Is=e.IsError=void 0;const s=r(845);class n extends Error{}e.IsError=n;class i{static typeOf(t,e,r=!1){t=r?Array.isArray(t)?t:[t]:t;for(const n of r?t:[t]){const t=typeof n;switch(e){case"string":case"undefined":case"boolean":case"function":case"symbol":if(t!==e)return!1;break;case"int":case"sint":case"uint":if(!Number.isInteger(n)||"sint"===e&&n>=0||"uint"===e&&n<0)return!1;break;case"number":case"snumber":case"unumber":if("number"!==t||!Number(n)||"snumber"===e&&n>=0||"unumber"===e&&n<0)return!1;break;case"bigint":case"sbigint":case"ubigint":if("bigint"!==t||"sbigint"===e&&n>=0||"ubigint"===e&&n<0)return!1;break;case"object":if(!n||Array.isArray(n)||"object"!==t)return!1;break;case"array":if(!Array.isArray(n))return!1;break;case"null":if(null!==n)return!1;break;case"NaN":if(!Number.isNaN(n))return!1;break;case"map":if(!(n instanceof Map))return!1;break;case"set":if(!(n instanceof Set))return!1;break;case"regex":if(!(n instanceof RegExp))return!1;break;case"date":if(!(n instanceof Date))return!1;break;case"datetime":if(!(n instanceof s.DateTime))return!1;break;case"datestring":if("string"!==t||!s.DateTime.parse(n))return!1;break;default:return!1}}return!0}static equals(t,e){if(t===e)return!0;if((t instanceof Date||t instanceof s.DateTime)&&(e instanceof Date||e instanceof s.DateTime))return t.valueOf()===e.valueOf();if(null!==t&&null!==e&&"object"==typeof t&&"object"==typeof e){if(t.constructor!==e.constructor)return!1;let r,s;if(t.constructor===Array){if(r=t.length,r!==e.length)return!1;for(s=r;0!=s--;)if(!0!==i.equals(t[s],e[s]))return!1;return!0}if(t.constructor===Map){if(t.size!==e.size)return!1;let r=t.entries();for(s=r.next();!0!==s.done;){if(!0!==e.has(s.value[0]))return!1;s=r.next()}for(r=t.entries(),s=r.next();!0!==s.done;){if(!0!==i.equals(s.value[1],e.get(s.value[0])))return!1;s=r.next()}return!0}if(t.constructor===Set){if(t.size!==e.size)return!1;const r=t.entries();for(s=r.next();!0!==s.done;){if(!0!==e.has(s.value[0]))return!1;s=r.next()}return!0}if(null!=t.buffer&&t.buffer.constructor===ArrayBuffer){if(r=t.length,r!==e.length)return!1;for(s=r;0!=s--;)if(t[s]!==e[s])return!1;return!0}if(t.constructor===RegExp)return t.source===e.source&&t.flags===e.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===e.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===e.toString();const n=Object.keys(t).filter((e=>void 0!==t[e]));if(r=n.length,r!==Object.keys(e).filter((t=>void 0!==e[t])).length)return!1;for(s=r;0!=s--;){const r=n[s];if(!0!==i.equals(t[r],e[r]))return!1}return!0}return t!=t&&e!=e}static emptyObject(t){return i.object(t)&&!Object.keys(t).length}static date(t){return i.typeOf(t,"date")}static datetime(t){return i.typeOf(t,"datetime")}static dateString(t){return i.typeOf(t,"datestring")}static flatValue(t){return"object"!=typeof t&&"function"!=typeof t||null===t}static empty(t){switch(typeof t){case"boolean":return!1===t;case"number":case"bigint":return 0===t;case"string":return!t.trim().length}return t instanceof Date||t instanceof s.DateTime?isNaN(+t):t instanceof Map||t instanceof Set?!t.size:i.object(t)?!Object.keys(t).length:Array.isArray(t)||Buffer.isBuffer(t)?!t.length:!Boolean(t)}static nothing(t){return[null,void 0,NaN].includes(t)}static object(t,e){const r=t=>null!==t&&!Array.isArray(t)&&"object"==typeof t;if(!r(t))return!1;if(e){const s=e.suitable??!0,a=(t,e)=>{if(r(e)){if(!r(t)||s&&!i.equals(Object.keys(t).sort(),Object.keys(e).sort()))throw new n;for(const r in e)a(t[r],e[r])}else if(!i.typeOf(t,e))throw new n};try{a(t,e?.rules)}catch{return!1}}return!0}static flatObject(t,e){if(!i.object(t))return!1;let r=!0,s=!0;!1===e?r=s=!1:i.object(e)&&(r=!1!==e.root,s=!1!==e.deep);const n=t=>{if(Array.isArray(t)){if(!s)throw new Error;for(const e of t)n(e)}else if(i.object(t)){if("[object Object]"!==Object.prototype.toString.call(t))throw new Error;for(const e in t)n(t[e])}else if(i.func(t))throw new Error};try{for(const e in t){if(!r&&Array.isArray(t[e]))throw new Error;n(t[e])}}catch{return!1}return!0}static objectOrArray(t){return i.object(t)||i.array(t)}static array(t,e){if(!Array.isArray(t)||e?.notEmpty&&!t.length)return!1;const r=e?.rules,s=e?.suitable;if(r)for(const e of t){const t=i.object(r);if(t&&!i.object(e,{rules:r,suitable:s})||!t&&!i.typeOf(e,r))return!1}return!0}static asyncFunc(t){return t instanceof(async()=>{}).constructor}static func(t,e=!1){return i.typeOf(t,"function",e)}static callable(t){return i.func(t)||i.asyncFunc(t)||t instanceof Promise}static number(t,e=!1){return i.typeOf(t,"number",e)}static sNumber(t,e=!1){return i.typeOf(t,"snumber",e)}static uNumber(t,e=!1){return i.typeOf(t,"unumber",e)}static int(t,e=!1){return i.typeOf(t,"int",e)}static sInt(t,e=!1){return i.typeOf(t,"sint",e)}static uInt(t,e=!1){return i.typeOf(t,"uint",e)}static bigInt(t,e=!1){return i.typeOf(t,"bigint",e)}static sBigInt(t,e=!1){return i.typeOf(t,"sbigint",e)}static uBigInt(t,e=!1){return i.typeOf(t,"ubigint",e)}static boolean(t,e=!1){return i.typeOf(t,"boolean",e)}static string(t,e=!1){return i.typeOf(t,"string",e)}static null(t,e=!1){return i.typeOf(t,"null",e)}static undefined(t,e=!1){return i.typeOf(t,"undefined",e)}static nan(t,e=!1){return i.typeOf(t,"NaN",e)}static symbol(t,e=!1){return i.typeOf(t,"symbol",e)}static map(t,e=!1){return i.typeOf(t,"map",e)}static set(t,e=!1){return i.typeOf(t,"set",e)}static regex(t,e=!1){return i.typeOf(t,"regex",e)}static nodeJs(){return void 0!==r.g&&r.g&&void 0!==r.g.process&&void 0!==r.g.process.versions&&void 0!==r.g.process.versions.node}static nullOrUndefined(t){return null==t}static strongPassword(t,e){if("string"!=typeof t)return!1;const r=e?.minLength??8;return(!(e?.noSpaces??1)||!t.match(/\s+/))&&t.length>=r&&/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])/g.test(t)}}e.Is=i},735:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Obj=void 0;const s=r(667),n=r(336),i=r(508);class a{constructor(t){this.objects=t}static pick(t,e){const r=s.Registry.from(t),n=s.Registry.from();Array.isArray(e)||(e=[e]);for(const t of e)n.set(t,r.get(t));return n.valueOf()}static omit(t,e){const r=s.Registry.from(t);Array.isArray(e)||(e=[e]);for(const t in e)r.remove(t);return r.valueOf()}static contains(t,e){if("string"==typeof e){const r=e.split(".");let s=t;for(let t=0,e=r.length;t<e;t++){const e=r[t];if(!n.Is.object(s)||!s.hasOwnProperty(e))return!1;s=s[e]}}else for(const r in e)if(!t.hasOwnProperty(r)||!n.Is.equals(t[r],e[r]))return!1;return!0}static excludes(t,e){for(const r of Array.isArray(e)?e:[e])delete t[r];return t}static extends(t,...e){for(const r of e)for(const e in r){const s=r[e];n.Is.object(t[e])&&n.Is.object(s)?a.extends(t[e],s):Object.assign(t,{[e]:n.Is.flatValue(s)?s:i.Util.clone(s)})}return t}static reset(t,e){for(const e in t)delete t[e];return e&&Object.assign(t,e),t}static from(t){return new a(t)}static initPropValue(t,e,r){return s.Registry.from(t,{clone:!1}).initPathValue(e,r)}contains(t){return a.contains(this.objects,t)}extends(...t){return a.extends(this.objects,...t)}reset(t){return a.reset(this.objects,t)}initPropValue(t,e){return a.initPropValue(this.objects,t,e)}valueOf(){return this.objects}toString(){return JSON.stringify(this.objects)}}e.Obj=a},667:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Registry=e.RegistryDataError=void 0;const s=r(336),n=r(638),i=r(508);class a extends Error{}e.RegistryDataError=a;class o{constructor(t,e){this.cached={},this.parse(t,e)}static from(t,e){return new o(t,e)}merge(t,e){const r=(t,n)=>{if(s.Is.array(t))for(let e=0,s=t.length;e<s;e++)r(t[e],`${n?`${n}.`:""}${e}`);else if(s.Is.object(t))for(const e in t)r(t[e],`${n?`${n}.`:""}${e}`);else this.set(n,t,e)};return r(o.from(t).valueOf()),this}parse(t,e){if(void 0===t)t={};else if(s.Is.string(t)&&["{","["].includes(t[0]))try{t=JSON.parse(t)}catch{throw new a("Invalid JSON string data")}else(s.Is.object(t)||s.Is.array(t))&&!1!==e?.clone&&(t=i.Util.clone(t));if(this.data=t,!this.isPathArray()&&!this.isPathObject())throw new a("Invalid registry data, the data must be an Object<key, value> or a JSON string or an ARRAY");return!0===e?.validate&&this.validate(),this.cached={},this}validate(t){if(!this.isValidData(t))throw new a("The object element data must be a Record<key, value> or Array<[flat] | Record<key, value>> not from any Class/Function constructor");return this}isValidData(t){if(t=t??this.data,Array.isArray(t)){for(const e of t)if(s.Is.object(e)&&!s.Is.flatObject(e))return!1;return!0}return!(s.Is.object(t)&&!s.Is.flatObject(t))}isPathNum(t){return/^\d+$/.test(t)}get(t,e,r){if(void 0===this.cached[t])if(-1===t.indexOf("."))this.cached[t]=this.data[t];else{const r=t.split(".");let n=this.data;for(let t=0,a=r.length;t<a;t++)if(n=n[r[t]],i=n,!s.Is.object(i)&&!Array.isArray(i)){n=t+1===a?n:e;break}this.cached[t]=n}var i;return void 0===this.cached[t]||this.cached[t]===e?e:r?n.Transform.clean(this.cached[t],r):this.cached[t]}set(t,e,r){!0===r&&this.validate(e);for(const e in this.cached)e.startsWith(t)&&delete this.cached[e];if(-1===t.indexOf("."))void 0===e?this.isPathNum(t)&&Array.isArray(this.data)?this.data.splice(Number(t),1):delete this.data[t]:this.data[t]=e;else{let r=this.data;const s=t.split("."),n=s.length-1;for(let t=0;t<n;t++){const n=s[t];if(!r[n]||"object"!=typeof r[n]&&!Array.isArray(r[n])){if(void 0===e)return this.isPathNum(n)&&Array.isArray(r[n])?r.splice(Number(n),1):delete r[n],this;this.isPathNum(n)?r[n]=[]:r[n]={}}r=r[n]}const i=this.isPathNum(s[n]);i&&Array.isArray(r)?r.splice(Number(s[n]),1):delete r[s[n]],void 0!==e&&(i&&!Array.isArray(r)&&(r=[]),r[s[n]]=e)}return this}initPathValue(t,e,r){return this.has(t)||this.set(t,e,r),e}has(t){return!s.Is.undefined(this.get(t))}is(t,e){const r=this.get(t);return s.Is.undefined(e)?n.Transform.toBoolean(r):r===e}isCached(t){return this.cached.hasOwnProperty(t)}isPathArray(t){return s.Is.array(t?this.get(t):this.data)}isPathObject(t){return s.Is.object(t?this.get(t):this.data)}isPathFlat(t){return s.Is.flatValue(this.get(t))}remove(t){return this.set(t,void 0)}toString(){return JSON.stringify(this.data)}valueOf(){return this.data}clone(){return new o(JSON.stringify(this.data))}pick(t){const e=o.from();for(const r of Array.isArray(t)?t:[t])e.set(r,this.get(r));return e}omit(t){const e=this.clone();for(const r of Array.isArray(t)?t:[t])e.remove(r);return e}}e.Registry=o},429:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Str=void 0;class r extends String{get text(){return this.toString()}static uFirst(t){return t.length>1?`${t[0].toUpperCase()}${t.substring(1)}`:t}static lFirst(t){return t.length>1?`${t[0].toLowerCase()}${t.substring(1)}`:t}static toCapitalize(t,e=!1){const s=t.split(/\b/).map(r.uFirst);return e?s.filter((t=>!!t.trim()&&!/\W/.test(t))).join(""):s.join("")}static toCamelCase(t){return r.lFirst(r.toCapitalize(t,!0))}static camelToSnackCase(t){const e=[];for(let r=0,s=t.length;r<s;r++){const s=t[r];e.push(s===s.toUpperCase()?`_${s}`:s)}return e.join("").toLowerCase()}static snackToCamelCase(t){const e=[];let r=!1;for(let s=0,n=t.length;s<n;s++){const n=t[s];"_"!==n?r?(r=!1,e.push(n.toUpperCase())):e.push(n.toLowerCase()):r=!0}return e[0]&&(e[0]=e[0].toLowerCase()),e.join("")}static truncate(t,e){const r=e.pad||"...",s=e.maxLength||50;if(t=t.trim(),!0===e.wordCount){const e=t.split(/\s+/),n=e.length,i=e.slice(0,s);t=i.join(" "),n>i.length&&(t+=r)}else t.length>(t=t.substring(0,s)).length&&(t+=r);return t}static from(t){return new r(t)}static repeat(t,e=0){let r=t;if((e=parseInt(e.toString()))<=0)return"";for(;--e>0;)r=`${r}${t}`;return r}uFirst(){return r.uFirst(this.text)}lFirst(){return r.lFirst(this.text)}toCapitalize(t=!1){return r.toCapitalize(this.text,t)}toCamelCase(){return r.toCamelCase(this.text)}camelToSnackCase(){return r.camelToSnackCase(this.text)}snackToCamelCase(){return r.snackToCamelCase(this.text)}truncate(t){return r.truncate(this.text,t)}}e.Str=r},638:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Transform=void 0;const s=r(336);class n{static trim(t,e){const r=n.toString(t),s=e?.specialChars?.split("")?.join("|")??"",i=/[\n\t\s]/,a=()=>{for(let t=0,e=r.length;t<e;t++)if(!(r[t].match(i)||s.length&&s.includes(r[t])))return r.substring(t);return""};switch(e?.pos||"both"){case"left":return s?a():r.trimStart();case"right":return s?(()=>{for(let t=r.length-1;t>=0;t--)if(!(r[t].match(i)||s.length&&s.includes(r[t])))return r.substring(0,t+1);return""})():r.trimEnd();default:return s?(()=>{const t=a().split("");for(let e=t.length-1;e>=0&&(t[e].match(i)||s.length&&s.includes(t[e]));e--)t.splice(e,1);return t.join("")})():r.trim()}}static toString(t){switch(typeof t){case"string":return t;case"object":if(Array.isArray(t)||null!==t)return JSON.stringify(t);default:return String(t)}}static toJsonObject(t,e){if(Array.isArray(t))return t;if(s.Is.string(t)&&["{","["].includes(t[0]))try{return JSON.parse(t)}catch{}return s.Is.object(t)?t:s.Is.object(e)?e:s.Is.nothing(t)?{}:[t]}static toBoolean(t){switch(typeof t){case"number":case"bigint":return 0!==t;case"boolean":return t;case"string":if("true"===(t=t.trim().toLowerCase())||"1"===t)return!0;if("false"===t||"0"===t)return!1}return Boolean(t)}static toNumber(t){switch(typeof t){case"number":case"bigint":return t;case"boolean":return t?1:0;default:const e=Number(t);return isNaN(e)?0:e}}static toUNumber(t){return Math.abs(n.toNumber(t))}static toInt(t){let e=n.toNumber(t);return e>Number.MAX_SAFE_INTEGER?e=Number.MAX_SAFE_INTEGER:e<-Number.MAX_SAFE_INTEGER&&(e=-Number.MAX_SAFE_INTEGER),Number.parseInt(e.toString())}static toUInt(t){return Math.abs(n.toInt(t))}static toArrayUnique(t){if(Array.isArray(t)){const e=[];for(const r of t)e.length&&e.find((t=>s.Is.equals(t,r)))||e.push(r);return e}return[t]}static toPath(t){return n.toString(t).trim().toLowerCase().replace(/[^a-z0-9-/]/gi,"-").replace(/-+/g,"-").replace(/\/+/g,"/").replace(/^\/+|\/+$/g,"").replace(/^-+|-+$/g,"")}static toAlnum(t){return n.toString(t).trim().replace(/[^a-zA-Z0-9]/g,"")}static toNoneDiacritics(t){return n.toString(t).normalize("NFD").replace(/[\u0300-\u036f]/g,"")}static toNonAccentVietnamese(t){return t=n.toString(t).replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e").replace(/ì|í|ị|ỉ|ĩ/g,"i").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u").replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y").replace(/đ/g,"d").replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g,"A").replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g,"E").replace(/Ì|Í|Ị|Ỉ|Ĩ/g,"I").replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g,"O").replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g,"U").replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g,"Y").replace(/Đ/g,"D").replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g,"").replace(/\u02C6|\u0306|\u031B/g,""),n.toNoneDiacritics(t)}static toASCIIString(t){return n.clean(t,["toString","toNoneDiacritics"]).replace(/[^a-zA-Z0-9\s]/g,"")}static toSafeFileName(t){let e=n.toNonAccentVietnamese(t),r="";if(e.includes(".")){const t=e.split(".");r=t.pop(),e=t.join(".")}return`${n.toASCIIString(n.toPath(e))}${r?`.${r}`:""}`}static toDefault(t,...e){const r=[null,void 0,NaN];if(!r.includes(t))return t;for(let t=0,s=e.length;t<s;t++){const s=e[t];if(!r.includes(s))return s}}static toStripTags(t,e){e=(((e||"")+"").toLowerCase().match(/<[a-z][a-z0-9]*>/g)||[]).join("");const r=/<\/?([a-z0-9]*)\b[^>]*>?/gi,s=/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;let i=n.toString(t);for(i="<"===i.substring(i.length-1)?i.substring(0,i.length-1):i;;){const t=i;if(i=t.replace(s,"").replace(r,(function(t,r){return e.indexOf("<"+r.toLowerCase()+">")>-1?t:""})),t===i)return i}}static toSafeHtml(t,e){const r=Array.isArray(e?.allowedTags)?e.allowedTags:["p","b","i","em","strong","a","ul","ol","li","br","hr","img","table","thead","tfoot","tr","td","th","div","span","h1","h2","h3","h4","h5","h6"],s=Array.isArray(e?.allowedAttributes)?e.allowedAttributes:["href","src"];return r.length?n.trim(t).replace(/<\/?([^\>]+)>/gi,((t,e)=>{const n=e.split(" ")[0];return r.includes(n)?t.replace(/([a-z0-9_-]+)\s*=\s*["']([^"']+)["']/gi,(t=>{const e=t.split("=")[0]?.trim();return s.includes(e)?t.trim():""})).trim().replace(/<\s+/g,"<").replace(/\s+>/g,">"):""})).replace(/\s+/gi," "):n.toStripTags(t)}static clean(t,e,...r){const s={};Object.getOwnPropertyNames(n).filter((t=>"function"==typeof n[t]&&!["clean","cleanIfType"].includes(t))).forEach((t=>s[t.toLowerCase()]=n[t])),Array.isArray(e)||(e=[e]);for(const n of e.map((t=>t.toLowerCase()))){let e=s[n];e||0===n.indexOf("to")||(e=s[`to${n}`]),"function"==typeof e&&(t=e.apply(null,[t,...r]))}return t}static cleanIfType(t,e,r){for(const i of s.Is.array(r)?r:[r])if(s.Is.typeOf(t,i))return n.clean(t,e);return t}}e.Transform=n},508:(t,e,r)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Util=e.UtilRaceError=void 0;const s=r(667),n=r(845),i=r(336);class a extends Error{}e.UtilRaceError=a;class o{static clone(t){let e=t;if(i.Is.flatValue(e))return e;if(t instanceof n.DateTime||t instanceof s.Registry)e=t.clone();else if(t instanceof Date)e=new Date(t);else if(t instanceof RegExp)e=new RegExp(t.source,t.flags);else if(t instanceof Set)e=new Set,t.forEach((t=>e.add(o.clone(t))));else if(t instanceof Map)e=new Map,t.forEach((t=>e.set(o.clone(t))));else if(Array.isArray(t))e=[],t.forEach((t=>e.push(o.clone(t))));else if(i.Is.object(t))e={},Object.assign(e,...Object.keys(t).map((e=>({[e]:o.clone(t[e])}))));else if("function"==typeof t?.constructor){const r="function"==typeof t.valueOf?t.valueOf():void 0;r&&Object(r)!==r&&(e=new t.constructor(r))}return e}static async callback(t,e=[],r){return i.Is.asyncFunc(t)?await t.apply(r,e):t instanceof Promise?await t:i.Is.func(t)?t.apply(r,e):t}static sort(t,e){const r=e?.key,s=(t,e)=>t<e?-1:t>e?1:0;if(Array.isArray(t))r?t.sort(((t,e)=>i.Is.object(t)&&i.Is.object(e)?s(t[r],e[r]):s(t,e))):t.sort(s);else if(i.Is.object(t)){const e=Object.keys(t),r={};e.sort();for(const s of e)r[s]=o.clone(t[s]);for(const e in t)delete t[e];Object.assign(t,r)}return t}static baseName(t,e){let r=t;const s=r.charAt(r.length-1);return"/"!==s&&"\\"!==s||(r=r.slice(0,-1)),r=r.replace(/^.*[/\\]/g,""),"string"==typeof e&&r.substring(r.length-e.length)===e&&(r=r.substring(0,r.length-e.length)),r}static dirName(t){return t.replace(/\\/g,"/").replace(/\/[^/]*\/?$/,"")}static async race(t,e){return await Promise.race([Promise.resolve(o.callback(t)),new Promise(((t,r)=>{setTimeout((()=>r(new a("Race timeout."))),1e3*e)}))])}static debug(...t){const e="[35m",r="[35m",s="[0m",n=(t,e)=>`${e}${t}${s}`,a=(t,o)=>{let c="";if(i.Is.object(t)){c+=n("{",e)+"\n";for(const e in t)Object.prototype.hasOwnProperty.call(t,e)&&(c+="  ".repeat(o+1)+n(e,"[36m")+": ",c+=a(t[e],o+1),c+=",\n");c=c.slice(0,-2)+"\n"+"  ".repeat(o)+n("}",e)}else if(i.Is.array(t)){c+=n("[",r);for(let e=0;e<t.length;e++)e>0&&(c+=", "),c+=a(t[e],o+1);c+=n("]",r)}else i.Is.string(t)?c+=`[37m${JSON.stringify(t)}`:i.Is.number(t)?c+=`[33m${t}`:i.Is.boolean(t)?c+=`[34m${t}`:i.Is.null(t)?c+="[34mnull":c+=t;return c+s};console.log(...t.map((t=>a(t,0))))}static debugDev(...t){i.Is.nodeJs()}}e.Util=o},156:function(t,e,r){var s=this&&this.__createBinding||(Object.create?function(t,e,r,s){void 0===s&&(s=r);var n=Object.getOwnPropertyDescriptor(e,r);n&&!("get"in n?!e.__esModule:n.writable||n.configurable)||(n={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,s,n)}:function(t,e,r,s){void 0===s&&(s=r),t[s]=e[r]}),n=this&&this.__exportStar||function(t,e){for(var r in t)"default"===r||Object.prototype.hasOwnProperty.call(e,r)||s(e,t,r)};Object.defineProperty(e,"__esModule",{value:!0}),n(r(438),e),n(r(894),e)},438:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0})}},e={};function r(s){var n=e[s];if(void 0!==n)return n.exports;var i=e[s]={exports:{}};return t[s].call(i.exports,i,i.exports,r),i.exports}return r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),r(156)})()));