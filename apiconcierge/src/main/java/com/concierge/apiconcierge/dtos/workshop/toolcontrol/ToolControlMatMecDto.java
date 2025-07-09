package com.concierge.apiconcierge.dtos.workshop.toolcontrol;

import java.util.Date;
import java.util.UUID;

public record ToolControlMatMecDto(Integer companyId,
                                   Integer resaleId,
                                   UUID id,
                                   Integer requestId,
                                   float quantityReq,
                                   String informationReq,
                                   float quantityDev,
                                   String informationDev,
                                   Integer materialId) {
}
