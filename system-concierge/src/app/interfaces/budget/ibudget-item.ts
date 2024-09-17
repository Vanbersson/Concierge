export interface IBudgetItem{
    companyId?: number;
    resaleId?: number;
    id?: string;
    budgetId?: number;
    ordem?:number;
    code: string;
    description:string;
    quantity: number;
    discount: number;
    price: number;
}