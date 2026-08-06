import type { L10n } from "@/lib/types";

/**
 * Budget lines OKR key results tag into — the board budget's headline rows
 * (P&L + cash) and the Notion "2026 Objectives" annual targets.
 * annualTarget is the 2026 budget figure, shown as context next to a KR.
 */
export interface BudgetLine {
  id: string;
  label: L10n;
  /** 2026 budget target, displayed as-is. */
  annualTarget: string;
}

export const BUDGET_LINES: BudgetLine[] = [
  { id: "billing", label: { en: "Billing", fr: "Billing (CA facturé)" }, annualTarget: "18 M€" },
  { id: "booking", label: { en: "Booking", fr: "Booking (CA signé)" }, annualTarget: "30 M€" },
  { id: "sourcing", label: { en: "Sourcing (SG5)", fr: "Sourcing (SG5)" }, annualTarget: "50 M€" },
  { id: "gross-margin", label: { en: "Gross margin", fr: "Marge brute" }, annualTarget: "5,6 M€" },
  { id: "ebitda", label: { en: "EBITDA", fr: "EBITDA" }, annualTarget: "≥ −1,6 M€" },
  { id: "cash", label: { en: "Cash burn", fr: "Cash burn" }, annualTarget: "≤ 1,7 M€" },
  { id: "payroll", label: { en: "Payroll", fr: "Masse salariale" }, annualTarget: "≤ 5,0 M€" },
];

export const BUDGET_MAP: Record<string, BudgetLine> = Object.fromEntries(
  BUDGET_LINES.map((b) => [b.id, b])
);
