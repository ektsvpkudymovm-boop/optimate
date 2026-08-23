import assert from "node:assert/strict";
import test from "node:test";
import { auditRecommendations } from "./landing-v2-data";
import { getAuditResult } from "./mini-audit-logic";

test("mini-audit: zero selections returns the approved calm result without recommendations", () => {
  const result = getAuditResult([]);
  assert.equal(result.heading, "Похоже, у вас всё уже оптимизировано");
  assert.deepEqual(result.recommendations, []);
});

test("mini-audit: one selection keeps recommendation zero only", () => {
  const result = getAuditResult([0]);
  assert.equal(result.heading, "Есть 1 точка роста");
  assert.deepEqual(result.recommendations, [auditRecommendations[0]]);
});

test("mini-audit: two selections keep recommendation order", () => {
  const result = getAuditResult([1, 2]);
  assert.equal(result.heading, "Есть 2 точка роста");
  assert.deepEqual(result.recommendations, [auditRecommendations[1], auditRecommendations[2]]);
});

test("mini-audit: three selections return the high-potential result", () => {
  const result = getAuditResult([0, 3, 5]);
  assert.equal(result.heading, "Сильный потенциал автоматизации");
  assert.deepEqual(result.recommendations, [auditRecommendations[0], auditRecommendations[3], auditRecommendations[5]]);
});

test("mini-audit: all seven selections return all approved recommendations", () => {
  const result = getAuditResult([0, 1, 2, 3, 4, 5, 6]);
  assert.equal(result.heading, "Сильный потенциал автоматизации");
  assert.deepEqual(result.recommendations, [...auditRecommendations]);
});

test("mini-audit: a recomputation has no stale recommendations", () => {
  const initial = getAuditResult([0, 1]);
  const recomputed = getAuditResult([1, 4]);
  assert.deepEqual(initial.recommendations, [auditRecommendations[0], auditRecommendations[1]]);
  assert.deepEqual(recomputed.recommendations, [auditRecommendations[1], auditRecommendations[4]]);
  assert.equal(recomputed.recommendations.includes(auditRecommendations[0]), false);
});
