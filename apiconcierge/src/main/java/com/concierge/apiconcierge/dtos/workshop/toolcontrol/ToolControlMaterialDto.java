package com.concierge.apiconcierge.dtos.workshop.toolcontrol;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeRequest;

public record ToolControlMaterialDto(Integer companyId,
                                     Integer resaleId,
                                     Integer id,
                                     StatusEnableDisable status,
                                     TypeRequest type,
                                     Integer numberCA,
                                     String description,
                                     Integer categoryId,
                                     float quantityAccountingLoan,
                                     float quantityAvailableLoan,
                                     float quantityAccountingKit,
                                     float quantityAvailableKit,
                                     Integer validityDay,
                                     byte[] photo) {
}
