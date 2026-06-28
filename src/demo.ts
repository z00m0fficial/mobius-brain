import { createEnterpriseAlphaPlan, markStepComplete } from "./orchestrator.js";

let plan = createEnterpriseAlphaPlan({
  objective: "Complete the first Enterprise Alpha Intelligence Loop.",
  organizationId: "mobius-technologies",
  correlationId: "corr-demo"
});

plan = markStepComplete(plan, "RequestReceived");
plan = markStepComplete(plan, "IntentClassified");
plan = markStepComplete(plan, "RouteSelected");
plan = markStepComplete(plan, "ProviderExecuted");

console.log(JSON.stringify(plan, null, 2));
