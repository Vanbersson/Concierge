package com.concierge.apiconcierge.dtos.payment;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;

public record TypePaymentDto(Integer companyId,
                             Integer resaleId,
                             Integer id,
                             StatusEnableDisable status,
                             String description) {
}
