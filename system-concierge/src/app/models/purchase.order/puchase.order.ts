export class PurchaseOrder {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = '';
    dateGeneration: Date | string = '';
    dateDelivery: Date | string = '';
    responsibleId: number = 0;
    responsibleName: string = '';
    clientCompanyId: number = 0;
    clientCompanyName: string = '';
    attendantName: string = '';
    attendantEmail: string = '';
    attendantDddCellphone: string = '';
    attendantCellphone: string = '';
    attendantDddPhone: string = '';
    attendantPhone: string = '';
    paymentType: string = '';
    nfNum: number = 0;
    nfSerie: string = '';
    nfDate: Date | string = '';
    nfKey: string = '';
}