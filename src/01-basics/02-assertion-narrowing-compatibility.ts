// ╔════════════════════════════════════════════════════════════════════╗
// ║  LESSON 2: Inference (deep), Annotation (deep), any/unknown/never/  ║
// ║            void, Type Assertion, Narrowing, Type Compatibility       ║
// ║                                                                      ║
// ║  Check errors:  npx tsc --noEmit                                     ║
// ║  Run:           npx tsc && node dist/01-basics/02-assertion-narrowing-compatibility.js
// ║                                                                      ║
// ║  Part A: Lesson (read + hover every variable)                        ║
// ║  Part B: Questions are at the BOTTOM of this file. Solve them there. ║
// ╚════════════════════════════════════════════════════════════════════╝


// ████████████████████████████████████████████████████████████████████
//                          PART A: THE LESSON
// ████████████████████████████████████████████████████████████████████


// ════════════════════════════════════════════════════════════════════
// TOPIC 1: TYPE INFERENCE (deeper)
// ════════════════════════════════════════════════════════════════════
//
// In Lesson 1 you saw simple inference: `let age = 25` → number.
// TypeScript infers in many more places. Knowing these lets you write
// LESS type code while staying 100% safe.
//
// 1.1 Best common type (arrays)
//     When an array has mixed values, TS creates a UNION of all the types
//     it finds: [1, "a"] → (string | number)[]
//
// 1.2 Object inference
//     TS infers the type of every property in an object literal.
//
// 1.3 Return type inference
//     If you don't write a return type, TS infers it from `return`.
//
// 1.4 Contextual typing
//     In callbacks (map, filter, forEach), TS already knows the
//     parameter type from the array, so you don't write it.

// 1.1 Best common type
const numbers = [10, 20, 30]; // number[]
const mixed = [1, "two", true]; // (string | number | boolean)[]
// const empty = [];
// ⚠️ An empty array has no values to infer from. TS gives it an "evolving"
//    any[] type, and strict mode shows: Variable 'empty' implicitly has
//    type 'any[]'. It also accepts ANY value you push into it.
const safeEmpty: string[] = []; // ✅ always annotate empty arrays

// 1.2 Object inference
const user = {
  name: "Deepak",
  age: 35,
  isAdmin: false,
}; // hover → { name: string; age: number; isAdmin: boolean }
user.age = 36; // ✅
// user.age = "36";   // ❌ Type 'string' is not assignable to type 'number'.
// user.email = "x";  // ❌ Property 'email' does not exist on type ...

// 1.3 Return type inference
function multiply(a: number, b: number) {
  return a * b; // hover multiply → returns number
}
function getLabel(isActive: boolean) {
  return isActive ? "on" : "off"; // returns "on" | "off"
}

// 1.4 Contextual typing: `n` is known to be a number from `numbers`
const doubledNumbers = numbers.map((n) => n * 2); //  []
const names = ["chai", "code"];
const upperNames = names.map((n) => n.toUpperCase()); // string[]

console.log(numbers, mixed, safeEmpty, user, multiply(2, 3), getLabel(true));
console.log(doubledNumbers, upperNames);


// ════════════════════════════════════════════════════════════════════
// TOPIC 2: TYPE ANNOTATION (deeper)
// ════════════════════════════════════════════════════════════════════
//
// Syntax for every kind of annotation:
//
//   Variable:        let x: number
//   Array:           let list: string[]          or  Array<string>
//   Object:          let p: { name: string; age: number }
//   Optional prop:   { email?: string }          (may be missing)
//   Function param:  function f(a: number)
//   Optional param:  function f(a?: number)      (must come LAST)
//   Default param:   function f(a = 10)          (type inferred: number)
//   Return type:     function f(): string
//   Arrow function:  const f = (a: number): number => a * 2
//
// ✅ Production tip: always annotate the return type of EXPORTED
//    functions. If someone changes the function body by mistake,
//    the error shows inside the function, not in 20 other files.

let skills: string[] = ["html", "css"];
let scores: Array<number> = [90, 85];

let product: { title: string; price: number; inStock?: boolean } = {
  title: "Laptop",
  price: 50000,
  // inStock is optional, so we can skip it
};

function createUser(name: string, age?: number, country = "India"): string {
  // age is `number | undefined` because it is optional
  return `${name} (${age ?? "age unknown"}) from ${country}`;
}

const square = (n: number): number => n * n;

console.log(skills, scores, product);
console.log(createUser("Ravi"), createUser("Amit", 28), createUser("John", 30, "USA"));
console.log(square(5));


// ════════════════════════════════════════════════════════════════════
// TOPIC 3: any vs unknown vs never vs void   ⭐⭐ TOP INTERVIEW QUESTION
// ════════════════════════════════════════════════════════════════════
//
// ┌──────────┬─────────────────────────────────────────────────────────┐
// │ any      │ "Turn OFF type checking". Accepts anything, you can do  │
// │          │ anything with it. NO safety. Avoid in production.       │
// ├──────────┼─────────────────────────────────────────────────────────┤
// │ unknown  │ "I don't know the type YET". Accepts anything, but you  │
// │          │ CANNOT use it until you check (narrow) it. SAFE any.    │
// ├──────────┼─────────────────────────────────────────────────────────┤
// │ void     │ A function returns NOTHING useful (no return value).    │
// ├──────────┼─────────────────────────────────────────────────────────┤
// │ never    │ A value that can NEVER exist. Function never finishes   │
// │          │ (always throws / infinite loop), or impossible case.    │
// └──────────┴─────────────────────────────────────────────────────────┘
//
// Simple way to remember:
//   any     = "trust me, don't check"   (dangerous)
//   unknown = "check before you use"    (safe)
//   void    = "returns nothing"
//   never   = "never returns / impossible"
//
// When to use unknown? For data you don't control: JSON.parse result,
// API responses, user input, errors in catch blocks.

// ---------- any: no safety ----------
let anything: any = "hello";
anything = 42;
// anything.toUpperCase();  // ⚠️ NO compile error, but CRASHES at runtime
//                          //    (42 has no toUpperCase). That is why any is bad.

// ---------- unknown: safe ----------
let input: unknown = "hello";
// input.toUpperCase();     // ❌ 'input' is of type 'unknown'. Check first!
if (typeof input === "string") {
  console.log(input.toUpperCase()); // ✅ inside this if, input is string
}

// ---------- void ----------
function logMessage(msg: string): void {
  console.log("LOG:", msg);
  // no return
}

// ---------- never ----------
function throwError(message: string): never {
  throw new Error(message); // this function never returns normally
}

console.log(anything);
logMessage("void example");
// throwError("boom");  // uncomment to see it crash the program


// ════════════════════════════════════════════════════════════════════
// TOPIC 4: TYPE ASSERTION (`as`)
// ════════════════════════════════════════════════════════════════════
//
// A type assertion tells TypeScript: "Trust me, I know the type better
// than you." Syntax:
//
//     value as Type          ✅ use this
//     <Type>value            (old syntax, does NOT work in .tsx/React files)
//
// ⚠️ VERY IMPORTANT: assertion is NOT conversion.
//    `"5" as unknown as number` does NOT turn "5" into 5.
//    It only changes what TypeScript THINKS. At runtime nothing changes.
//    If you are wrong, the program crashes later. Use assertions RARELY.
//
// Types of assertions:
//   4.1 `as Type`        when you know more than TS (e.g. JSON.parse)
//   4.2 Non-null `!`     "this is definitely not null/undefined"
//   4.3 `as const`       make values readonly + literal types
//   4.4 Double assertion `as unknown as T` (escape hatch, almost never use)
//
// TS blocks "impossible" assertions:
//   "hello" as number  → ❌ Conversion of type 'string' to type 'number'
//                         may be a mistake.

// 4.1 as Type
// JSON.parse returns `any`. We assert the shape we expect.
const raw = '{"name":"chai","price":20}';
const tea = JSON.parse(raw) as { name: string; price: number };
console.log(tea.name.toUpperCase(), tea.price);
// ⚠️ If the JSON had a different shape, TS would NOT know. In production,
//    validate with Zod instead of trusting `as` (Phase 5).

// 4.2 Non-null assertion `!`
// Your tsconfig has `noUncheckedIndexedAccess`, so arr[0] is number | undefined.
const prices = [100, 200, 300];
const firstPrice = prices[0]; // number | undefined
const firstPriceSure = prices[0]!; // number (we promise it exists)
// ✅ Safer than `!`: check it
if (firstPrice !== undefined) {
  console.log(firstPrice * 2);
}

