import { IResale } from "../../interfaces/iresale";
import { StatusEnum } from "../enum/status-enum";

export class Resale implements IResale {
    companyId: number | null = null;
    id: number | null = null;
    status: StatusEnum = StatusEnum.DISABLED;
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