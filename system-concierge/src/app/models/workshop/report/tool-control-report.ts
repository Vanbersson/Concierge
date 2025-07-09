export class ToolControlReport {
    companyId: number = 0;
    resaleId: number = 0;
    mecId: number = 0;
    mecName: string = "";
    mecPhoto: string = "";

    materials: [
        {
            requestId: number;
            requestDateReq: string;
            matMecId: string;
            categoryId: number;
            categoryDesc: string;
            materialId: number;
            materialDesc: string;
            materialPhoto: string;
            materialQuantReq: number;
            materialInfReq: string;
        }
    ]


}