// 4.3 as const: makes everything readonly and literal
const colors = ["red", "green"]; // string[]
const fixedColors = ["red", "green"] as const; // readonly ["red", "green"]
// fixedColors.push("blue");  // ❌ Property 'push' does not exist on type 'readonly [...]'
const config = { env: "prod", port: 3000 } as const;
// config.port = 4000;        // ❌ Cannot assign to 'port' because it is a read-only property.

// 4.4 Double assertion (escape hatch)
const fakeNumber = "5" as unknown as number; // TS thinks number, but it is still "5"!
console.log(typeof fakeNumber); // "string"  ← proof that assertion is not conversion

console.log(firstPriceSure, colors, fixedColors, config);


// ════════════════════════════════════════════════════════════════════
// TOPIC 5: TYPE NARROWING   ⭐ used EVERYWHERE in real code
// ════════════════════════════════════════════════════════════════════
//
// When a variable can be MORE than one type (string | number, or
// unknown), you must CHECK which type it is before using it.
// After the check, TypeScript automatically gives it the NARROWER type
// inside that block. This is called NARROWING.
//
// TS follows your if/else/return/switch to know the type at each line.
// This is called CONTROL FLOW ANALYSIS.
//
// Ways to narrow:
//   5.1 typeof         → for primitives: "string", "number", "boolean"...
//   5.2 truthiness     → if (value)  removes null, undefined, "", 0
//   5.3 equality       → ===, !==   (e.g. value !== null)
//   5.4 in             → "prop" in object
//   5.5 instanceof     → for classes: Date, Error, your own classes
//   5.6 Array.isArray  → arrays
//   5.7 Discriminated union → a common `kind`/`type` field  ⭐ most used
//   5.8 Custom type guard   → function isX(v): v is X
//   5.9 Exhaustive check with never

// 5.1 typeof
function formatId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase(); // id: string
  }
  return id.toFixed(0); // id: number (TS knows string is gone)
}

// 5.2 truthiness
function printName(name: string | null | undefined): void {
  if (name) {
    console.log("Name:", name.toUpperCase()); // name: string
  } else {
    console.log("No name"); // ⚠️ empty string "" also comes here!
  }
}

// 5.3 equality
function getLength(text: string | null): number {
  if (text === null) {
    return 0;
  }
  return text.length; // text: string
}

// 5.4 in
type Fish = { swim: () => void };
type Bird = { fly: () => void };
function move(animal: Fish | Bird): void {
  if ("swim" in animal) {
    animal.swim(); // animal: Fish
  } else {
    animal.fly(); // animal: Bird
  }
}

// 5.5 instanceof
function formatDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString(); // value: Date
  }
  return value; // value: string
}

// instanceof with errors (very common in production)
// In strict mode, `err` in catch is `unknown`, so you must narrow it.
try {
  JSON.parse("{bad json");
} catch (err) {
  if (err instanceof Error) {
    console.log("Caught:", err.message); // err: Error
  } else {
    console.log("Unknown error", err);
  }
}

// 5.6 Array.isArray
function toList(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

// 5.7 Discriminated union: every member has the same field (`kind`)
//     with a different literal value. Checking that field narrows the type.
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2; // shape: Circle
    case "square":
      return shape.side ** 2; // shape: Square
    case "rectangle":
      return shape.width * shape.height; // shape: Rectangle
    default: {
      // 5.9 Exhaustive check: if someone adds a new Shape (e.g. Triangle)
      // and forgets a case, this line gives a COMPILE error.
      const unhandled: never = shape;
      return unhandled;
    }
  }
}

// Real-world discriminated union: API request state
type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(state: RequestState): string {
  if (state.status === "loading") return "Loading...";
  if (state.status === "success") return `Got ${state.data.length} items`;
  return `Error: ${state.message}`;
}

// 5.8 Custom type guard: a function that returns `value is Type`
type Product = { title: string; price: number };

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    "price" in value &&
    typeof value.title === "string" &&
    typeof value.price === "number"
  );
}

const fromApi: unknown = JSON.parse('{"title":"Phone","price":15000}');
if (isProduct(fromApi)) {
  console.log(fromApi.title, fromApi.price); // fromApi: Product
}

console.log(formatId("abc"), formatId(42.7));
printName("ravi");
printName(null);
console.log(getLength(null), getLength("chai"));
move({ swim: () => console.log("swimming") });
console.log(formatDate("2026-01-01"), toList("one"), toList(["a", "b"]));
console.log(getArea({ kind: "circle", radius: 1 }), getArea({ kind: "square", side: 4 }));
console.log(render({ status: "success", data: ["a", "b"] }));


// ════════════════════════════════════════════════════════════════════
// TOPIC 6: TYPE COMPATIBILITY (Structural typing)   ⭐ interview
// ════════════════════════════════════════════════════════════════════
//
// "Compatibility" means: can a value of type A be assigned to type B?
//
// TypeScript uses STRUCTURAL TYPING (also called "duck typing"):
//   "If it walks like a duck and quacks like a duck, it is a duck."
// TS does NOT care about the type's NAME. It only checks the SHAPE.
// If A has AT LEAST all the properties B needs, A is assignable to B.
//
// (Java and C# use NOMINAL typing, where names must match. TypeScript
//  does not.)
//
// Rules:
//   6.1 Same shape, different names → compatible
//   6.2 Extra properties are OK (when assigning a VARIABLE)
//   6.3 BUT extra properties on a fresh object LITERAL → error
//       (this is called the EXCESS PROPERTY CHECK, it catches typos)
//   6.4 Missing properties → error
//   6.5 Narrow types fit into wide types: "on" → string → unknown
//   6.6 Functions with FEWER parameters fit where more are expected
//   6.7 A function returning a value fits a `() => void` type

// 6.1 Same shape, different names
type Person = { name: string; age: number };
type Employee = { name: string; age: number };
const emp: Employee = { name: "Ravi", age: 30 };
const person: Person = emp; // ✅ same shape, names don't matter

// 6.2 Extra properties via a variable: OK
type Point = { x: number; y: number };
const point3D = { x: 1, y: 2, z: 3 };
const point2D: Point = point3D; // ✅ has x and y (z is extra, that's fine)

// 6.3 Extra properties in a direct object literal: ERROR
// const p: Point = { x: 1, y: 2, z: 3 };
// ❌ Object literal may only specify known properties, and 'z' does not exist in type 'Point'.

// 6.4 Missing properties: ERROR
// const p2: Point = { x: 1 };
// ❌ Property 'y' is missing in type '{ x: number; }' but required in type 'Point'.

// 6.5 Narrow → wide is OK, wide → narrow is NOT
const exact: "on" = "on";
let wide: string = exact; // ✅ "on" is a string
let top: unknown = wide; // ✅ everything fits into unknown
// let back: "on" = wide;  // ❌ Type 'string' is not assignable to type '"on"'.

// 6.6 Function with fewer params is compatible
// forEach gives (value, index, array) but we only use value. ✅
[1, 2, 3].forEach((value) => console.log("value", value));
type Handler = (a: number, b: number) => void;
const handle: Handler = (a) => console.log("handled", a); // ✅

// 6.7 A function that returns something can be used as () => void
type Callback = () => void;
const cb: Callback = () => 42; // ✅ allowed, the return value is just ignored

console.log(person, point2D, wide, top);
handle(1, 2);
cb();


// ════════════════════════════════════════════════════════════════════
// 📝 SUMMARY (revise before interviews)
// ════════════════════════════════════════════════════════════════════
// 1. Inference works for arrays (union), objects, return types and
//    callbacks (contextual typing). Annotate empty arrays.
// 2. Annotate params, return types of exported functions, optional `?`.
// 3. any = no checks ❌ | unknown = check first ✅ | void = no return |
//    never = never returns / impossible.
// 4. Assertion (`as`, `!`, `as const`) changes what TS thinks, NOT the
//    value. Prefer narrowing over assertion.
// 5. Narrowing: typeof, truthiness, ===, in, instanceof, Array.isArray,
//    discriminated unions, `value is T` guards, `never` exhaustive check.
// 6. Structural typing: shape matters, not names. Fresh object literals
//    get the excess property check.
// ════════════════════════════════════════════════════════════════════



// ████████████████████████████████████████████████████████████████████
//                       PART B: QUESTIONS
// ████████████████████████████████████████████████████████████████████
//
// Rules:
//  • Write your answer directly under each question.
//  • 🐞 "Find the mistake" questions: uncomment the code, read the error,
//    then FIX it. Write what was wrong in one line.
//  • 🔮 "Predict" questions: write your answer FIRST, then hover to check.
//  • Run `npx tsc --noEmit` after every question. Target: 0 errors.
//  • Don't scroll up to the lesson unless you are really stuck.
//  • Variable names in questions end with Q<number> so they don't clash
//    with the lesson code above.


