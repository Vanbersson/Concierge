package com.concierge.apiconcierge.repositories.purchase;

import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.models.purchase.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IPurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, UUID> {

    @Query(value = "SELECT * FROM `tb_purchase_order_item` WHERE company_id=?1 AND resale_id=?2 AND purchase_id=?3", nativeQuery = true)
    public List<PurchaseOrderItem> filterPurchaseOrderId(Integer companyId, Integer resaleId,Integer purchaseId);
}
