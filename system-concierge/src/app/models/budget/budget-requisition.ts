import { IBudgetRequisition } from "../../interfaces/budget/ibudget-requisition";

export class BudgetRequisition implements IBudgetRequisition {
    companyId: number = 0;
    resaleId: number = 0;
    id: string = '';
    budgetId: number = 0;
    ordem: number = 0;
    description: string = '';

}