// HOW EACH QUESTION IS LAID OUT:
//   ❓ Question (English)
//   🇮🇳 Kya pooch raha hai (Hinglish)
//   ✍️ Your solution
//   💡 Kyun aisa solution hai (Why)
//   🌍 Real example 1 & 2 (production jaisa code)
//
// Questions without a solution yet only have the 🇮🇳 explanation + 💭 hint.
// Solve them, and I will add the "Kyun" + real examples after.


// ─────────────────────── SECTION 1: INFERENCE ───────────────────────

// ════════════════════════════════════════════════════════════════════
// ❓ Q1. 🔮 Predict the inferred type of each.
//
// 🇮🇳 Kya pooch raha hai: Har line me type nahi likha hai. Batao ki
//    TypeScript khud se (inference) kya type dega. Pehle socho, phir hover karo.
//
// ✍️ Your answers:
//     const listQ1 = [1, 2, "three"];             // ✅ (string | number)[]
//     const flagsQ1 = [true, false];              // ✅ boolean[]
//     const itemQ1 = { id: 1, tags: ["a"] };      // ✅ { id: number; tags: string[] }
//     function sumQ1(a: number, b: number) { return a + b; }           // ✅ number
//     function statusQ1(ok: boolean) { return ok ? "pass" : "fail"; }  // ❌ you wrote string
//                                                                      // ✅ correct: "pass" | "fail"
//
// 💡 Kyun:
//    • Mixed array → TS sab types ka union banata hai: (string | number)[]
//    • Object → har property ka type alag se infer hota hai.
//    • statusQ1: function sirf "pass" ya "fail" hi return kar sakta hai,
//      koi aur string nahi. Isliye TS exact literal union deta hai:
//      "pass" | "fail". Ye `string` se ZYADA safe hai.

// 🌍 Real example 1: shopping cart, type khud infer hota hai
const cartItemsEx1 = [
  { name: "Tea", qty: 2, price: 20 },
  { name: "Biscuit", qty: 1, price: 30 },
]; // hover → { name: string; qty: number; price: number }[]
const cartTotalEx1 = cartItemsEx1.reduce((sum, item) => sum + item.qty * item.price, 0);
console.log("Cart total:", cartTotalEx1); // 70

// 🌍 Real example 2: order status, return type literal union banta hai
function getOrderStatusEx1(isPaid: boolean) {
  return isPaid ? "confirmed" : "pending"; // returns "confirmed" | "pending"
}
const statusEx1 = getOrderStatusEx1(true);
// statusEx1 = "shipped" kabhi nahi ho sakta, TS ko pata hai
console.log("Order:", statusEx1);


// ════════════════════════════════════════════════════════════════════
// ❓ Q2. 🐞 Find the mistake. The cart should hold ONLY fruit names (strings),
//     but TypeScript allows push(10) without any error. Why? Fix it so that
//     push(10) gives an error.
//     const cartQ2 = [];
//     cartQ2.push("apple");
//     cartQ2.push(10);
//
// 🇮🇳 Kya pooch raha hai: Cart me sirf fruit ke naam (string) hone chahiye,
//    lekin push(10) par TS koi error nahi de raha. Kyun? Aisa fix karo ki
//    number daalne par error aaye.
//
// ✍️ Your solution:
const cartQ2: string[] = [];
cartQ2.push("apple");
// cartQ2.push(10);  // ❌ Argument of type 'number' is not assignable to parameter of type 'string'.
console.log(cartQ2);
//     Mistake: Empty array with no type becomes an evolving any[], so it accepts any value.
//     Fix: write the type → const cartQ2: string[] = [];
//
// 💡 Kyun: Khaali array `[]` me koi value nahi, to TS type guess nahi kar
//    sakta. Wo "evolving any[]" bana deta hai jo har push ke saath bada hota
//    jata hai. `string[]` likhne se TS ko pata chal jata hai ki sirf string
//    allowed hai. Rule: khaali array = type zaroor likho.

// 🌍 Real example 1: notifications list jo baad me bharti hai
const notificationsEx2: string[] = [];
notificationsEx2.push("Order shipped 📦");
notificationsEx2.push("Payment received 💰");
// notificationsEx2.push({ text: "hi" }); // ❌ object allowed nahi
console.log(notificationsEx2);

// 🌍 Real example 2: selected product IDs (checkbox se)
const selectedIdsEx2: number[] = [];
for (const id of [101, 102, 105]) {
  selectedIdsEx2.push(id);
}
// selectedIdsEx2.push("103"); // ❌ string ID galti se nahi jayegi
console.log("Selected:", selectedIdsEx2);


// ─────────────────────── SECTION 2: ANNOTATION ──────────────────────

// ════════════════════════════════════════════════════════════════════
// ❓ Q3. Write a variable `bookQ3` with an annotated object type:
//     title (string), pages (number), author (string, OPTIONAL).
//     Create it WITHOUT the author.
//
// 🇮🇳 Kya pooch raha hai: Ek book object banao jiska type khud likho.
//    title aur pages zaroori hain, author optional (`?`) hai. Object banate
//    waqt author mat do, aur dekho ki error nahi aata.
//
// ✍️ Your solution:
type Book = { title: string; pages: number; author?: string };
let bookQ3: Book = {
  title: "The Great Gatsby",
  pages: 180,
};
console.log(bookQ3);
//
// 💡 Kyun: `author?` ka matlab property ho bhi sakti hai, nahi bhi. Isliye
//    bina author ke object valid hai. Type ko `type Book = ...` me alag
//    likhna ✅ accha hai, kyunki ye type dobara bhi use ho sakta hai.
//    Note: bookQ3.author ka type `string | undefined` hota hai, use karne se
//    pehle check karna padta hai.

// 🌍 Real example 1: user profile, bio optional hai
type UserProfileEx3 = { name: string; email: string; bio?: string };
const profileEx3: UserProfileEx3 = { name: "Ravi", email: "ravi@mail.com" };
console.log(profileEx3.bio ?? "No bio added yet");

// 🌍 Real example 2: product, discount sirf kuch products par hota hai
type ProductEx3 = { title: string; price: number; discountPercent?: number };
const phoneEx3: ProductEx3 = { title: "Phone", price: 15000, discountPercent: 10 };
const cableEx3: ProductEx3 = { title: "Cable", price: 300 };
function finalPriceEx3(p: ProductEx3): number {
  const discount = p.discountPercent ?? 0;
  return p.price - (p.price * discount) / 100;
}
console.log(finalPriceEx3(phoneEx3), finalPriceEx3(cableEx3)); // 13500 300


// ════════════════════════════════════════════════════════════════════
// ❓ Q4. Write an arrow function `discountQ4` that takes price (number) and
//     percent (number, default 10) and returns the final price (number).
//     Call it with 1 argument and with 2 arguments.
//
// 🇮🇳 Kya pooch raha hai: Arrow function banao jo price aur percent le.
//    percent na diya jaye to 10 maan lo (default value). Discount ke baad
//    ki final price return karo. 1 aur 2 arguments dono se call karke dekho.
//
// ✍️ Your solution:
const discountQ4 = (price: number, percent: number = 10): number => {
  return price - (price * percent) / 100;
};
console.log(discountQ4(100)); // 90
console.log(discountQ4(100, 20)); // 80
//
// 💡 Kyun: Default value `= 10` dene se parameter apne aap optional ho
//    jata hai. Value na do to 10 use hota hai. Tip: `percent = 10` likhna
//    bhi kaafi hai, kyunki TS 10 dekhkar khud `number` samajh leta hai
//    (inference). Return type `: number` likhna ✅ acchi practice hai.

// 🌍 Real example 1: GST, default 18% (India me common)
const addGstEx4 = (amount: number, gstRate = 18): number => amount + (amount * gstRate) / 100;
console.log(addGstEx4(1000)); // 1180  (18%)
console.log(addGstEx4(1000, 5)); // 1050  (food items 5%)

// 🌍 Real example 2: delivery charge, default ₹40, free above ₹500
const deliveryFeeEx4 = (orderAmount: number, fee = 40): number => (orderAmount >= 500 ? 0 : fee);
console.log(deliveryFeeEx4(300)); // 40
console.log(deliveryFeeEx4(800)); // 0
console.log(deliveryFeeEx4(300, 60)); // 60 (remote area)


