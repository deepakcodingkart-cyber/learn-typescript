// ╔════════════════════════════════════════════════════════════════════╗
// ║  LESSON 1: Type Inference, Type Annotation & Primitive Types         ║
// ║                                                                      ║
// ║  Check errors:  npx tsc --noEmit                                     ║
// ║  Run:           npx tsc && node dist/01-basics/01-inference-and-primitives.js
// ║  Practice:      01-inference-and-primitives.practice.ts              ║
// ╚════════════════════════════════════════════════════════════════════╝

// ════════════════════════════════════════════════════════════════════
// TOPIC 1: WHAT IS TYPESCRIPT? (Compile time vs Runtime)
// ════════════════════════════════════════════════════════════════════
//
// TypeScript is JavaScript plus TYPES. A "type" describes what kind of
// value a variable can hold: a string, a number, an object, and so on.
//
// Browsers and Node.js CANNOT run TypeScript directly. First the TypeScript
// compiler (`tsc`) checks your code for type mistakes, then it removes all
// the types and outputs plain JavaScript. Node runs that JavaScript.
//
//     index.ts  ──(tsc: check types + remove types)──►  index.js  ──►  node
//
// This gives us two important moments:
//   • COMPILE TIME: when `tsc` runs. TypeScript catches errors HERE.
//   • RUNTIME:      when `node` runs the .js file. Types no longer exist.
//
// Why does this matter? In plain JavaScript, a mistake like calling
// `"hello".toFixed()` only crashes when that line actually runs (maybe in
// production, in front of real users). TypeScript finds it BEFORE the
// code runs, while you are still typing in VS Code.
//
// ⭐ Interview: "Does TypeScript make code faster or check types at runtime?"
//    NO. Types are erased. TypeScript only helps during development.
//    If you need to check data at runtime (API responses, form input),
//    you need runtime validation (we learn Zod in Phase 5).

// Example: TypeScript catches this mistake before running.
const message = "hello";
// message.toFixed(2);     // ❌ Property 'toFixed' does not exist on type 'string'.
console.log(message.toUpperCase()); // ✅ HELLO


// ════════════════════════════════════════════════════════════════════
// TOPIC 2: TYPE INFERENCE (TypeScript figures out the type itself)
// ════════════════════════════════════════════════════════════════════
//
// "Inference" means TypeScript looks at the VALUE you assign and decides
// the type automatically. You do not need to write the type.
//
// Once a variable gets a type, it is LOCKED to that type. You can change
// the value, but only to another value of the same type.
//
// Hover your mouse over any variable in VS Code to see its inferred type.
// This is the fastest way to learn what TypeScript is thinking.

let city = "Indore"; // hover → let city: string
let score = 99; // hover → let score: number
let isLoggedIn = false; // hover → let isLoggedIn: boolean

city = "Bhopal"; // ✅ still a string
score = 100; // ✅ still a number
// city = 10;          // ❌ Type 'number' is not assignable to type 'string'.
// isLoggedIn = "yes"; // ❌ Type 'string' is not assignable to type 'boolean'.

// Inference also works for function RETURN values and expressions:
let fullName = "Hitesh" + " " + "Choudhary"; // string
let doubled = score * 2; // number
let isAdult = 20 > 18; // boolean

console.log(city, score, isLoggedIn, fullName, doubled, isAdult);


// ════════════════════════════════════════════════════════════════════
// TOPIC 3: `let` vs `const` (Literal types & Widening)
// ════════════════════════════════════════════════════════════════════
//
// A `const` can never be reassigned. So TypeScript gives it the MOST
// exact type possible: the value itself. This is called a LITERAL TYPE.
//
// A `let` can be reassigned later. So TypeScript gives it a WIDER type
// (string, number, boolean). This process is called WIDENING.
//
//     const country = "India";  →  type is  "India"   (literal type)
//     let   country = "India";  →  type is  string    (widened type)
//
// Literal types are very useful. Later you will combine them into unions
// like  "success" | "error" | "loading"  (Phase 1, Lesson on unions).

