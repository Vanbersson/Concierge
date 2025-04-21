package com.concierge.apiconcierge.dtos.purchase;

import jakarta.persistence.*;

import java.util.UUID;

public record PurchaseOrderItemDto(
        Integer companyId,
        Integer resaleId,
        UUID id,
        Integer purchaseId,
        Integer partId,
        String partCode,
        String partDescription,
        float quantity,
        float discount,
        float price
) {
}
