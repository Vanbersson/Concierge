package com.concierge.apiconcierge.services.purchase.item;

import com.concierge.apiconcierge.models.purchase.PurchaseOrderItem;

import java.util.List;

public interface IPurchaseOrderItemService {
    public String save(PurchaseOrderItem item);

    public String update(PurchaseOrderItem item);
    public String delete(PurchaseOrderItem item);

    public List<PurchaseOrderItem> filterId(Integer companyId, Integer resaleId, Integer purchaseId);
}
