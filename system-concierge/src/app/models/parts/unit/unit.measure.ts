import { StatusEnum } from "../../enum/status-enum";

export class UnitMeasure {
    id: number | null = null;
    status: StatusEnum = StatusEnum.DISABLED;
    unitMeasure: string = "";
    description: string = "";
}