package com.concierge.apiconcierge.services.purchase;

import com.concierge.apiconcierge.models.purchase.PurchaseOrder;

import java.util.List;
import java.util.Map;

public interface IPurchaseOrderService {

    public Integer save(PurchaseOrder purchase);

    public String update(PurchaseOrder purchase);

    public String close(PurchaseOrder purchase);

    public List<Map<String, Object>> filterOpen(Integer companyId, Integer resaleId);

    public Map<String, Object> filterId(Integer companyId, Integer resaleId, Integer purchaseId);
}
