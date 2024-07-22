export interface ConditionElement {
  conditionText: string | null;
  getConditionContent: (tabAmount: number) => string;
}
