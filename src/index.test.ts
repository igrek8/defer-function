import assert from "node:assert/strict";
import { test } from "node:test";
import getDeferFunction from ".";

test("defers a sync function", () => {
  const stack: string[] = [];
  function main() {
    using defer = getDeferFunction();
    stack.push("start");
    defer(() => stack.push("a"));
    defer(() => stack.push("b"));
    stack.push("end");
  }
  main();
  assert.equal(stack.join(" -> "), "start -> end -> b -> a");
});

test("defers an async function", async () => {
  function nextTick<T>(fn: () => T) {
    return new Promise<void>((resolve) => {
      process.nextTick(() => {
        fn();
        resolve();
      });
    });
  }
  const stack: string[] = [];
  async function main() {
    await using defer = getDeferFunction();
    stack.push("start");
    defer(nextTick, () => stack.push("a"));
    defer(nextTick, () => stack.push("b"));
    stack.push("end");
  }
  await main();
  assert.equal(stack.join(" -> "), "start -> end -> b -> a");
});
