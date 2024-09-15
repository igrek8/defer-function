# Defer Function

[![Edit defer-function](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/m6ffy3)

A defer function defers the execution of a function until the surrounding function returns.

The deferred call's arguments are evaluated immediately, but the function call is not executed until the surrounding function returns.

## Motivation

Perform side effects on the current function return. Powered by [Explicit Resource Management Proposal](https://github.com/tc39/proposal-explicit-resource-management) and [`using`
Declarations and Explicit Resource Management](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html).

## Installation

```
npm i defer-function --save
```

```
yarn add defer-function
```

## Usage

```ts
import getDeferFunction from "defer-function";

function main() {
  using defer = getDeferFunction();
  defer(() => console.log("world"));
  console.log("hello");
}

main();

console.log("!");

// Output:
// hello
// world
// !
```

```ts
import getDeferFunction from "defer-function";

async function print(message: string) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(message);
      resolve();
    });
  });
}

async function main() {
  await using defer = getDeferFunction();
  defer(print, "world");
  console.log("hello");
}

main().then(() => {
  console.log("!");
  // Output:
  // hello
  // world
  // !
});
```
