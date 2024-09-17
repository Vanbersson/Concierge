import { IBudgetService } from "../../interfaces/budget/ibudget-service";

export class BudgetServiceItem implements IBudgetService {
    companyId: number = 0;
    resaleId: number = 0;
    id: string = '';
    budgetId: number = 0;
    status: string = '';
    ordem: number = 0;
    description: string = '';
    hourService: number = 0.0;
    price: number = 0.0;
    discount: number = 0.0;

}