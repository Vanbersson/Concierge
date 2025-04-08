import { IBudgetItem } from "../../interfaces/budget/ibudget-item";

export class BudgetItem implements IBudgetItem{
    companyId: number = 0;
    resaleId: number = 0;
    id: string = '';
    status: string = '';
    budgetId: number = 0;
    ordem: number = 0;
    partId: number = 0;
    code: string = '';
    description: string = '';
    quantity: number = 0.0;
    discount: number = 0.0;
    price: number = 0.0;   
}