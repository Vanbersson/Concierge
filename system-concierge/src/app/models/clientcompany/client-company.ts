import { IClientCompany } from "../../interfaces/clientcompany/iclient-company";

export class ClientCompany implements IClientCompany {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = '';
    name: string = '';
    fantasia: string = '';
    clifor: string = '';
    fisjur: string = '';
    cnpj: string = '';
    cpf: string = '';
    rg: string = '';
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

}