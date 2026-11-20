// ╔════════════════════════════════════════════════════════════════════╗
// ║  PRACTICE 1: Type Inference, Annotation & Primitive Types            ║
// ║                                                                      ║
// ║  How to practice:                                                    ║
// ║   1. Read each question and write your code below it.                ║
// ║   2. For "Predict" questions, write your answer in the comment FIRST,║
// ║      then hover in VS Code to check.                                 ║
// ║   3. Run `npx tsc --noEmit` after each question.                     ║
// ║   4. Don't look at the lesson file unless you are stuck.             ║
// ║   5. Send me your solutions when done and I will review them.        ║
// ╚════════════════════════════════════════════════════════════════════╝


// ─────────────────────────── LEVEL 1: EASY ───────────────────────────

// Q1. Create 3 variables WITHOUT writing types (use inference):
//     your name, your age, and whether you are a student.
//     Hover over each one. Write the inferred type in a comment next to it.
let name = "John"; // inferred type: string
let age = 25; // inferred type: number
let isStudent = true; // inferred type: boolean



// Q2. Create the same 3 variables again, but this time WITH annotations.
//     (Use different variable names so they don't clash with Q1.)
let name2: string ='Jone';
let age2: number = 30;
let isStudent2: boolean = false;



// Q3. Predict the type (write your answer, then hover to check):
//     const a = "hello";      // my answer: "hello"  (literal type, NOT string)
//     let   b = "hello";      // my answer: string
//     const c = 42;           // my answer: 42       (literal type, NOT number)
//     let   d = true;         // my answer: boolean
//     Explain in one line WHY `a` and `b` have different types:
//     A `const` can never change, so TS gives it the exact value as its type
//     (literal type). A `let` can change, so TS widens it to `string` (widening).
const a = "hello";
let b = "hello";
const c = 42;
let d = true;



// Q4. Declare a variable `totalMarks` that has NO value yet, but must
//     hold a number. Then assign 450 to it on the next line.
let totalMarks: number;
totalMarks = 450;



// ─────────────────────────── LEVEL 2: MEDIUM ─────────────────────────

// Q5. Write a function `greet` that takes `name` (string) and `age` (number)
//     and RETURNS the string: "Hi <name>, you are <age> years old".
//     Annotate both parameters AND the return type.
//     Call it and console.log the result.
function greet(name: string, age: number): string {
  return `Hi ${name}, you are ${age} years old`;
}

console.log(greet("Deepak ", 35));


// Q6. Write a function `calculateGST(amount: number): number` that returns
//     18% GST of the amount. Example: calculateGST(1000) → 180.
//     Then try calling calculateGST("1000"). Write the error message here:
function calculateGST(amount: number): number {
  return (amount * 18) / 100;
}
console.log(calculateGST(1000)); // 180
// console.log(calculateGST("1000"));
//     Error: Argument of type 'string' is not assignable to parameter of type 'number'.
//     (Comment out the wrong call after you see the error.)



// Q7. Create a variable `phoneNumber` that can be a string OR null.
//     Start it as null, then assign "9876543210".
//     Then try making a plain `string` variable and assign null to it.
//     Write the error here: ______
let  phoneNumber: string | null = null;
phoneNumber = "9876543210";

let myString: string;
// myString = null;
// Error: Type 'null' is not assignable to type 'string'.


// Q8. Create a variable `status` that can ONLY be "online" or "offline".
//     Assign "online", then change it to "offline".
//     Try assigning "away". Write the error here: ______
let status : "online" | "offline" = "online";
status = "offline";
// status = "away"; 
// Error: Type '"away"' is not assignable to type '"online" | "offline"'.


// ─────────────────────────── LEVEL 3: THINK ──────────────────────────

// Q9. Fix the bugs in this code. Uncomment it, read the errors, then fix it
//     WITHOUT using `any`.
//
let productName: string = "Laptop";
let productPrice: number = 50000;
productName = "Monitor";
productPrice = 5000;
function applyDiscount(price: number, percent: number): number {
  return price - (price * percent) / 100;
}

   

// Q10. Number.MAX_SAFE_INTEGER is 9007199254740991.
//      a) console.log(Number.MAX_SAFE_INTEGER + 2). What prints? Is it correct?
//      b) Do the same calculation with bigint so the answer is exact.
//      c) Try adding a bigint and a normal number. Write the error: ______
console.log(Number.MAX_SAFE_INTEGER + 2); // 9007199254740992 ❌ wrong! (should be ...993)
console.log(9007199254740991n + 2n); // 9007199254740993n ✅ exact
// console.log(10n + 5);
// Error: Operator '+' cannot be applied to types 'bigint' and 'number'.



// Q11. Predict what each line prints, THEN run the file to check:
//      console.log(typeof "5");        // my answer: ______string
//      console.log(typeof 5);          // my answer: ______number
//      console.log(typeof null);       // my answer: ______object
//      console.log(typeof undefined);  // my answer: ______undefined
//      console.log(typeof 5n);         // my answer: ______bigint



// ─────────────────────── INTERVIEW QUESTIONS ─────────────────────────
// Answer these in your own words (2–3 lines each), as comments.

// IQ1. What is the difference between compile time and runtime in TypeScript?
//      Does TypeScript check types when the program runs?
// Answer:No typescript is not check the types on the program run time it is check the types on the compile time only. 
// Compile time is when the code is being compiled and checked for errors, while runtime is when the code is actually executed. 
// TypeScript performs type checking during compile time, not at runtime.


// IQ2. What is type inference? When should you write type annotations
//      and when should you let TypeScript infer?
// Answer: Type inference is the process by which TypeScript automatically figures out
// the type of a variable from its value.
// Let TS infer: when you declare a variable WITH a value (`let age = 25`).
// Write annotations: on function parameters, return types, and variables declared
// WITHOUT a value (`let totalMarks: number;`), or when you want a different type.


// IQ3. Why does `const x = "hi"` have type "hi" but `let y = "hi"`
//      has type string? What is this called?
// Answer: A `const` can never be reassigned, so TypeScript gives it the exact value as
// its type: a LITERAL TYPE ("hi"). A `let` can change later, so TypeScript gives it
// the wider type `string`. This is called TYPE WIDENING.


// IQ4. What is the difference between `null` and `undefined`?
// Answer: null and undefined are both separate primitive types.
// (typeof null returns "object", but that is an old JavaScript bug. null is NOT an object.)
// null we used intensationally to represent the absence of a value, while undefined is the default value of uninitialized variables or missing properties.


// IQ5. Why should you use `string` and not `String` as a type?
// Answer: The `string` type is a primitive type in TypeScript, 
// while `String` is an object wrapper for the primitive string type. Using `string` 
// is preferred because it is more efficient and avoids unnecessary object creation. 
// It also ensures that you are working with the primitive type rather than the object type, 
// |which can lead to unexpected behavior.


export {};
