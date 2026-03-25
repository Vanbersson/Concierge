package com.concierge.apiconcierge.services.purchase;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;

import java.util.List;
import java.util.Map;

public interface IPurchaseOrderService {

    public MessageResponse save(PurchaseOrder purchase);

    public MessageResponse update(PurchaseOrder purchase);

    public List<PurchaseOrder> filterOpen(Integer companyId, Integer resaleId);

    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer purchaseId);
}
