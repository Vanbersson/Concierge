package com.concierge.apiconcierge.dtos.workshop.toolcontrol;

import java.util.Date;
import java.util.UUID;

public record ToolControlMatMecDto(Integer companyId,
                                   Integer resaleId,
                                   UUID id,
                                   Integer requestId,

                                   Integer deliveryUserId,
                                   String deliveryUserName,
                                   Date deliveryDate,
                                   float deliveryQuantity,
                                   String deliveryInformation,

                                   Integer returnUserId,
                                   String returnUserName,
                                   Date returnDate,
                                   float returnQuantity,
                                   String returnInformation,

                                   Integer materialId,
                                   String materialDescription,
                                   Integer materialNumberCA) {
}
