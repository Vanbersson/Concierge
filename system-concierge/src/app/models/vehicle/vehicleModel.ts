import { IVehicleModel } from "../../interfaces/vehicle/iVehicleModel";

export class VehicleModel implements IVehicleModel {
    companyId: number = 0;
    resaleId: number = 0;
    id?: number;
    status: string = "";
    description: string = "";
    image?: string;

}