// ════════════════════════════════════════════════════════════════════
// ❓ Q5. 🐞 Find the mistake and fix it:
//     function registerQ5(email?: string, name: string): string {
//       return name + email;
//     }
//
// 🇮🇳 Kya pooch raha hai: Is function me galti dhoondo aur theek karo.
//    (Isme 2 galtiyan hain: ek compile error aur ek hidden bug.)
//
// ✍️ Your solution:
//     Mistake: Optional parameter `email?` came before the required `name`.
//     Optional params must always be LAST. Also, a skipped email was
//     undefined, so the output became "Raviundefined".
function registerQ5(name: string, email?: string): string {
  return name + " " + (email ?? "no email");
}
console.log(registerQ5("Ravi")); // Ravi no email
console.log(registerQ5("Ravi", "r@mail.com")); // Ravi r@mail.com
//
// 💡 Kyun: Arguments POSITION se match hote hain. Optional pehle ho to
//    registerQ5("Ravi") me TS nahi samajh sakta "Ravi" email hai ya name.
//    Isliye optional hamesha LAST. Aur optional param ka type
//    `string | undefined` hota hai, isliye `??` se undefined handle kiya.

// 🌍 Real example 1: email bhejna, cc optional hai
function sendEmailEx5(to: string, subject: string, cc?: string): string {
  return `To: ${to} | Subject: ${subject} | CC: ${cc ?? "none"}`;
}
console.log(sendEmailEx5("boss@company.com", "Report"));
console.log(sendEmailEx5("boss@company.com", "Report", "team@company.com"));

// 🌍 Real example 2: product search, page number optional (default page 1)
function searchProductsEx5(query: string, page?: number): string {
  return `Searching "${query}" on page ${page ?? 1}`;
}
console.log(searchProductsEx5("shoes")); // page 1
console.log(searchProductsEx5("shoes", 3)); // page 3


// ─────────────────── SECTION 3: any / unknown / never / void ─────────

// ════════════════════════════════════════════════════════════════════
// ❓ Q6. 🔮 Which line gives a COMPILE error? Which line crashes at RUNTIME?
//     let aQ6: any = 10;
//     let uQ6: unknown = 10;
//
// 🇮🇳 Kya pooch raha hai: Dono me number 10 hai aur dono par .toUpperCase()
//    call kiya hai (jo sirf string ke paas hota hai). Batao kaunsi line
//    code chalne se PEHLE error degi, aur kaunsi CHALTE WAQT crash karegi.
//
// ✍️ Your answers:
//     aQ6.toUpperCase();   // ✅ runtime crash (no compile error, because any skips checks)
//     uQ6.toUpperCase();   // ✅ compile error ('uQ6' is of type 'unknown')
//
// 💡 Kyun: `any` = TS checking band, isliye galti chhup jati hai aur
//    program chalne par crash hota hai 💥. `unknown` = "pehle check karo",
//    isliye TS galti pehle hi pakad leta hai. any galti CHHUPATA hai,
//    unknown galti PAKADTA hai.

// 🌍 Real example 1: API data `any` me lene ka nuksaan
const apiAnyEx6: any = JSON.parse('{"price": 100}');
// apiAnyEx6.prise.toFixed(2);  // typo "prise", koi compile error nahi,
//                              // runtime: Cannot read properties of undefined 💥
console.log("any price:", apiAnyEx6.price);

// 🌍 Real example 2: same data `unknown` me, TS check karwata hai
const apiUnknownEx6: unknown = JSON.parse('{"price": 100}');
if (typeof apiUnknownEx6 === "object" && apiUnknownEx6 !== null && "price" in apiUnknownEx6) {
  console.log("unknown price:", apiUnknownEx6.price); // ✅ safe access
}


// ════════════════════════════════════════════════════════════════════
// ❓ Q7. Write a function `safeUpperQ7(value: unknown): string` that returns
//     the uppercase string if value is a string, otherwise returns "NOT A STRING".
//
// 🇮🇳 Kya pooch raha hai: Function me kuch bhi aa sakta hai (unknown).
//    Agar string hai to uppercase karke do, warna "NOT A STRING" do.
//
// ✍️ Your solution:
function safeUpperQ7(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return "NOT A STRING";
}
console.log(safeUpperQ7("chai")); // CHAI
console.log(safeUpperQ7(42)); // NOT A STRING
//
// 💡 Kyun: `unknown` ko seedha use nahi kar sakte. `typeof value === "string"`
//    check ke baad, if ke andar TS value ko `string` maan leta hai
//    (narrowing). Isliye `.toUpperCase()` safe hai. Baaki sab case me
//    default answer return kiya, crash ka koi chance nahi.

// 🌍 Real example 1: URL query se page number (?page=3), kuch bhi aa sakta hai
function readPageParamEx7(value: unknown): number {
  if (typeof value === "string" && value.trim() !== "") {
    const page = Number(value);
    return Number.isNaN(page) ? 1 : page;
  }
  return 1; // default page
}
console.log(readPageParamEx7("3"), readPageParamEx7("abc"), readPageParamEx7(undefined)); // 3 1 1

// 🌍 Real example 2: catch block me error, kuch bhi throw ho sakta hai
function errorToTextEx7(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong";
}
console.log(errorToTextEx7(new Error("DB down")), errorToTextEx7("timeout"), errorToTextEx7(500));


// ════════════════════════════════════════════════════════════════════
// ❓ Q8. Write a function `failQ8(message: string)` that always throws an Error.
//     What return type should it have? Write it.
//
// 🇮🇳 Kya pooch raha hai: Aisa function banao jo hamesha error throw kare.
//    Iska return type kya hoga? (Hint: wo kabhi wapas aata hi nahi.)
//
// ✍️ Your solution:
function failQ8(message: string): never {
  throw new Error(message);
}
//
// 💡 Kyun: `throw` ke baad function kabhi wapas nahi aata, isliye `never`.
//    `void` GALAT hota, kyunki void = "wapas aata hai, khaali haath".
//    Bada fayda: never function ke baad TS type ko narrow kar deta hai
//    (neeche dono examples me dekho).

// 🌍 Real example 1: zaroori env variable (DB_URL) missing ho to app band
function requireEnvEx8(value: string | undefined, name: string): string {
  if (value === undefined) {
    failQ8(`Missing env variable: ${name}`);
  }
  return value; // ✨ yahan value: string, kyunki failQ8 never hai
}
console.log(requireEnvEx8("postgres://localhost/db", "DB_URL"));

// 🌍 Real example 2: user nahi mila to 404 error
type UserEx8 = { id: number; name: string };
const usersEx8: UserEx8[] = [{ id: 1, name: "Ravi" }];
function getUserNameEx8(id: number): string {
  const found = usersEx8.find((u) => u.id === id); // UserEx8 | undefined
  if (found === undefined) {
    failQ8(`User ${id} not found (404)`);
  }
  return found.name; // ✨ found: UserEx8
}
console.log(getUserNameEx8(1));
try {
  getUserNameEx8(99);
} catch (err) {
  console.log(errorToTextEx7(err)); // User 99 not found (404)
}


// ───────────────────── SECTION 4: TYPE ASSERTION ─────────────────────

// ════════════════════════════════════════════════════════════════════
// ❓ Q9. Parse this JSON with JSON.parse and assert it as { city: string; pin: number }.
//     Then console.log the city in uppercase.
//
// 🇮🇳 Kya pooch raha hai: JSON text ko JSON.parse se object banao, phir
//    `as` se TS ko batao ki iska shape { city, pin } hai. Phir city ko
//    uppercase me print karo.
//
// ✍️ Your solution:
const jsonQ9 = '{"city":"indore","pin":452001}';
const parsedQ9 = JSON.parse(jsonQ9) as { city: string; pin: number };
console.log(parsedQ9.city.toUpperCase()); // INDORE
//
// 💡 Kyun: JSON.parse hamesha `any` return karta hai, TS ko nahi pata
//    andar kya hai. `as` se humne shape bata diya, ab autocomplete aur
//    checking milti hai. ⚠️ Lekin TS ise VERIFY nahi karta. JSON me
//    "city" na ho to bhi TS chup rahega. Production me Zod se validate
//    karte hain (Phase 5).

// 🌍 Real example 1: localStorage se saved cart padhna (wahan sab text hota hai)
const savedCartTextEx9 = '[{"name":"Tea","qty":2}]';
type SavedItemEx9 = { name: string; qty: number };
const savedCartEx9 = JSON.parse(savedCartTextEx9) as SavedItemEx9[];
console.log("Saved items:", savedCartEx9.length);

// 🌍 Real example 2: API response ka shape batana
type WeatherEx9 = { city: string; tempC: number };
const responseBodyEx9 = '{"city":"Bhopal","tempC":31}';
const weatherEx9 = JSON.parse(responseBodyEx9) as WeatherEx9;
console.log(`${weatherEx9.city}: ${weatherEx9.tempC}°C`);


