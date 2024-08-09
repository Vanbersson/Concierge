export interface IClientCompany {
    cliente: number;
    fantasia: string;
    nome: string;
    
    fisjur?: string;
    clifor?: string;

    dddTelefone?: string;
    telefone?: string;

    dddCelular?: string;
    celular?: string;

    emailCasa?: string;
    emailTrabalho?: string;

    cnpj?: string;
    cpf?: string;
    identidade?: string;

    cepEntrega?: string;
    logradouroEntrega?: string;
    complementoEntrega?: string;
    bairroEntrega?: string;
    municipioEntrega?: string
    ufEntrega?: string;
}
