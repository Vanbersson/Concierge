import { StatusEnum } from "../enum/status-enum";
import { CliForEnum } from "./clifor-enum";
import { FisJurEnum } from "./fisjur-enum";

export class ClientCompany {
    companyId: number = 0;
    resaleId: number = 0;
    dateRegister: Date | string = '';
    id: number = 0;
    status: StatusEnum = StatusEnum.DISABLED;
    name: string = '';
    fantasia: string = '';
    categoryId: number = 0;
    clifor: CliForEnum = CliForEnum.AMBOS;
    fisjur: FisJurEnum = FisJurEnum.OUTRAS;
    cnpj: string = '';
    ie: string = '';
    im: string = '';
    cpf: string = '';
    rg: string = '';
    rgExpedidor: string = '';
    dateBirth: string = '';
    emailHome: string = '';
    emailWork: string = '';
    dddCellphone: string = '';
    cellphone: string = '';
    dddPhone: string = '';
    phone: string = '';
    zipCode: string = '';
    state: string = '';
    city: string = '';
    neighborhood: string = '';
    address: string = '';
    addressNumber: string = '';
    addressComplement: string = '';
    contactName: string = '';
    contactEmail: string = '';
    contactDDDPhone: string = '';
    contactPhone: string = '';
    contactDDDCellphone: string = '';
    contactCellphone: string = '';

}