// ════════════════════════════════════════════════════════════════════
// ❓ Q10. 🔮 Predict what prints, then run it:
//      const valQ10 = "100" as unknown as number;
//
// 🇮🇳 Kya pooch raha hai: "100" (string) ko double assertion se number
//    bataya hai. Batao typeof kya print karega, aur +1 karne par kya aayega.
//    Aur kyun?
//
// ✍️ Your answers:
//      console.log(typeof valQ10);   // ✅ "string"
//      console.log(valQ10 + 1);      // ✅ "1001"  (text joda gaya, 101 nahi)
//      Why? `as` only changes what TypeScript THINKS, not the real value.
//      The value is still the string "100", so "100" + 1 joins text → "1001".
//
// 💡 Kyun: Assertion ≠ Conversion. TS ko laga number hai, isliye koi error
//    nahi diya, lekin runtime par value string hi rahi. Value convert
//    karni ho to Number(), parseInt(), String() use karo.

// 🌍 Real example 1: form se aaya amount, assertion se bill galat 😱
const amountFromFormEx10 = "100" as unknown as number;
console.log("Wrong total:", amountFromFormEx10 + 50); // "10050" ❌

// 🌍 Real example 2: wahi cheez sahi tareeke se (conversion)
const amountFixedEx10 = Number("100");
console.log("Right total:", amountFixedEx10 + 50); // 150 ✅


// ════════════════════════════════════════════════════════════════════
// ❓ Q11. 🐞 Find the mistake: why is this assertion blocked? Fix it the RIGHT way
//      (convert the value, don't assert).
//      const ageQ11 = "25" as number;
//
// 🇮🇳 Kya pooch raha hai: TS ye assertion allow kyun nahi kar raha?
//    `as` ki jagah value ko sach me number me badlo.
//
// ✍️ Your solution:
//      Mistake: A string cannot be asserted as a number directly. TS says:
//      "Conversion of type 'string' to type 'number' may be a mistake because
//      neither type sufficiently overlaps with the other." It must be CONVERTED.
const ageQ11 = Number("25");
console.log(ageQ11, typeof ageQ11); // 25 number
//
// 💡 Kyun: string aur number ka koi relation nahi, isliye TS seedha `as`
//    rok deta hai (wo samajh jata hai ki ye galti hai). Number("25")
//    runtime par sach me 25 (number) bana deta hai.

// 🌍 Real example 1: URL se product ID (/product/42), URL me sab text hota hai
const productIdTextEx11 = "42";
const productIdEx11 = parseInt(productIdTextEx11, 10);
console.log("Product ID:", productIdEx11 + 1); // 43 ✅

// 🌍 Real example 2: user ne galat input diya, NaN check zaroori hai
function toQuantityEx11(input: string): number {
  const qty = Number(input);
  return Number.isNaN(qty) || qty < 1 ? 1 : qty;
}
console.log(toQuantityEx11("3"), toQuantityEx11("abc")); // 3 1


// ════════════════════════════════════════════════════════════════════
// ❓ Q12. Create `rolesQ12 = ["admin", "user", "guest"]` so that its type is
//      readonly ["admin", "user", "guest"]. Try to push "owner" and write the error.
//
// 🇮🇳 Kya pooch raha hai: Array aisa banao ki wo badal na sake (readonly)
//    aur har value ka exact type ho. Phir "owner" push karke error dekho.
//
// ✍️ Your solution:
const rolesQ12 = ["admin", "user", "guest"] as const;
// rolesQ12.push("owner"); // ❌ Property 'push' does not exist on type 'readonly ["admin", "user", "guest"]'.
console.log(rolesQ12);
//
// 💡 Kyun: `as const` do kaam karta hai: (1) sab readonly, push/pop band,
//    (2) "admin" ka type string nahi, exact "admin". Tip: aapne `let`
//    likha tha, `const` behtar hai kyunki fixed list ko reassign bhi
//    nahi hona chahiye.

// 🌍 Real example 1: roles list se type banana (production me bahut common)
type RoleEx12 = (typeof rolesQ12)[number]; // "admin" | "user" | "guest"
function canDeleteEx12(role: RoleEx12): boolean {
  return role === "admin";
}
console.log(canDeleteEx12("admin"), canDeleteEx12("guest")); // true false
// canDeleteEx12("owner"); // ❌ "owner" list me nahi hai

// 🌍 Real example 2: app config jo galti se change na ho
const appConfigEx12 = { apiUrl: "https://api.shop.com", timeoutMs: 5000 } as const;
// appConfigEx12.timeoutMs = 0; // ❌ Cannot assign to 'timeoutMs' because it is a read-only property.
console.log(appConfigEx12.apiUrl);


// ─────────────────────── SECTION 5: NARROWING ───────────────────────

// ════════════════════════════════════════════════════════════════════
// ❓ Q13. Write `describeQ13(value: string | number | boolean): string`:
//      string  → "Text of length <n>"
//      number  → "Number <value * 2>"
//      boolean → "Boolean <value>"
//      Use typeof.
//
// 🇮🇳 Kya pooch raha hai: Value string, number ya boolean me se kuch bhi
//    ho sakti hai. typeof se pata karo kaunsa type hai, aur har type ke
//    liye alag message return karo.
//
// ✍️ Your solution:
function describeQ13(value: string | number | boolean): string {
  if (typeof value === "string") {
    return `Text of length ${value.length}`;
  }
  if (typeof value === "number") {
    return `Number ${value * 2}`;
  }
  return `Boolean ${value}`;
}
console.log(describeQ13("chai"), "|", describeQ13(25), "|", describeQ13(true));
//
// 💡 Kyun: Har `if` + `return` ke baad TS ek type hata deta hai:
//    string | number | boolean → number | boolean → boolean.
//    Isliye last line par check ki zaroorat nahi (control flow analysis).
//    typeof ke saath hamesha quotes: "string", "number".

// 🌍 Real example 1: Excel jaisi table ka cell format karna
function formatCellEx13(cell: string | number | boolean): string {
  if (typeof cell === "string") return cell.trim();
  if (typeof cell === "number") return cell.toFixed(2);
  return cell ? "Yes" : "No";
}
console.log(formatCellEx13("  Ravi "), formatCellEx13(99.5), formatCellEx13(true)); // Ravi 99.50 Yes

// 🌍 Real example 2: price kabhi number, kabhi text me aata hai ("499")
function toRupeesEx13(price: number | string): string {
  const amount = typeof price === "string" ? Number(price) : price;
  return `₹${amount.toLocaleString("en-IN")}`;
}
console.log(toRupeesEx13(150000), toRupeesEx13("499")); // ₹1,50,000 ₹499


// ════════════════════════════════════════════════════════════════════
// ❓ Q14. 🐞 Find the mistake and fix it using narrowing (no `!`, no `as`):
//      function greetQ14(name: string | null): string {
//        return "Hello " + name.toUpperCase();
//      }
//
// 🇮🇳 Kya pooch raha hai: name null bhi ho sakta hai, aur null par
//    .toUpperCase() crash karega. Galti batao aur narrowing (if check) se
//    fix karo. `!` ya `as` use NAHI karna.
//
// ✍️ Your solution:
//      Mistake: name can be null, and null.toUpperCase() crashes at runtime.
//      TypeScript gives: 'name' is possibly 'null'.
function greetQ14(name: string | null): string {
  if (name === null) {
    return "Hello Guest";
  }
  return `Hello ${name.toUpperCase()}`; // 📝 added .toUpperCase() back (the question needs it)
}
console.log(greetQ14("ravi"), "|", greetQ14(null)); // Hello RAVI | Hello Guest
//
// 💡 Kyun: `if (name === null) return` ke baad TS jaanta hai ki neeche
//    name sirf `string` hai, isliye .toUpperCase() safe hai. `!` ya `as`
//    sirf error CHHUPATE hain, crash wahi rehta hai. Narrowing problem ko
//    sach me HANDLE karta hai.

// 🌍 Real example 1: website header, user login hai ya nahi
type LoggedInUserEx14 = { name: string };
function headerTextEx14(user: LoggedInUserEx14 | null): string {
  if (user === null) return "Login / Sign up";
  return `Welcome, ${user.name}`;
}
console.log(headerTextEx14(null), "|", headerTextEx14({ name: "Ravi" }));

// 🌍 Real example 2: address abhi add nahi kiya
type AddressEx14 = { city: string; pin: string };
function deliveryTextEx14(address: AddressEx14 | null): string {
  return address === null ? "Please add a delivery address" : `Delivering to ${address.city} (${address.pin})`;
}
console.log(deliveryTextEx14(null), "|", deliveryTextEx14({ city: "Indore", pin: "452001" }));


