import { ToolControlMatMec } from "./tool-control-matmec";

export class ToolControlRequest {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = "";
    requestType: string = "";
    requestDate: string = "";
    requestInformation: string = "";
    requestUserId: number = 0;
    requestUserName: string = "";
    categoryType: string = "";
    mechanicId: number = 0;
}