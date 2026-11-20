# TypeScript Roadmap: Basics → Advanced → Production → Interview

Practice files go in `src/<phase>/<topic>.ts`. Check them with `npx tsc --noEmit`, and run them with `npx tsc` then `node dist/<path>.js`.
Mark each topic `[x]` when you can **explain it without notes** and have **written code for it**.

---

## Phase 0: Setup ✅
- [x] Node + npm, `npm init`, `npm i -D typescript`
- [x] `tsc --init`, `rootDir` / `outDir`, compile + run
- [x] `tsc` vs `node`, `--noEmit`, npm scripts

## Phase 1: Basics (Week 1–2)
- [ ] Why TypeScript? Static typing, compile time vs runtime (types are erased)
- [ ] Type **inference** vs type **annotation** (when to write types, when not to)
- [ ] Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`
- [ ] Special types: `any` vs `unknown` vs `never` vs `void`  ⭐ interview favourite
- [ ] Arrays: `number[]`, `Array<number>`, `readonly string[]`
- [ ] Tuples: `[string, number]`, optional and named tuple elements
- [ ] Object types: optional `?`, `readonly`, nested objects
- [ ] Union `|` and literal types: `"success" | "error"`
- [ ] `type` alias vs `interface`  ⭐ interview favourite
- [ ] Functions: parameter and return types, optional and default params, rest params, `void`
- [ ] Enums vs `as const` objects (and why production code often avoids `enum`)
- [ ] Type assertions: `as`, the non-null `!`, and why to avoid them

## Phase 2: Intermediate (Week 3–4)
- [ ] **Narrowing**: `typeof`, `instanceof`, `in`, equality, truthiness
- [ ] **Discriminated unions** (most-used pattern in real code)
- [ ] Exhaustiveness checking with `never`
- [ ] Custom type guards: `function isUser(x): x is User`
- [ ] Assertion functions: `asserts x is T`
- [ ] Intersection `&` vs `extends`
- [ ] Index signatures `{ [key: string]: number }` and `Record<K, V>`
- [ ] Function types, callback types, function overloads
- [ ] Classes: `public`/`private`/`protected`/`#private`, `readonly`, parameter properties
- [ ] `abstract` classes, `implements`, interface vs abstract class
- [ ] **Generics basics**: generic functions, interfaces, classes
- [ ] Generic constraints: `<T extends { id: string }>`, default type params

## Phase 3: Advanced Types (Week 5–7)
- [ ] `keyof`, `typeof` (type position), indexed access `T["key"]`
- [ ] **Utility types**: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`,
      `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`
- [ ] Rebuild each utility type yourself  ⭐ interview favourite
- [ ] **Mapped types**: `{ [K in keyof T]: ... }`, `-?`, `-readonly`, key remapping `as`
- [ ] **Conditional types**: `T extends U ? X : Y`, distributive conditional types
- [ ] `infer` keyword
- [ ] Template literal types: `` `on${Capitalize<E>}` ``
- [ ] `as const`, `satisfies`  (modern, used a lot in production)
- [ ] Branded / nominal types: `type UserId = string & { __brand: "UserId" }`
- [ ] Recursive types (JSON type, DeepPartial)
- [ ] Declaration merging, module augmentation
- [ ] Variance basics, `unknown` in catch blocks

## Phase 4: Modules, Config & Tooling (Week 8)
- [ ] ES Modules vs CommonJS, `import type`, `verbatimModuleSyntax`
- [ ] `tsconfig.json` in depth: `strict` family, `target`, `module`, `moduleResolution`, `lib`,
      `noUncheckedIndexedAccess`, `paths`, `skipLibCheck`, `incremental`, project references
- [ ] `.d.ts` declaration files, `@types/*` packages, `declare module`
- [ ] Typing a JS library that has no types
- [ ] Running TS directly: `tsx` and Node's type stripping (`node file.ts`)
- [ ] ESLint with `typescript-eslint`, Prettier

## Phase 5: Production Level (Week 9–12)
- [ ] Node + TS backend: `@types/node`, Express/Fastify with typed req/res
- [ ] **Runtime validation with Zod** (types disappear at runtime!) and `z.infer`
- [ ] Typing environment variables safely
- [ ] Error handling: typed errors, `Result<T, E>` pattern, `unknown` in `catch`
- [ ] Async: `Promise<T>`, `Awaited`, typing `fetch` responses
- [ ] Typed API layer: shared types between frontend and backend
- [ ] Database typing: Prisma or Drizzle
- [ ] Testing with Vitest (type-safe mocks)
- [ ] React + TS: props, children, `useState`/`useReducer`/`useRef`, events, generic components
- [ ] Project structure, barrel files, path aliases, monorepo basics
- [ ] Build for production: `tsc` vs bundlers (tsup, esbuild, Vite)
- [ ] **Project**: build a typed REST API (Express + Zod + Prisma + Vitest)

## Phase 6: Interview Preparation
Be able to answer and code each of these:
- [ ] `type` vs `interface`
- [ ] `any` vs `unknown` vs `never`
- [ ] What is type narrowing? Discriminated unions?
- [ ] What are generics, and why use constraints?
- [ ] Explain `keyof`, `typeof`, mapped and conditional types, `infer`
- [ ] Implement `MyPick`, `MyOmit`, `MyPartial`, `MyReadonly`, `MyReturnType`, `DeepReadonly`
- [ ] `enum` vs union of literals vs `as const`
- [ ] `as` vs `satisfies`
- [ ] Structural typing (duck typing): what is it?
- [ ] Why do we still need runtime validation (Zod)?
- [ ] Function overloads
- [ ] What does `strict` mode turn on?
- [ ] `.d.ts` files and `declare`
- [ ] `Partial<T>` vs optional properties; `Record` vs index signature
- [ ] Practice: solve "easy" + "medium" challenges at github.com/type-challenges/type-challenges

---

## Daily routine
1. Learn 1–2 topics (video or docs: typescriptlang.org/docs/handbook)
2. Write a practice file in `src/` and **break it on purpose** to see the errors
3. Run `npx tsc --noEmit` and read every error message
4. Write 2–3 lines of notes in your own words
