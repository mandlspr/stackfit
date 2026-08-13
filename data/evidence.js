window.STACKFIT_EVIDENCE = [
  { title: "METR task-completion time horizons", source: "METR", date: "2025-03-19", checked: "2026-08-13", family: "volatile", supports: "Autonomy and long-horizon requirements are task-specific; benchmark results are partial evidence." },
  { title: "AI Risk Management Framework", source: "NIST AI RMF 1.0", date: "2023-01-26", checked: "2026-08-13", family: "stable", supports: "Risk management should cover validity, safety, security, transparency, privacy and fairness." },
  { title: "General Data Protection Regulation", source: "European Union", date: "2016-04-27", checked: "2026-08-13", family: "stable", legal: true, legalStatus: "in_force", amendmentsVerified: true, supports: "Personal-data processing requires an appropriate legal basis and safeguards." },
  { title: "Artificial Intelligence Act", source: "European Union", date: "2024-07-12", checked: "2026-08-13", family: "stable", legal: true, legalStatus: "in_force", amendmentsVerified: true, supports: "Some AI uses carry specific prohibitions or risk-management obligations." }
];

window.STACKFIT_EVIDENCE_FRESHNESS = function (item, checkedOn = "2026-08-13") {
  const yearsSinceCheck = (new Date(checkedOn) - new Date(item.checked)) / 31557600000;
  if (item.legal) {
    if (["superseded", "replaced"].includes(item.legalStatus) || item.legalStatus !== "in_force") return "Stale";
    if (!item.amendmentsVerified || yearsSinceCheck > 1) return yearsSinceCheck <= 2 ? "Aging" : "Stale";
    return "Current";
  }
  const yearsSincePublication = (new Date(checkedOn) - new Date(item.date)) / 31557600000;
  if (item.family === "volatile") return yearsSincePublication <= 1 ? "Current" : yearsSincePublication <= 2 ? "Aging" : "Stale";
  return yearsSincePublication <= 3 ? "Current" : yearsSincePublication <= 7 ? "Aging" : "Stale";
};
