import { IResale } from "../../interfaces/iresale";

export class Resale implements IResale {
    companyId: number = 0;
    id: number = 0;
    status: string = '';
    name: string = '';
    cnpj: string = '';
    email: string = '';
    cellphone: string = '';
    phone: string = '';
    zipCode: string = '';
    state: string = '';
    city: string = '';
    neighborhood: string = '';
    address: string = '';
    addressNumber: string = '';
    addressComplement: string = '';

}