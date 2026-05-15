package com.concierge.apiconcierge.dtos.purchase;


import com.concierge.apiconcierge.models.purchase.item.PurchaseOrderItemId;

import java.math.BigDecimal;

public record PurchaseOrderItemDto(
        PurchaseOrderItemId id,
        String itemCode,
        String itemDescription,
        BigDecimal quantity,
        BigDecimal discount,
        BigDecimal price
) {
}
