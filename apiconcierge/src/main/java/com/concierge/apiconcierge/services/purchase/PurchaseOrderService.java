package com.concierge.apiconcierge.services.purchase;

import com.concierge.apiconcierge.exceptions.purchase.PurchaseOrderException;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.repositories.purchase.IPurchaseOrderRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.purchase.IPurchaseOrderValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PurchaseOrderService implements IPurchaseOrderService {
    @Autowired
    private IPurchaseOrderRepository repository;
    @Autowired
    private IPurchaseOrderValidation validation;

    @SneakyThrows
    @Override
    public MessageResponse save(PurchaseOrder purchase) {
        try {
            MessageResponse response = this.validation.save(purchase);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                purchase.setId(null);
                purchase.setGenerationDate(new Date());
                PurchaseOrder result = this.repository.save(purchase);
                response.setData(result);
            }
            return response;
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse update(PurchaseOrder purchase) {
        try {
            MessageResponse response = this.validation.update(purchase);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                PurchaseOrder result = this.repository.save(purchase);
                response.setData(result);
            }
            return response;
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<PurchaseOrder> filterOpen(Integer companyId, Integer resaleId) {
        try {
            MessageResponse response = this.validation.filterOpen(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                return this.repository.filterOpen(companyId, resaleId);
            }
            return List.of();
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer purchaseId) {
        try {
            MessageResponse response = this.validation.filterOpen(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                PurchaseOrder pu = this.repository.filterId(companyId, resaleId, purchaseId);
                response.setData(pu);
            }
            return response;
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }
}
