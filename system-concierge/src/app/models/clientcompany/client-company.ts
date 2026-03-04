import { StatusEnum } from "../enum/status-enum";
import { CliForEnum } from "./clifor-enum";
import { FisJurEnum } from "./fisjur-enum";

export class ClientCompany {
    companyId: number | null = null;
    resaleId: number | null = null;
    dateRegister: Date | string = '';
    id: number | null = null;
    status: StatusEnum = StatusEnum.DISABLED;
    name: string = '';
    fantasia: string = '';
    categoryId: number | null = null;
    clifor: CliForEnum = CliForEnum.AMBOS;
    fisjur: FisJurEnum = FisJurEnum.OUTRAS;
    cnpj: string = '';
    ie: string = '';
    im: string = '';
    cpf: string = '';
    rg: string = '';
    rgExpedidor: string = '';
    dateBirth: Date | string = '';
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