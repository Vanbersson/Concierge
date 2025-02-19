import { IModelVehicle } from "../../interfaces/vehicle-model/imodel-vehicle";

export class ModelVehicle implements IModelVehicle {
    companyId: number = 0;
    resaleId: number = 0;
    id: number = 0;
    status: string = '';
    description: string = '';
    photo?: string = '';

}