package com.concierge.apiconcierge.dtos.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.CliFor;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;

public record ClientCategoryDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String description,
        CliFor type
) {
}
