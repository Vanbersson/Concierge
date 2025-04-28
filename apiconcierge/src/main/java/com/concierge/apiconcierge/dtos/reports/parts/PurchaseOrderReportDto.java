package com.concierge.apiconcierge.dtos.reports.parts;

import com.concierge.apiconcierge.models.purchase.statusEnum.PurchaseOrderStatus;

import java.util.Date;

public record PurchaseOrderReportDto(Integer companyId,
                                     Integer resaleId,
                                     Integer id,
                                     String status,
                                     String statusDelivery,
                                     Date dateInit,
                                     Date dateFinal,
                                     Integer responsibleId,
                                     String responsibleName,
                                     Integer clientCompanyId,
                                     String clientCompanyName,
                                     Integer nfNum) {
}
