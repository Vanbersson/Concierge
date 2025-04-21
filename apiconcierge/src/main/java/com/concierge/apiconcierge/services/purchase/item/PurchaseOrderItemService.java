package com.concierge.apiconcierge.services.purchase.item;

import com.concierge.apiconcierge.exceptions.purchase.PurchaseOrderException;
import com.concierge.apiconcierge.models.purchase.PurchaseOrderItem;
import com.concierge.apiconcierge.repositories.purchase.IPurchaseOrderItemRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.purchase.item.IPurchaseOrderItemValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderItemService implements IPurchaseOrderItemService {

    @Autowired
    IPurchaseOrderItemRepository repository;

    @Autowired
    IPurchaseOrderItemValidation validation;

    @SneakyThrows
    @Override
    public String save(PurchaseOrderItem item) {
        try {
            String message = this.validation.save(item);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                item.setId(null);
                this.repository.save(item);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new PurchaseOrderException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(PurchaseOrderItem item) {
        try {
            String message = this.validation.update(item);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(item);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new PurchaseOrderException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String delete(PurchaseOrderItem item){
        try {
            String message = this.validation.delete(item);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.delete(item);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new PurchaseOrderException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<PurchaseOrderItem> filterId(Integer companyId, Integer resaleId, Integer purchaseId) {
        try {
            String message = this.validation.filterId(companyId, resaleId, purchaseId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                return this.repository.filterPurchaseOrderId(companyId, resaleId, purchaseId);
            } else {
                throw new PurchaseOrderException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }
}
