import { StatusEnum } from "../enum/status-enum";

export class Brand {
    id: number = 0;
    status: StatusEnum = StatusEnum.DISABLED;
    name: string = '';
}