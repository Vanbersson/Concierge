import { IUser } from "../../interfaces/user/iuser";


export class User implements IUser {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = '';
    name: string = '';
    password: string = '';
    email: string = '';
    cellphone: string = '';
    limitDiscount: number = 0;
    photo: string = '';
    roleId: number = 0;
    roleDesc: string = '';
    roleFunc: string = '';

}