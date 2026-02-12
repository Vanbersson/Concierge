import { StatusAuthExit } from "../enum/status-auth-exit";
import { StatusStepVehicleEntry } from "../enum/status-step-vehicle-entry";
import { StatusVehicle } from "../enum/status-vehicle";


export class VehicleEntry {
    companyId: number | null = null;
    resaleId: number | null = null;
    id: number | null = null;
    status: StatusVehicle = StatusVehicle.ENTERED;
    stepEntry: StatusStepVehicleEntry = StatusStepVehicleEntry.ATTENDANT;
    budgetId: number | null = null;

    entryUserId: number | null = null;
    entryUserName: string = '';
    entryDate: Date | string = '';
    entryPhoto1Url: string = '';
    entryPhoto2Url: string = '';
    entryPhoto3Url: string = '';
    entryPhoto4Url: string = '';
    entryInformation: string = '';

    exitDatePrevision: Date | string = '';
    days: number = 0;

    exitUserId: number | null = null;
    exitUserName: string = '';
    exitDate: Date | string = '';
    exitPhoto1Url: string = '';
    exitPhoto2Url: string = '';
    exitPhoto3Url: string = '';
    exitPhoto4Url: string = '';
    exitInformation: string = '';

    attendantUserId: number | null = null;
    attendantUserName: string = '';
    attendantPhoto1Url: string = '';
    attendantPhoto2Url: string = '';
    attendantPhoto3Url: string = '';
    attendantPhoto4Url: string = '';

    authExitStatus: StatusAuthExit = StatusAuthExit.NOT;

    auth1ExitUserId: number | null = null;
    auth1ExitUserName: string = '';
    auth1ExitDate: Date | string = '';

    auth2ExitUserId: number | null = null;
    auth2ExitUserName: string = '';
    auth2ExitDate: Date | string = '';

    modelId: number | null= null;
    modelDescription: string = '';

    clientCompanyId: number | null = null;
    clientCompanyName: string = '';

    driverEntryId: number | null = null;
    driverEntryName: string = '';

    driverExitId: number | null = null;
    driverExitName: string = '';

    vehiclePlate: string = '';
    vehiclePlateTogether: string = '';
    vehicleFleet: string = '';
    vehicleColor: string = '';
    vehicleKmEntry: string = '';
    vehicleKmExit: string = '';
    vehicleNew: string = '';
    vehicleServiceOrder: string = '';

    numServiceOrder: string = '';
    numNfe: string = '';
    numNfse: string = '';

    checkItem1: string = '';
    checkItem2: string = '';
    checkItem3: string = '';
    checkItem4: string = '';
    checkItem5: string = '';
    checkItem6: string = '';
    checkItem7: string = '';
    checkItem8: string = '';
    checkItem9: string = '';
    checkItem10: string = '';
    checkItem11: string = '';
    checkItem12: string = '';
    checkItem13: string = '';
    checkItem14: string = '';
    checkItem15: string = '';
    checkItem16: string = '';
    checkItem17: string = '';
    checkItem18: string = '';
    checkItem19: string = '';
    checkItem20: string = '';

}