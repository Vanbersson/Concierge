import { StatusEnum } from "../../models/enum/status-enum";

export interface IPartListAll {
    id: number;
    status: StatusEnum;
    code: string;
    description: string;
    brand: string;
    group: string;
    category: string;
}