export interface IBudget {
    companyId: number;
    resaleId: number;
    id: number;
    vehicleEntryId: number;
    status: string;
    dateGeneration: Date | string;
    dateValidation: Date | string;
    dateAuthorization: Date | string;
    nameResponsible: string;
    typePayment: string;
    idUserAttendant: number;
    clientCompanyId: number;
    information: string;
}