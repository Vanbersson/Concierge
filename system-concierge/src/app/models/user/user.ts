import { StatusEnum } from "../enum/status-enum";

export class User {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: StatusEnum = StatusEnum.DISABLED;
    name: string = '';
    password: string = '';
    email: string = '';
    cellphone: string = '';
    limitDiscount: number = 0;
    photoUrl: string = '';
    roleId: number = 0;
    roleDesc: string = '';
    roleFunc: string = '';
    token: string = '';
}