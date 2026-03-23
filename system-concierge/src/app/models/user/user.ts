import { StatusEnum } from "../enum/status-enum";
import { RoleFuncEnum } from "./role.func.enum";

export class User {
    companyId: number | null = null;
    resaleId: number | null = null;
    id: number | null = null;
    status: StatusEnum = StatusEnum.DISABLED;
    name: string = '';
    password: string = '';
    email: string = '';
    cellphone: string = '';
    limitDiscount: number = 0;
    photoUrl: string = '';
    roleId: number | null = null;
    roleDesc: string = '';
    roleFunc: RoleFuncEnum = RoleFuncEnum.USER;
    token: string = '';
}