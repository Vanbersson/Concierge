import { IUserRole } from "../../interfaces/user-role/iuser-role";
import { StatusEnum } from "../enum/status-enum";


export class UserRole implements IUserRole {
    companyId: number | null = null;
    resaleId: number | null = null;
    id: number | null = null;
    status: StatusEnum = StatusEnum.DISABLED;
    description: string = '';

}