// ════════════════════════════════════════════════════════════════════
// ❓ Q15. Create two types:
//        CarQ15  = { drive: () => void }
//        BoatQ15 = { sail: () => void }
//      Write `travelQ15(v: CarQ15 | BoatQ15)` that calls the correct method using `in`.
//
// 🇮🇳 Kya pooch raha hai: Car ke paas drive() hai, Boat ke paas sail().
//    Function me Car YA Boat aayega. `in` se check karo ki object me
//    "drive" hai ya nahi, aur sahi method call karo.
//
// ✍️ Your solution:
type CarQ15 = { drive: () => void };
type BoatQ15 = { sail: () => void };

function travelQ15(v: CarQ15 | BoatQ15): void {
  if ("drive" in v) {
    v.drive(); // v: CarQ15
  } else {
    v.sail(); // v: BoatQ15
  }
}
const myCar: CarQ15 = { drive: () => console.log("Driving") };
const myBoat: BoatQ15 = { sail: () => console.log("Sailing") };
travelQ15(myCar);
travelQ15(myBoat);
//
// 💡 Kyun: Car aur Boat dono objects hain, isliye typeof dono ke liye
//    "object" deta hai, wo kaam nahi aayega. `in` property ki maujoodgi
//    check karta hai. "drive" mila to Car, warna Boat. TS dono blocks me
//    type apne aap narrow kar deta hai.

// 🌍 Real example 1: payment, card ya UPI
type CardPayEx15 = { cardNumber: string };
type UpiPayEx15 = { upiId: string };
function payTextEx15(p: CardPayEx15 | UpiPayEx15): string {
  if ("cardNumber" in p) return `Card ending ${p.cardNumber.slice(-4)}`;
  return `UPI: ${p.upiId}`;
}
console.log(payTextEx15({ cardNumber: "1234567812345678" }), "|", payTextEx15({ upiId: "ravi@okaxis" }));

// 🌍 Real example 2: notification, email ya SMS
type EmailNoteEx15 = { emailTo: string; subject: string };
type SmsNoteEx15 = { phone: string; text: string };
function sendNoteEx15(n: EmailNoteEx15 | SmsNoteEx15): string {
  if ("emailTo" in n) return `📧 Email to ${n.emailTo}: ${n.subject}`;
  return `📱 SMS to ${n.phone}: ${n.text}`;
}
console.log(sendNoteEx15({ emailTo: "a@b.com", subject: "Order shipped" }));
console.log(sendNoteEx15({ phone: "9876543210", text: "OTP is 4321" }));


// ════════════════════════════════════════════════════════════════════
// ❓ Q16. Create a discriminated union `PaymentQ16`:
//        { method: "card"; cardNumber: string }
//        { method: "upi"; upiId: string }
//        { method: "cash" }
//      Write `payQ16(p: PaymentQ16): string` using switch, with an exhaustive
//      `never` check in default. Then ADD { method: "wallet"; walletId: string }
//      to the union and see what error you get. Write it, then handle "wallet".
//
// 🇮🇳 Kya pooch raha hai: 3 payment types ka ek union banao. Teeno me
//    common field `method` hai jiski value alag hai ("card"/"upi"/"cash").
//    Isi ko "discriminated union" kehte hain. switch(p.method) se har case
//    handle karo. default me `const unhandled: never = p;` likho.
//    Phir union me 4th type "wallet" add karo, aur dekho TS kaise yaad
//    dilata hai ki wallet ka case handle nahi kiya.
//
// ✍️ Solution (final version, with "wallet" already added and handled):
type PaymentQ16 =
  | { method: "card"; cardNumber: string }
  | { method: "upi"; upiId: string }
  | { method: "cash" }
  | { method: "wallet"; walletId: string };

function payQ16(p: PaymentQ16): string {
  switch (p.method) {
    case "card":
      return `Paid by card ending ${p.cardNumber.slice(-4)}`; // p: card type
    case "upi":
      return `Paid by UPI: ${p.upiId}`; // p: upi type
    case "cash":
      return "Pay cash on delivery"; // p: cash type
    case "wallet":
      return `Paid from wallet ${p.walletId}`; // p: wallet type
    default: {
      const unhandled: never = p;
      return unhandled;
    }
  }
}
console.log(payQ16({ method: "card", cardNumber: "1234567812345678" }));
console.log(payQ16({ method: "upi", upiId: "ravi@okaxis" }));
console.log(payQ16({ method: "cash" }));
console.log(payQ16({ method: "wallet", walletId: "PAYTM-778" }));
//
//      Error (when "wallet" was added to the union but `case "wallet"` was missing):
//      Type '{ method: "wallet"; walletId: string; }' is not assignable to type 'never'.
//
//      👉 Try it: comment out the `case "wallet":` lines and run `npx tsc --noEmit`.
//
// 💡 Kyun:
//    • `method` field har type me hai lekin value alag hai. switch me
//      `p.method` check karte hi TS samajh jata hai kaunsa type hai. Isliye
//      "card" case me p.cardNumber milta hai, aur "upi" me p.upiId.
//    • default me sirf wahi case pahunchta hai jo upar handle nahi hua.
//      Agar sab handle ho gaye, to p ka type `never` hota hai (kuch nahi bacha).
//    • Naya type add kiya aur case bhoole, to p `never` nahi rahega, aur
//      compile ERROR aa jayega. Yaani TS khud yaad dilata hai 🔔.
//      Bade projects me ye bahut bugs bachata hai.

// 🌍 Real example 1: order tracking (Swiggy/Zomato jaisa)
type OrderStateEx16 =
  | { status: "placed"; placedAt: string }
  | { status: "preparing"; etaMinutes: number }
  | { status: "out_for_delivery"; riderName: string }
  | { status: "delivered" };

function orderMessageEx16(order: OrderStateEx16): string {
  switch (order.status) {
    case "placed":
      return `Order placed at ${order.placedAt}`;
    case "preparing":
      return `Food is being prepared, ready in ${order.etaMinutes} min 🍳`;
    case "out_for_delivery":
      return `${order.riderName} is on the way 🛵`;
    case "delivered":
      return "Delivered. Enjoy your meal! 😋";
    default: {
      const unhandled: never = order;
      return unhandled;
    }
  }
}
console.log(orderMessageEx16({ status: "preparing", etaMinutes: 15 }));
console.log(orderMessageEx16({ status: "out_for_delivery", riderName: "Amit" }));

// 🌍 Real example 2: API call ki state (React apps me har jagah)
type FetchStateEx16 =
  | { state: "loading" }
  | { state: "success"; products: string[] }
  | { state: "error"; errorMessage: string };

function screenTextEx16(s: FetchStateEx16): string {
  switch (s.state) {
    case "loading":
      return "⏳ Loading products...";
    case "success":
      return `✅ ${s.products.length} products found`;
    case "error":
      return `❌ ${s.errorMessage}`;
    default: {
      const unhandled: never = s;
      return unhandled;
    }
  }
}
console.log(screenTextEx16({ state: "success", products: ["Tea", "Coffee"] }));
console.log(screenTextEx16({ state: "error", errorMessage: "Network error" }));


// ════════════════════════════════════════════════════════════════════
// ❓ Q17. Write a custom type guard `isUserQ17(value: unknown): value is { id: number; email: string }`.
//      Test it on JSON.parse('{"id":1,"email":"a@b.com"}') and log the email.
//
// 🇮🇳 Kya pooch raha hai: Apna khud ka checking function banao jo true/false
//    return kare. Return type `value is {...}` likhne se TS samajh jata hai
//    ki true aaya to value us shape ki hai. Phir JSON.parse ke result par
//    use karo aur email print karo.
//
// ✍️ Solution:
type UserQ17 = { id: number; email: string };

function isUserQ17(value: unknown): value is UserQ17 {
  return (
    typeof value === "object" && // object hona chahiye
    value !== null && // null bhi "object" hota hai, use hatao
    "id" in value && // id property honi chahiye
    "email" in value && // email property honi chahiye
    typeof value.id === "number" && // id number ho
    typeof value.email === "string" // email string ho
  );
}

const dataQ17: unknown = JSON.parse('{"id":1,"email":"a@b.com"}');
if (isUserQ17(dataQ17)) {
  console.log("Email:", dataQ17.email); // dataQ17: UserQ17 ✅
} else {
  console.log("Not a valid user");
}
//
// 💡 Kyun:
//    • Normal function `boolean` return karta hai, lekin TS ko nahi batata
//      ki true ka MATLAB kya hai.
//    • `value is UserQ17` likhne se TS samajh jata hai: "true aaya, to
//      if ke andar value UserQ17 hai".
//    • `as` se farak: `as` bina check ke maan leta hai ❌. Type guard
//      sach me RUNTIME par check karta hai ✅.
//    • typeof value === "object" ke baad `value !== null` zaroori hai,
//      kyunki typeof null bhi "object" hota hai (JS bug).

