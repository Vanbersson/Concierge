import { IUserRole } from "../../interfaces/user-role/iuser-role";


export class UserRole implements IUserRole{
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = '';
    description: string = '';
    
}