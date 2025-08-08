import { Mechanic } from "../mechanic/Mechanic";
import { ToolControlMatMec } from "../toolcontrol/tool-control-matmec";
import { ToolControlRequest } from "../toolcontrol/tool-control-request";

export class ToolControlReport {

    companyId: number = 0;
    resaleId: number = 0;
    mecId: number = 0;
    mechanic: Mechanic;
    materials: [
        {
            requestStatus: string;
            requestTypeMaterial: string;
            requestUserId: number;
            requestId: number;
            requestInformation: string;
            requestDate: string;
            categoryId: number;
            categoryDesc: string;
            matMecId: string;
            matMecDelivUserId: number;
            matMecDelivUserName: string;
            matMecDelivQuantity: number;
            matMecDelivDate: string;
            matMecReturUserId: number;
            matMecReturUserName: string;
            matMecReturQuantity: number;
            matMecReturDate: string;
            matMecMaterialId: number;
            matMecMaterialDesc: string;
        }
    ];
}