// 🌍 Real example 1: login API ka response check karna
type LoginResponseEx17 = { token: string; expiresIn: number };
function isLoginResponseEx17(v: unknown): v is LoginResponseEx17 {
  return (
    typeof v === "object" &&
    v !== null &&
    "token" in v &&
    "expiresIn" in v &&
    typeof v.token === "string" &&
    typeof v.expiresIn === "number"
  );
}
const loginBodyEx17: unknown = JSON.parse('{"token":"abc.def.ghi","expiresIn":3600}');
if (isLoginResponseEx17(loginBodyEx17)) {
  console.log(`Logged in, token valid for ${loginBodyEx17.expiresIn / 60} min`);
}

// 🌍 Real example 2: mixed data me se sirf valid users filter karna
// filter() ke saath type guard dene se result ka type bhi UserQ17[] ban jata hai.
const rowsEx17: unknown[] = [
  { id: 1, email: "ravi@mail.com" },
  { id: "2", email: "bad-id" }, // id string hai ❌
  null, // ❌
  { id: 3, email: "amit@mail.com" },
];
const validUsersEx17 = rowsEx17.filter(isUserQ17); // hover → UserQ17[]
console.log(validUsersEx17.map((u) => u.email)); // [ 'ravi@mail.com', 'amit@mail.com' ]


// ════════════════════════════════════════════════════════════════════
// ❓ Q18. Write a try/catch that runs JSON.parse("not json").
//      In catch, print err.message ONLY if err is an Error. Why can't you
//      just write err.message directly?
//
// 🇮🇳 Kya pooch raha hai: Galat JSON parse karo taaki error aaye. catch me
//    err.message tabhi print karo jab err sach me Error object ho.
//    Batao ki seedha err.message kyun nahi likh sakte.
//
// ✍️ Solution:
try {
  JSON.parse("not json");
} catch (err) {
  // err: unknown (hover karke dekho)
  if (err instanceof Error) {
    console.log("Parse failed:", err.message); // err: Error ✅
  } else {
    console.log("Unknown error:", err);
  }
}
//      Why can't you write err.message directly?
//      In strict mode, `err` in catch is `unknown`. In JavaScript you can
//      `throw` ANYTHING: throw "text", throw 404, throw null. So TS cannot
//      be sure err has `.message`. Error: 'err' is of type 'unknown'.
//
// 💡 Kyun:
//    • JS me `throw "oops"` ya `throw 500` bhi valid hai. Inke paas
//      .message nahi hota.
//    • Isliye TS strict mode me err ko `unknown` deta hai (setting:
//      useUnknownInCatchVariables, jo `strict` me ON hoti hai).
//    • `instanceof Error` se narrowing ke baad err.message safe hai.

// 🌍 Real example 1: API call fail hone par user ko sahi message dikhana
function loadProfileEx18(json: string): string {
  try {
    const data = JSON.parse(json) as { name: string };
    return `Hello ${data.name}`;
  } catch (err) {
    if (err instanceof Error) {
      return `Could not load profile: ${err.message}`;
    }
    return "Could not load profile";
  }
}
console.log(loadProfileEx18('{"name":"Ravi"}'));
console.log(loadProfileEx18("{broken"));

// 🌍 Real example 2: alag-alag error types ko alag tarah handle karna
// (class aage Phase 2 me detail me padhenge, abhi bas instanceof dekho)
class NotFoundErrorEx18 extends Error {}
class PaymentErrorEx18 extends Error {}

function handleErrorEx18(err: unknown): string {
  if (err instanceof NotFoundErrorEx18) return `404 → ${err.message}`;
  if (err instanceof PaymentErrorEx18) return `💳 Payment issue → ${err.message}`;
  if (err instanceof Error) return `500 → ${err.message}`;
  return "500 → Unknown error";
}
console.log(handleErrorEx18(new NotFoundErrorEx18("Product not found")));
console.log(handleErrorEx18(new PaymentErrorEx18("Card declined")));
console.log(handleErrorEx18("weird thing thrown"));


// ─────────────────── SECTION 6: TYPE COMPATIBILITY ───────────────────

// ════════════════════════════════════════════════════════════════════
// ❓ Q19. 🔮 Which of these give an error? Write ✅ or ❌ and the reason:
//      type UserQ19 = { name: string };
//      const adminQ19 = { name: "Ravi", role: "admin" };
//      const u1Q19: UserQ19 = adminQ19;                          // ______
//      const u2Q19: UserQ19 = { name: "Ravi", role: "admin" };  // ______
//      const u3Q19: UserQ19 = {};                                // ______
//
// 🇮🇳 Kya pooch raha hai: UserQ19 ko sirf `name` chahiye. Teeno lines me
//    batao kaunsi chalegi (✅) aur kaunsi error degi (❌), aur kyun.
//    Dhyan do: line 1 me VARIABLE diya hai, line 2 me seedha OBJECT LITERAL.
//
// ✍️ Answers:
//      u1Q19 = adminQ19                      ✅ Works. adminQ19 is a VARIABLE that has `name`.
//                                               The extra `role` is fine (structural typing).
//      u2Q19 = { name, role } (literal)      ❌ Error: Object literal may only specify known
//                                               properties, and 'role' does not exist in type 'UserQ19'.
//                                               (EXCESS PROPERTY CHECK on fresh object literals)
//      u3Q19 = {}                            ❌ Error: Property 'name' is missing in type '{}'
//                                               but required in type 'UserQ19'.
type UserQ19 = { name: string };
const adminQ19 = { name: "Ravi", role: "admin" };
const u1Q19: UserQ19 = adminQ19; // ✅
// const u2Q19: UserQ19 = { name: "Ravi", role: "admin" }; // ❌ excess property
// const u3Q19: UserQ19 = {};                               // ❌ missing property
console.log(u1Q19);
//
// 💡 Kyun:
//    • Structural typing: TS sirf dekhta hai ki zaroori properties hain
//      ya nahi. Extra properties wale variable se koi problem nahi.
//    • Lekin jab aap seedha `{ ... }` likhte ho (fresh object literal), TS
//      sochta hai: "ye object abhi yahin bana hai, extra property kyun
//      likhi? Shayad typo hai!" Isliye error deta hai.
//    • Missing property hamesha error hai, kyunki zaroori cheez hi nahi hai.

// 🌍 Real example 1: function ko bada object dena ✅ (roz hota hai)
type DbUserEx19 = { id: number; name: string; email: string; createdAt: string };
const dbUserEx19: DbUserEx19 = { id: 1, name: "Ravi", email: "r@mail.com", createdAt: "2026-01-01" };
function printNameEx19(person: { name: string }): void {
  console.log("Name:", person.name);
}
printNameEx19(dbUserEx19); // ✅ DB user me name hai, baaki extra fine hai

// 🌍 Real example 2: ⚠️ structural typing ka khatra, extra data chupke se chala jata hai
type PublicUserEx19 = { name: string };
const fullUserEx19 = { name: "Ravi", password: "secret123" };
const toSendEx19: PublicUserEx19 = fullUserEx19; // ✅ no error...
console.log(JSON.stringify(toSendEx19)); // {"name":"Ravi","password":"secret123"} 😱 password leak!
// Fix: sirf zaroori fields copy karo
const safeToSendEx19: PublicUserEx19 = { name: fullUserEx19.name };
console.log(JSON.stringify(safeToSendEx19)); // {"name":"Ravi"} ✅
// Lesson: type sirf CHECK karta hai, extra data ko HATATA nahi.


// ════════════════════════════════════════════════════════════════════
// ❓ Q20. 🔮 Which assignments work? ✅ or ❌
//      const yesQ20: "yes" = "yes";
//      let sQ20: string = yesQ20;        // ______
//      let uQ20: unknown = sQ20;         // ______
//      let backQ20: "yes" = sQ20;        // ______
//      let nQ20: number = uQ20;          // ______
//
// 🇮🇳 Kya pooch raha hai: Chhota type bade type me ja sakta hai, lekin
//    bada type chhote me nahi. Har line ke liye batao chalegi ya nahi.
//
// ✍️ Answers:
//      sQ20: string = yesQ20      ✅  "yes" is a string (narrow → wide)
//      uQ20: unknown = sQ20       ✅  everything fits into unknown
//      backQ20: "yes" = sQ20      ❌  Type 'string' is not assignable to type '"yes"'.
//                                     (string could be "no", "hello", anything)
//      nQ20: number = uQ20        ❌  Type 'unknown' is not assignable to type 'number'.
//                                     (must narrow unknown first)
const yesQ20: "yes" = "yes";
let sQ20: string = yesQ20; // ✅
let uQ20: unknown = sQ20; // ✅
// let backQ20: "yes" = sQ20; // ❌
// let nQ20: number = uQ20;   // ❌
console.log(sQ20, uQ20);
//
// 💡 Kyun: Dabbe socho 📦
//      unknown  (sabse bada dabba, kuch bhi aa sakta hai)
//        └─ string  (sirf text)
//             └─ "yes"  (sirf ye ek text)
//    • Chhoti cheez bade dabbe me ✅: "yes" → string → unknown
//    • Bade dabbe ki cheez chhote me ❌: TS ko pakka nahi pata ki wo fit hogi.
//      Pehle check (narrowing) karo, phir assign karo.

