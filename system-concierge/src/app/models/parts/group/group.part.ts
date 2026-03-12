import { StatusEnum } from "../../enum/status-enum";
import { TypeGroupPart } from "../enums/type.group.part";

export class GroupPart {
    companyId: number | null = null;
    resaleId: number | null = null;
    id: number | null = null;
    status: StatusEnum = StatusEnum.DISABLED;
    type: TypeGroupPart = TypeGroupPart.OUTROS;
    description: string = "";
    brandId: number | null = null;
}