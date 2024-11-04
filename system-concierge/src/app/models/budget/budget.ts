import { IBudget } from "../../interfaces/budget/ibudget";

export class Budget implements IBudget {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    vehicleEntryId: number = 0;
    status: string = "";
    dateGeneration: Date | string = "";
    dateValidation: Date | string = "";
    dateAuthorization: Date | string = "";
    nameResponsible: string = "";
    typePayment: string = "";
    idUserAttendant: number = 0;
    clientCompanyId: number = 0;
    information: string = "";

}