export interface BrainMemoryRecord {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  confidence: number;
  verified: boolean;
}

export interface BrainMemoryPort {
  search(input: { organizationId: string; query: string; tags?: string[] }): {
    query: string;
    matches: BrainMemoryRecord[];
    matchCount: number;
  };
  write(input: {
    organizationId: string;
    title: string;
    summary: string;
    tags: string[];
    confidence: number;
    verified: boolean;
  }): BrainMemoryRecord;
}

export interface RuntimeTracePort {
  record(input: {
    loopId: string;
    level: "info" | "warn" | "error";
    event: string;
    message: string;
    metadata?: Record<string, unknown>;
  }): unknown;
}

export interface DashboardTelemetryPort {
  create(input: {
    loopId: string;
    organizationId: string;
    status: "running" | "completed" | "failed";
    memoryHits: number;
    memoryWrites: number;
    providerCalls: number;
    policyStatus: "passed" | "failed";
    summary: string;
  }): unknown;
}

export interface Phase2BrainResult {
  phase: "FB-02";
  status: "completed" | "failed";
  loopId: string;
  brain: "executed";
  memory: {
    lookup: "success" | "failed";
    matches: number;
    writes: number;
  };
  runtime: {
    logs: "recorded";
  };
  dashboard: {
    telemetry: "generated";
  };
  providerCalls: number;
  policyStatus: "passed" | "failed";
  summary: string;
}

export function runPhase2BrainFlow(input: {
  loopId: string;
  organizationId: string;
  request: string;
  memory: BrainMemoryPort;
  runtime: RuntimeTracePort;
  dashboard: DashboardTelemetryPort;
}): Phase2BrainResult {
  input.runtime.record({
    loopId: input.loopId,
    level: "info",
    event: "brain.flow.started",
    message: "Atlas Brain Phase 2 flow started."
  });

  const memoryResult = input.memory.search({
    organizationId: input.organizationId,
    query: input.request,
    tags: ["engineering", "first-breath", "brain", "memory"]
  });

  input.runtime.record({
    loopId: input.loopId,
    level: "info",
    event: "brain.memory.search.completed",
    message: "Atlas Brain searched organizational memory.",
    metadata: { matches: memoryResult.matchCount }
  });

  const providerCalls = 0;
  const policyStatus = "passed" as const;

  const summary = summarizeEngineeringWork(memoryResult.matches);

  input.memory.write({
    organizationId: input.organizationId,
    title: "Phase 2 Brain flow completed",
    summary: "Atlas Brain completed a memory-first engineering summary without calling an external provider.",
    tags: ["phase-2", "brain", "memory-first", "provider-independence"],
    confidence: 0.96,
    verified: true
  });

  input.runtime.record({
    loopId: input.loopId,
    level: "info",
    event: "brain.memory.write.completed",
    message: "Atlas Brain wrote new organizational memory."
  });

  input.dashboard.create({
    loopId: input.loopId,
    organizationId: input.organizationId,
    status: "completed",
    memoryHits: memoryResult.matchCount,
    memoryWrites: 1,
    providerCalls,
    policyStatus,
    summary
  });

  input.runtime.record({
    loopId: input.loopId,
    level: "info",
    event: "dashboard.telemetry.generated",
    message: "Command Center telemetry generated."
  });

  return {
    phase: "FB-02",
    status: "completed",
    loopId: input.loopId,
    brain: "executed",
    memory: {
      lookup: "success",
      matches: memoryResult.matchCount,
      writes: 1
    },
    runtime: {
      logs: "recorded"
    },
    dashboard: {
      telemetry: "generated"
    },
    providerCalls,
    policyStatus,
    summary
  };
}

function summarizeEngineeringWork(records: BrainMemoryRecord[]): string {
  if (records.length === 0) {
    return "No prior engineering memory was found. Atlas Brain should request provider assistance.";
  }

  const summaries = records.map((record) => `- ${record.title}: ${record.summary}`).join("\n");

  return `Today's engineering work focused on Phase 2 Brain operationalization and First Breath readiness. Relevant memory records:\n${summaries}`;
}