// 🌍 Real example 1: API se status string aaya, lekin hume exact type chahiye
type OrderStatusEx20 = "pending" | "shipped" | "delivered";
const statusFromApiEx20: string = "shipped"; // API se sirf string milta hai
// const myStatusEx20: OrderStatusEx20 = statusFromApiEx20; // ❌ string → literal union nahi
function toOrderStatusEx20(s: string): OrderStatusEx20 | null {
  if (s === "pending" || s === "shipped" || s === "delivered") {
    return s; // ✅ narrowing ke baad s: OrderStatusEx20
  }
  return null;
}
console.log(toOrderStatusEx20(statusFromApiEx20), toOrderStatusEx20("lost")); // shipped null

// 🌍 Real example 2: unknown config value ko number me lena
const rawPortEx20: unknown = 3000; // config file se aaya
// const portEx20: number = rawPortEx20; // ❌ unknown → number seedha nahi
const portEx20: number = typeof rawPortEx20 === "number" ? rawPortEx20 : 8080; // ✅
console.log("Server port:", portEx20);


// ════════════════════════════════════════════════════════════════════
// ❓ Q21. 🐞 Find the mistake: there is a TYPO in the property name.
//      Which TypeScript feature catches it? Fix it.
//      type SettingsQ21 = { darkMode: boolean; fontSize: number };
//      const sQ21: SettingsQ21 = { darkmode: true, fontSize: 14 };
//
// 🇮🇳 Kya pooch raha hai: Property ke naam me spelling ki galti hai
//    (capital/small letter). Galti dhoondo, TS ka kaunsa feature ise
//    pakadta hai uska naam batao, aur fix karo.
//
// ✍️ Solution:
//      Mistake: `darkmode` (small m) is written instead of `darkMode` (capital M).
//      Error: Object literal may only specify known properties, but 'darkmode'
//             does not exist in type 'SettingsQ21'. Did you mean to write 'darkMode'?
//      Feature: EXCESS PROPERTY CHECK
type SettingsQ21 = { darkMode: boolean; fontSize: number };
const sQ21: SettingsQ21 = { darkMode: true, fontSize: 14 }; // ✅ fixed
console.log(sQ21);
//
// 💡 Kyun: Object literal me aisi property likhi jo type me nahi hai, to
//    TS samajh jata hai ki ye typo hai. Wo "Did you mean...?" bhi suggest
//    karta hai. JS me ye galti chupchap chal jati: darkMode undefined
//    rehta, aur dark mode kabhi on hi nahi hota, bina kisi error ke 😶.
//    Same case Q19 ki line 2 jaisa hai.

// 🌍 Real example 1: API request body me typo (backend ko galat field jata)
type CreateUserBodyEx21 = { fullName: string; phone: string };
// const bodyEx21: CreateUserBodyEx21 = { fullname: "Ravi", phone: "98765" };
// ❌ 'fullname' does not exist... Did you mean 'fullName'?
const bodyEx21: CreateUserBodyEx21 = { fullName: "Ravi", phone: "98765" }; // ✅
console.log(bodyEx21);

// 🌍 Real example 2: function options me typo
type ToastOptionsEx21 = { message: string; durationMs: number };
function showToastEx21(opts: ToastOptionsEx21): string {
  return `🔔 ${opts.message} (${opts.durationMs}ms)`;
}
// showToastEx21({ message: "Saved", duration: 3000 });
// ❌ 'duration' does not exist in type 'ToastOptionsEx21'.
console.log(showToastEx21({ message: "Saved", durationMs: 3000 })); // ✅


// ─────────────────────── INTERVIEW QUESTIONS ─────────────────────────
// Answer in your own words (2–4 lines each).
// 👉 Ye model answers hain. Inhe padhkar APNE shabdon me bolne ki practice karo.

// IQ1. Difference between any, unknown, never and void? When do you use each?
// 🇮🇳 Charon me fark batao aur har ek kab use karte ho, example ke saath.
// Answer:
//   • any: turns OFF type checking. Anything is allowed, so bugs reach runtime.
//     Avoid it. Use only while migrating old JS code.
//   • unknown: the safe version of any. It accepts any value, but you MUST narrow
//     it before using it. Use for JSON.parse results, API data, and catch errors.
//   • void: the function returns nothing useful (e.g. a logger, an event handler).
//   • never: a value that can never exist. A function that never returns (always
//     throws or loops forever), or the impossible case in an exhaustive switch.
//   (Q6, Q7, Q8)


// IQ2. What is a type assertion? Is it the same as type casting in Java/C#?
//      Why is it risky?
// 🇮🇳 Assertion kya hai? Kya ye Java/C# ke casting jaisa value convert karta
//    hai? Ye risky kyun hai?
// Answer:
//   A type assertion (`value as Type`) tells the compiler "trust me, this is
//   Type". It is NOT casting: it does not convert or check anything at runtime,
//   it only changes what TypeScript thinks. It is risky because if we are wrong,
//   TS shows no error and the program misbehaves later (e.g. "100" as unknown as
//   number gives "1001" on + 1). Prefer narrowing or runtime validation (Zod).
//   (Q9, Q10, Q11)


// IQ3. What is type narrowing? Name 5 ways to narrow a type.
// 🇮🇳 Narrowing kya hai? Type chhota karne ke 5 tareeke batao.
// Answer:
//   Narrowing means TS reduces a wide type (like string | null, or unknown) to a
//   more specific type after a check, using control flow analysis.
//   Ways: 1) typeof  2) truthiness / equality (=== null)  3) `in` operator
//   4) instanceof  5) Array.isArray  6) discriminated unions (switch on a common
//   field)  7) custom type guards (`value is T`)  8) assertion functions.
//   (Q13, Q14, Q15, Q16, Q17, Q18)


// IQ4. What is a discriminated union, and why is the `never` exhaustive check useful?
// 🇮🇳 Discriminated union kya hota hai? default me `never` check lagane se
//    kya fayda hota hai?
// Answer:
//   A discriminated union is a union of object types that all share one common
//   property with a different literal value (e.g. `kind: "circle" | "square"`).
//   Checking that property narrows the object to the exact type.
//   The `never` check in `default` makes TS give a COMPILE ERROR if someone adds a
//   new member to the union and forgets to handle it. So no case is ever missed.
//   (Q16)


// IQ5. What is structural typing? How is it different from nominal typing?
// 🇮🇳 Structural typing (shape dekhna) kya hai, aur nominal typing (naam
//    dekhna, jaise Java) se kaise alag hai?
// Answer:
//   Structural typing ("duck typing"): two types are compatible if their SHAPE
//   (properties and their types) matches. The names don't matter. TypeScript uses this.
//   Nominal typing (Java, C#): types are compatible only if they have the same
//   NAME or are explicitly declared to extend/implement each other.
//   E.g. in TS, `type Person = {name: string}` and `type Employee = {name: string}`
//   are interchangeable. In Java two such classes are not.
//   (Q19, Lesson Topic 6)


// IQ6. What is the excess property check? When does it happen and when not?
// 🇮🇳 Excess property check kya hai? Kab lagta hai (object literal) aur kab
//    nahi (variable)?
// Answer:
//   It is an extra check where TS gives an error if a FRESH OBJECT LITERAL has a
//   property that the target type doesn't have. It catches typos like `darkmode`.
//   It happens: when you directly write `{ ... }` while assigning to a typed
//   variable, passing as an argument, or returning it.
//   It does NOT happen: when you assign an existing VARIABLE that has extra
//   properties (structural typing allows it).
//   (Q19, Q21)


// IQ7. `as` vs `!` vs narrowing: which one should you prefer in production code and why?
// 🇮🇳 Teeno me se production me kaunsa use karna chahiye aur kyun?
// Answer:
//   Prefer NARROWING. It actually checks the value at runtime and handles the bad
//   case, so the code is truly safe.
//   `as` and `!` only silence the compiler. They don't check anything, so if we are
//   wrong the app crashes at runtime. Use them only when we are 100% sure and TS
//   cannot know (e.g. after our own validation), and keep them rare.
//   (Q14)


export {};
