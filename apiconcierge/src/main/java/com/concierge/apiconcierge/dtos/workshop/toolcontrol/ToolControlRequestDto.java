package com.concierge.apiconcierge.dtos.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;

import java.util.Date;

public record ToolControlRequestDto(Integer companyId,
                                    Integer resaleId,
                                    Integer id,
                                    StatusRequest status,
                                    Integer userIdReq,
                                    Date dateReq,
                                    Integer userIdDev,
                                    Date dateDev,
                                    Integer mechanicId) {
}
