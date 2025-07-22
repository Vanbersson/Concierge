package com.concierge.apiconcierge.dtos.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeMaterial;

import java.util.Date;

public record ToolControlRequestDto(Integer companyId,
                                    Integer resaleId,
                                    Integer id,
                                    StatusRequest status,
                                        TypeMaterial typeMaterial,
                                    Integer userIdReq,
                                    Date dateReq,
                                    String informationReq,
                                    Integer mechanicId) {
}
