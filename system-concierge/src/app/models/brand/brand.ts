import { StatusEnum } from "../enum/status-enum";

export class Brand {
    id: number | null= null;
    status: StatusEnum = StatusEnum.DISABLED;
    name: string = '';
}