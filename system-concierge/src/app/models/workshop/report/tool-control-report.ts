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
            matMecQuantityReq: number;
            matMecQuantityRet: number;
            matMecUserRet: number;
            matMecDateRet: string;
            matMecInformationRet:string;
            matMecMaterialId: number;
            materialDesc: string;
            materialPhoto: string;
        }
    ];

}