import { IVehicleEntry } from "../../interfaces/vehicle/iVehicleEntry";

export class VehicleEntry{
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = "";
    stepEntry: string = "";
    budgetId?: number | undefined;
    budgetStatus: string = "";
    idUserEntry: number = 0;
    nameUserEntry: string = "";
    dateEntry: string = "";
    datePrevisionExit: string = "";

    idUserAttendant?: number | undefined;
    nameUserAttendant?: string | undefined;

    idUserExitAuth1?: number | undefined;
    nameUserExitAuth1?: string | undefined;
    dateExitAuth1?: Date | undefined;
    idUserExitAuth2?: number | undefined;
    nameUserExitAuth2?: string | undefined;
    dateExitAuth2?: Date | undefined;

    statusAuthExit: string = "";

    modelId: number = 0;
    modelDescription: string = "";
    clientCompanyId: number = 0;
    clientCompanyName: string = "";
    clientCompanyCnpj?: string | undefined;
    clientCompanyCpf?: string | undefined;
    clientCompanyRg?: string | undefined;
    driverEntryName: string = "";
    driverEntryCpf?: string | undefined;
    driverEntryRg?: string | undefined;
    driverEntryPhoto?: string | undefined;
    driverEntrySignature?: string | undefined;
    driverEntryPhotoDoc1?: string | undefined;
    driverEntryPhotoDoc2?: string | undefined;
    driverExitName?: string | undefined;
    driverExitCpf?: string | undefined;
    driverExitRg?: string | undefined;
    driverExitPhoto?: string | undefined;
    driverExitSignature?: string | undefined;
    driverExitPhotoDoc1?: string | undefined;
    driverExitPhotoDoc2?: string | undefined;
    placa: string = "";
    frota?: string = "";
    vehicleNew: string = "";
    kmEntry?: string | undefined;
    kmExit?: string | undefined;
    photo1?: string | undefined;
    photo2?: string | undefined;
    photo3?: string | undefined;
    photo4?: string | undefined;
    quantityExtinguisher: number = 0;
    quantityTrafficCone: number = 0;
    quantityTire: number = 0;
    quantityTireComplete: number = 0;
    quantityToolBox: number = 0;
    serviceOrder: string = "";
    numServiceOrder?: string | undefined;
    numNfe?: string | undefined;
    numNfse?: string | undefined;
    information?: string | undefined;
    informationConcierge?: string | undefined;

}