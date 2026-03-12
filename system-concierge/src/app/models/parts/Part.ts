export class Part {
    companyId: number | null = null;
    resaleId: number | null = null;
    id: number | null = null;
    status: string = "";
    code: string = "";
    description: string = "";
    qtdAvailable: number = 0.0;
    qtdAccounting: number = 0.0;
    unitMeasure: string = "";
    price: number = 0.0;
    discount: number = 0.0;
    locationStreet: string = "";
    locationBookcase: string = "";
    locationShelf: string = "";
    dateLastEntry: Date | string = "";
}