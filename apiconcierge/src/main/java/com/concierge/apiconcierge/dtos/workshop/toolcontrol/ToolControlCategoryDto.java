package com.concierge.apiconcierge.dtos.workshop.toolcontrol;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;

public record ToolControlCategoryDto(Integer companyId,
                                     Integer resaleId,

                                     Integer id,

                                     StatusEnableDisable status,

                                     String description) {
}
