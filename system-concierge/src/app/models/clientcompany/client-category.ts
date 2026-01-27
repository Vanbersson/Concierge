import { StatusEnum } from "../enum/status-enum";

export class ClientCategory {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: StatusEnum = StatusEnum.DISABLED;
    description: string = '';
}