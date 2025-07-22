package com.concierge.apiconcierge.dtos.workshop.toolcontrol;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeCategory;
import jakarta.persistence.Column;

public record ToolControlCategoryDto(Integer companyId,
                                     Integer resaleId,

                                     Integer id,

                                     StatusEnableDisable status,
                                     TypeCategory type,
                                     Integer quantityReq,
                                     String description) {
}
