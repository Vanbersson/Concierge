import { StatusEnum } from "../enum/status-enum";
import { AdditionDiscount } from "./enums/addition.discount";

export class Part {
    companyId: number | null = null;
    resaleId: number | null = null;
    id: number | null = null;
    status: StatusEnum = StatusEnum.ENABLED;
    dateRegister: Date | string = "";
    code: string = "";
    description: string = "";
    unitMeasureId: number | null = null;
    priceNow: number = 0.0;
    priceOld: number = 0.0;
    priceWarranty: number = 0.0;
    additionDiscount: AdditionDiscount = AdditionDiscount.NENHUM;
    brandId: number | null = null;
    groupId: number | null = null;
    categoryId: number | null = null;
    locationPriArea: string = "";
    locationPriStreet: string = "";
    locationPriBookcase: string = "";
    locationPriShelf: string = "";
    locationPriPosition: string = "";
    locationSecArea: string = "";
    locationSecStreet: string = "";
    locationSecBookcase: string = "";
    locationSecShelf: string = "";
    locationSecPosition: string = "";
    photoUrlFront: string = "";
    photoUrlVerse: string = "";
}