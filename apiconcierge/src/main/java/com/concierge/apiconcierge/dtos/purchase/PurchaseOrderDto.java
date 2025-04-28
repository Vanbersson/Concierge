package com.concierge.apiconcierge.dtos.purchase;

import com.concierge.apiconcierge.models.purchase.statusEnum.PurchaseOrderStatus;
import jakarta.persistence.Column;

import java.util.Date;

public record PurchaseOrderDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        PurchaseOrderStatus status,
        Date dateGeneration,
        Date dateDelivery,
        Date dateReceived,
        Integer responsibleId,
        String responsibleName,
        Integer clientCompanyId,
        String clientCompanyName,
        String attendantName,
        String attendantEmail,
        String attendantDddCellphone,
        String attendantCellphone,
        String attendantDddPhone,
        String attendantPhone,
        String paymentType,
        Integer nfNum,
        String nfSerie,
        Date nfDate,
        String nfKey,
        String information
) {
}
