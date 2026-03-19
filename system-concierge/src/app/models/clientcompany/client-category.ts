import { StatusEnum } from "../enum/status-enum";

export class ClientCategory {
    companyId: number | null = null;
    resaleId: number | null = null;
    id: number | null = null;
    status: StatusEnum = StatusEnum.DISABLED;
    description: string = '';
}