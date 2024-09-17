import { IVehicleEntry } from "../../interfaces/vehicle/ivehicle-entry";


export class VehicleEntry implements IVehicleEntry {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = '';
    stepEntry: string = '';
    budgetId: number | null = null;
    budgetStatus: string = '';

    idUserEntry: number = 0;
    nameUserEntry: string = '';
    dateEntry: Date | null = null;
    datePrevisionExit: Date | null = null;

    idUserAttendant: number | null = null;
    nameUserAttendant: string = '';

    idUserExitAuth1: number = 0;
    nameUserExitAuth1: string = '';
    dateExitAuth1: Date | null = null;

    idUserExitAuth2: number = 0;
    nameUserExitAuth2: string = '';
    dateExitAuth2: Date | null = null;

    statusAuthExit: string = '';

    modelId: number = 0;
    modelDescription: string = '';

    clientCompanyId: number = 0;
    clientCompanyName: string = '';
    clientCompanyCnpj: string = '';
    clientCompanyCpf: string = '';
    clientCompanyRg: string = '';

    driverEntryName: string = '';
    driverEntryCpf: string = '';
    driverEntryRg: string = '';
    driverEntryPhoto: string | null = null;
    driverEntrySignature: string | null = null;
    driverEntryPhotoDoc1: string | null = null;
    driverEntryPhotoDoc2: string | null = null;

    driverExitName: string = '';
    driverExitCpf: string = '';
    driverExitRg: string = '';
    driverExitPhoto: string | null = null;
    driverExitSignature: string | null = null;
    driverExitPhotoDoc1: string | null = null;
    driverExitPhotoDoc2: string | null = null;

    color: string = '';
    placa: string = '';
    frota: string = '';
    vehicleNew: string = '';
    kmEntry: string = '';
    kmExit: string = '';

    photo1: string | null = null;
    photo2: string | null = null;
    photo3: string | null = null;
    photo4: string | null = null;

    quantityExtinguisher: number = 0;
    quantityTrafficCone: number = 0;
    quantityTire: number = 0;
    quantityTireComplete: number = 0;
    quantityToolBox: number = 0;
    serviceOrder: string = '';
    numServiceOrder: string = '';
    numNfe: string = '';
    numNfse: string = '';
    information: string = '';
    informationConcierge: string = '';

}