import assert from "node:assert/strict";
import test from "node:test";
import { runPhase2BrainFlow, type BrainMemoryRecord } from "../src/phase2-flow.js";

test("Phase 2 Brain flow searches memory, avoids provider, writes memory, and emits telemetry", () => {
  const records: BrainMemoryRecord[] = [
    {
      id: "mem-1",
      title: "First Breath objective approved",
      summary: "First Breath is one complete observable Intelligence Loop.",
      tags: ["first-breath", "engineering"],
      confidence: 0.98,
      verified: true
    },
    {
      id: "mem-2",
      title: "Brain memory-first policy approved",
      summary: "Atlas Brain searches memory before selecting a provider.",
      tags: ["brain", "memory"],
      confidence: 0.97,
      verified: true
    }
  ];

  const writes: BrainMemoryRecord[] = [];
  const logs: unknown[] = [];
  const telemetry: unknown[] = [];

  const result = runPhase2BrainFlow({
    loopId: "ML-PHASE2-001",
    organizationId: "mobius-technologies",
    request: "Summarize today's engineering work, using everything you already know before asking an AI provider, and remember anything new you learn.",
    memory: {
      search: () => ({ query: "engineering work", matches: records, matchCount: records.length }),
      write: (input) => {
        const record: BrainMemoryRecord = {
          id: "mem-write-1",
          title: input.title,
          summary: input.summary,
          tags: input.tags,
          confidence: input.confidence,
          verified: input.verified
        };
        writes.push(record);
        return record;
      }
    },
    runtime: {
      record: (input) => logs.push(input)
    },
    dashboard: {
      create: (input) => telemetry.push(input)
    }
  });

  assert.equal(result.status, "completed");
  assert.equal(result.brain, "executed");
  assert.equal(result.memory.lookup, "success");
  assert.equal(result.memory.matches, 2);
  assert.equal(result.memory.writes, 1);
  assert.equal(result.providerCalls, 0);
  assert.equal(result.policyStatus, "passed");
  assert.equal(writes.length, 1);
  assert.ok(logs.length >= 4);
  assert.equal(telemetry.length, 1);
});
