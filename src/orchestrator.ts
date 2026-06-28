export type BrainStepStatus = "pending" | "ready" | "complete" | "blocked";

export interface BrainStep {
  key: string;
  owner: string;
  inputEvent: string;
  outputEvent: string;
  status: BrainStepStatus;
}

export interface BrainPlan {
  id: string;
  objective: string;
  organizationId: string;
  correlationId: string;
  steps: BrainStep[];
}

export function createEnterpriseAlphaPlan(input: {
  objective: string;
  organizationId: string;
  correlationId: string;
}): BrainPlan {
  return {
    id: "brain-plan-" + Date.now(),
    objective: input.objective,
    organizationId: input.organizationId,
    correlationId: input.correlationId,
    steps: [
      { key: "request", owner: "mobius-api", inputEvent: "FounderInput", outputEvent: "RequestReceived", status: "ready" },
      { key: "intent", owner: "atlas-core", inputEvent: "RequestReceived", outputEvent: "IntentClassified", status: "pending" },
      { key: "memory", owner: "mobius-memory", inputEvent: "IntentClassified", outputEvent: "MemoryLookupCompleted", status: "pending" },
      { key: "route", owner: "mobius-router", inputEvent: "MemoryLookupCompleted", outputEvent: "RouteSelected", status: "pending" },
      { key: "execute", owner: "mobius-provider-engine", inputEvent: "RouteSelected", outputEvent: "ProviderExecuted", status: "pending" },
      { key: "measure", owner: "mobius-pulse", inputEvent: "ProviderExecuted", outputEvent: "PulseMetricRecorded", status: "pending" },
      { key: "remember", owner: "mobius-memory", inputEvent: "ProviderExecuted", outputEvent: "MemoryEventCreated", status: "pending" },
      { key: "audit", owner: "mobius-mcms", inputEvent: "MemoryEventCreated", outputEvent: "McmsAuditRecorded", status: "pending" },
      { key: "display", owner: "mobius-command-center", inputEvent: "McmsAuditRecorded", outputEvent: "DashboardRefreshRequested", status: "pending" }
    ]
  };
}

export function markStepComplete(plan: BrainPlan, outputEvent: string): BrainPlan {
  return {
    ...plan,
    steps: plan.steps.map((step) =>
      step.outputEvent === outputEvent ? { ...step, status: "complete" } : step
    )
  };
}

export function getNextReadyStep(plan: BrainPlan): BrainStep | undefined {
  return plan.steps.find((step) => step.status === "ready" || step.status === "pending");
}