const country = "India"; // hover → const country: "India"
const pi = 3.14; // hover → const pi: 3.14
const isOpen = true; // hover → const isOpen: true

let country2 = "India"; // hover → let country2: string
let pi2 = 3.14; // hover → let pi2: number

// You can write a literal type on a `let` yourself:
let direction: "left" | "right" = "left";
direction = "right"; // ✅
// direction = "up"; // ❌ Type '"up"' is not assignable to type '"left" | "right"'.

console.log(country, pi, isOpen, country2, pi2, direction);


// ════════════════════════════════════════════════════════════════════
// TOPIC 4: TYPE ANNOTATION (You write the type yourself)
// ════════════════════════════════════════════════════════════════════
//
// An "annotation" is when YOU tell TypeScript the type, using a colon:
//
//     let variableName: type = value;
//
// If you annotate, TypeScript checks that the value matches the type.
//
// When should you annotate? This is the PRODUCTION RULE used by most teams:
//
//   ✅ DO annotate:
//      1. Function parameters (TypeScript cannot guess them)
//      2. Function return types (makes the function's promise clear,
//         and stops you from accidentally returning the wrong thing)
//      3. Variables declared WITHOUT a value (`let total: number;`)
//      4. When you want a different type than the one inferred
//
//   ❌ DON'T annotate:
//      Simple variables with a value: `let age: number = 25` is redundant.
//      Write `let age = 25`. Less noise, same safety.

// Annotated, but redundant (TypeScript already knows):
let userName: string = "Hitesh";

// Annotation needed: declared now, assigned later
let total: number;
total = 500;

// Annotation needed: function parameters and return type
function add(a: number, b: number): number {
  return a + b;
}

// The return type protects you:
function getDiscount(price: number): number {
  return price * 0.1;
  // return "10%";  // ❌ Type 'string' is not assignable to type 'number'.
}

console.log(userName, total, add(2, 3), getDiscount(1000));


// ════════════════════════════════════════════════════════════════════
// TOPIC 5: THE DANGER OF `let x;` (Implicit any)
// ════════════════════════════════════════════════════════════════════
//
// If you declare a variable with NO value and NO type, TypeScript cannot
// infer anything. It gives the variable the type `any`, which means
// "turn off type checking". `any` accepts everything and checks nothing,
// so bugs slip through.
//
// For function parameters without a type, `strict` mode (which is ON in
// your tsconfig.json) shows an error:
//     Parameter 'a' implicitly has an 'any' type.
// This forces you to write types. Never turn `strict` off.
//
// Rule: always give a variable either a VALUE or a TYPE.

let something; // hover → let something: any  ⚠️ (avoid this)
something = 10;
something = "now a string"; // no error, because it is `any`

let safeValue: number; // ✅ better: type written, value comes later
safeValue = 10;

// function multiply(a, b) { return a * b; }
// ❌ in strict mode: Parameter 'a' implicitly has an 'any' type.

console.log(something, safeValue);


// ════════════════════════════════════════════════════════════════════
// TOPIC 6: PRIMITIVE TYPES (the 7 basic building blocks)
// ════════════════════════════════════════════════════════════════════
//
// JavaScript has 7 primitive types, and TypeScript has a type for each:
//
//   Type        Example values               Notes
//   ─────────   ──────────────────────────   ───────────────────────────
//   string      "chai", 'tea', `hi ${x}`     all text
//   number      25, 99.5, -3, NaN, Infinity  int AND decimal are both number
//   boolean     true, false                  only these two values
//   null        null                         "intentionally empty"
//   undefined   undefined                    "not assigned yet"
//   bigint      9007199254740993n            very large whole numbers
//   symbol      Symbol("id")                 always unique values
//
// ⚠️ Always use LOWERCASE: `string`, `number`, `boolean`.
//    `String`, `Number`, `Boolean` (capital letters) are JavaScript wrapper
//    objects. Using them as types is a common beginner mistake.

// ---------- 6.1 string ----------
// Any text. Single quotes, double quotes, and backticks (template
// literals) are all `string`.
const firstName: string = "chai";
const lastName: string = 'aur code';
const intro: string = `I am ${firstName} ${lastName}`;

