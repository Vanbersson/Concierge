

export interface IVehicleEntry {

    companyId: number;
    resaleId: number;
    id: number;
    status: string;
    stepEntry: string;
    budgetId?: number;
    budgetStatus: string;

    idUserEntry: number;
    nameUserEntry: string;
    dateEntry: string;
    datePrevisionExit: string;

    idUserAttendant?: number;
    nameUserAttendant?: string;

    idUserExitAuth1?: number;
    nameUserExitAuth1?: string;
    dateExitAuth1?: Date;

    idUserExitAuth2?: number;
    nameUserExitAuth2?: string;
    dateExitAuth2?: Date;

    statusAuthExit: string;

    modelId: number;
    modelDescription: string;

    clientCompanyId: number;
    clientCompanyName: string;
    clientCompanyCnpj?: string;
    clientCompanyCpf?: string;
    clientCompanyRg?: string;

    driverEntryName: string;
    driverEntryCpf?: string;
    driverEntryRg?: string;
    driverEntryPhoto?: string;
    driverEntrySignature?: string;
    driverEntryPhotoDoc1?: string;
    driverEntryPhotoDoc2?: string;

    driverExitName?: string;
    driverExitCpf?: string;
    driverExitRg?: string;
    driverExitPhoto?: string;
    driverExitSignature?: string;
    driverExitPhotoDoc1?: string;
    driverExitPhotoDoc2?: string;

    color: string;
    placa: string;
    frota?: string;
    vehicleNew: string;

    kmEntry?: string;
    kmExit?: string;

    photo1?: String;
    photo2?: String;
    photo3?: String;
    photo4?: String;

    quantityExtinguisher: number;
    quantityTrafficCone: number;
    quantityTire: number;
    quantityTireComplete: number;
    quantityToolBox: number;

    serviceOrder: String;

    numServiceOrder?: String;
    numNfe?: String;
    numNfse?: String;
    information?: String;
    informationConcierge?: String;





}
