import { StatusEnum } from "../enum/status-enum";

export class Driver {
    companyId: number = 0;
    resaleId: number = 0;
    dateRegister: Date | string = "";
    id: number = 0;
    status: StatusEnum = StatusEnum.DISABLED;
    name: string = "";
    cpf: string = "";
    rg: string = "";
    dateBirth: Date | string = "";
    maleFemale: string = "";
    cnhRegister: string = "";
    cnhCategory: string = "";
    cnhValidation: Date | string = "";
    email: string = "";
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
    photoDriverUrl: string = '';
    photoDoc1Url: string = '';
    photoDoc2Url: string = '';
}