// ---------- 6.2 number ----------
// TypeScript (like JavaScript) has NO separate int or float type.
// Whole numbers, decimals, negatives, hex, and binary are all `number`.
// NaN ("Not a Number") and Infinity are also of type `number`.
const age: number = 25;
const price: number = 99.5;
const temperature: number = -4;
const hex: number = 0xff; // 255
const notANumber: number = NaN;

// ---------- 6.3 boolean ----------
// Only `true` or `false`. Used for flags and conditions.
const isActive: boolean = true;
const hasPaid: boolean = false;

// ---------- 6.4 null and undefined ----------
// • undefined: a variable exists but has not been given a value.
// • null:      you deliberately set "no value" (e.g. user not found).
//
// With `strict` mode (strictNullChecks), you CANNOT put null into a
// `string` variable. You must allow it explicitly with a union `| null`.
// This prevents the famous error "Cannot read properties of null".
let middleName: string | null = null; // ✅ allowed because of `| null`
middleName = "Kumar";
let nickname: string | undefined; // value is undefined for now
// let surname: string = null;   // ❌ Type 'null' is not assignable to type 'string'.

// ---------- 6.5 bigint ----------
// `number` can only store whole numbers exactly up to 2^53 - 1
// (Number.MAX_SAFE_INTEGER = 9007199254740991). For bigger values,
// use bigint by adding `n` at the end. Requires target ES2020 or later.
// You CANNOT mix bigint and number in math: 10n + 5 is an error.
const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
const huge: bigint = 9007199254740993n;
// const mixed = huge + 5;   // ❌ Operator '+' cannot be applied to types 'bigint' and 'number'.
const mixedOk = huge + 5n; // ✅

// ---------- 6.6 symbol ----------
// Every Symbol() is unique, even with the same description.
// Used for hidden or unique object keys (rare in daily code).
const id1: symbol = Symbol("id");
const id2: symbol = Symbol("id");
const sameSymbol = id1 === id2; // false, they are different

console.log(intro, age, price, temperature, hex, notANumber);
console.log(isActive, hasPaid, middleName, nickname);
console.log(maxSafe, huge, mixedOk, sameSymbol);


// ════════════════════════════════════════════════════════════════════
// TOPIC 7: TYPES DISAPPEAR AT RUNTIME (Type erasure)
// ════════════════════════════════════════════════════════════════════
//
// After `npx tsc`, open dist/01-basics/01-inference-and-primitives.js.
// You will see `let total;` and `function add(a, b)`. All `: number`
// and `: string` annotations are gone.
//
// This is called TYPE ERASURE. Consequences:
//   1. TypeScript adds ZERO runtime cost.
//   2. You cannot check a TypeScript type at runtime. `typeof x` is the
//      JavaScript operator, and it only knows JS types:
//      "string", "number", "boolean", "undefined", "object", "bigint",
//      "symbol", "function".
//   3. ⚠️ typeof null === "object". This is an old JavaScript bug and a
//      classic interview question.

console.log(typeof "chai"); // "string"
console.log(typeof 42); // "number"
console.log(typeof null); // "object"  ⚠️ JS bug!
console.log(typeof undefined); // "undefined"
console.log(typeof 10n); // "bigint"


// ════════════════════════════════════════════════════════════════════
// 📝 SUMMARY (revise this before interviews)
// ════════════════════════════════════════════════════════════════════
// 1. TS checks types at COMPILE time; types are ERASED at runtime.
// 2. Inference: TS guesses the type from the value. Prefer it for variables.
// 3. const → literal type ("India"); let → widened type (string).
// 4. Annotate: function params, return types, variables without a value.
// 5. Never leave `let x;` with no type. It becomes `any`.
// 6. 7 primitives: string, number, boolean, null, undefined, bigint, symbol.
// 7. Use lowercase types. With strict mode, null needs `| null`.
// 8. typeof null === "object" (JS bug).
// ════════════════════════════════════════════════════════════════════

export {}; // makes this file a module, so its variables stay private to this file
