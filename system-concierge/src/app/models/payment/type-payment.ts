import { StatusEnum } from "../enum/status-enum";

export class TypePayment {
    companyId: number | null= null;
    resaleId: number | null= null;
    id: number | null= null;
    status:  StatusEnum = StatusEnum.DISABLED;
    description: string = '';
}