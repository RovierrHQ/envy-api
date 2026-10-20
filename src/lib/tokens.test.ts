import assert from "node:assert/strict";
import test from "node:test";
import { newInviteCode, newPat } from "./tokens.ts";

test("pat prefix", () => {
  const { token, prefix } = newPat();
  assert.ok(token.startsWith("envy_pat_"));
  assert.equal(prefix, token.slice(0, 16));
});

test("invite entropy", () => {
  const a = newInviteCode();
  const b = newInviteCode();
  assert.ok(a.startsWith("envy_inv_"));
  assert.notEqual(a, b);
  assert.ok(a.length > 40);
});
