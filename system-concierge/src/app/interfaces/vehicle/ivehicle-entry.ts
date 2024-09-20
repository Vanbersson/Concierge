export interface IVehicleEntry {

    companyId: number;
    resaleId: number;
    id: number;
    status: string;
    stepEntry: string;
    budgetId: number | null;
    budgetStatus: string;
    idUserEntry: number;
    nameUserEntry: string;
    dateEntry: Date | string;
    datePrevisionExit: Date | null;

    idUserAttendant: number | null;
    nameUserAttendant: string;

    idUserExitAuth1: number | null;
    nameUserExitAuth1: string;
    dateExitAuth1: Date | null;

    idUserExitAuth2: number;
    nameUserExitAuth2: string;
    dateExitAuth2: Date | null;

    statusAuthExit: string;
    modelId: number;
    modelDescription: string;

    clientCompanyId: number;
    clientCompanyName: string;
    clientCompanyCnpj: string;
    clientCompanyCpf: string;
    clientCompanyRg: string;
    driverEntryName: string;
    driverEntryCpf: string;
    driverEntryRg: string;
    driverEntryPhoto: string | null;
    driverEntrySignature: string | null;
    driverEntryPhotoDoc1: string | null;
    driverEntryPhotoDoc2: string | null;

    driverExitName: string;
    driverExitCpf: string;
    driverExitRg: string;
    driverExitPhoto: string | null;
    driverExitSignature: string | null;
    driverExitPhotoDoc1: string | null;
    driverExitPhotoDoc2: string | null;

    color: string;
    placa: string;
    frota: string;
    vehicleNew: string;
    kmEntry: string;
    kmExit: string;
    photo1: string | null;
    photo2: string | null;
    photo3: string | null;
    photo4: string | null;
    quantityExtinguisher: number;
    quantityTrafficCone: number;
    quantityTire: number;
    quantityTireComplete: number;
    quantityToolBox: number;
    serviceOrder: string;
    numServiceOrder: string;
    numNfe: string;
    numNfse: string;
    information: string;
    informationConcierge: string;





}
