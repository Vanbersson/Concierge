export class VehicleEntry {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = '';
    stepEntry: string = '';
    budgetStatus: string = '';

    idUserEntry: number = 0;
    nameUserEntry: string = '';
    dateEntry: Date | string = '';
    entryPhoto1: string = '';
    entryPhoto2: string = '';
    entryPhoto3: string = '';
    entryPhoto4: string = '';
    datePrevisionExit: Date | string = '';
    days: number = 0;

    userIdExit: number = 0;
    userNameExit: string = '';
    dateExit: Date | string = '';
    exitPhoto1: string = '';
    exitPhoto2: string = '';
    exitPhoto3: string = '';
    exitPhoto4: string = '';
    exitInformation: string = '';

    idUserAttendant: number = 0;
    nameUserAttendant: string = '';
    photo1: string = '';
    photo2: string = '';
    photo3: string = '';
    photo4: string = '';

    idUserExitAuth1: number = 0;
    nameUserExitAuth1: string = '';
    dateExitAuth1: Date | string = '';

    idUserExitAuth2: number = 0;
    nameUserExitAuth2: string = '';
    dateExitAuth2: Date | string = '';

    statusAuthExit: string = '';

    modelId: number = 0;
    modelDescription: string = '';

    clientCompanyId: number = 0;
    clientCompanyName: string = '';
    clientCompanyCnpj: string = '';
    clientCompanyCpf: string = '';
    clientCompanyRg: string = '';

    driverEntryId: number = 0;
    driverEntryName: string = '';
    driverEntryCpf: string = '';
    driverEntryRg: string = '';
    driverEntryPhoto: string = '';
    driverEntrySignature: string = '';
    driverEntryPhotoDoc1: string = '';
    driverEntryPhotoDoc2: string = '';

    driverExitId: number = 0;
    driverExitName: string = '';
    driverExitCpf: string = '';
    driverExitRg: string = '';
    driverExitPhoto: string = '';
    driverExitSignature: string = '';
    driverExitPhotoDoc1: string = '';
    driverExitPhotoDoc2: string = '';

    color: string = '';
    placa: string = '';
    placasJunto: string = '';
    frota: string = '';
    vehicleNew: string = '';
    kmEntry: string = '';
    kmExit: string = '';

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