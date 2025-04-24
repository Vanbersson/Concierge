package com.concierge.apiconcierge.services.purchase;

import com.concierge.apiconcierge.exceptions.purchase.PurchaseOrderException;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.repositories.purchase.IPurchaseOrderRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.purchase.PurchaseOrderValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.time.Year;
import java.util.*;

@Service
public class PurchaseOrderService implements IPurchaseOrderService {

    @Autowired
    IPurchaseOrderRepository repository;

    @Autowired
    PurchaseOrderValidation validation;

    @SneakyThrows
    @Override
    public Integer save(PurchaseOrder purchase) {
        try {
            String message = this.validation.save(purchase);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                purchase.setId(null);
                PurchaseOrder result = this.repository.save(purchase);
                return result.getId();
            } else {
                throw new RuntimeException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(PurchaseOrder purchase) {
        try {
            String message = this.validation.save(purchase);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(purchase);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new RuntimeException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    public String close(PurchaseOrder purchase){
        return "";
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> filterOpen(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.filterOpen(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                List<PurchaseOrder> purchases = this.repository.filterOpen(companyId, resaleId);
                List<Map<String, Object>> maps = new ArrayList<>();

                for (var item : purchases) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("companyId", item.getCompanyId());
                    map.put("resaleId", item.getResaleId());
                    map.put("id", item.getId());
                    map.put("clientCompanyId", item.getCompanyId());
                    map.put("clientCompanyName", item.getClientCompanyName());

                    if (!item.getAttendantName().isBlank()) {
                        map.put("attendantName", item.getAttendantName());
                    } else {
                        map.put("attendantName", "");
                    }
                    map.put("dateGeneration", item.getDateGeneration());
                    map.put("dateDelivery", item.getDateDelivery());
                    map.put("responsibleName", item.getResponsibleName());
                    map.put("nfNum", item.getNfNum());

                    maps.add(map);
                }
                return maps;
            } else {
                throw new RuntimeException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterId(Integer companyId, Integer resaleId, Integer purchaseId) {
        try {

            String message = this.validation.filterOpen(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                PurchaseOrder pu = this.repository.filterId(companyId, resaleId, purchaseId);

                Map<String, Object> map = new HashMap<>();
                map.put("companyId", pu.getCompanyId());
                map.put("resaleId", pu.getResaleId());
                map.put("id", pu.getId());
                map.put("status", pu.getStatus());
                map.put("dateGeneration", pu.getDateGeneration());
                map.put("dateDelivery", pu.getDateDelivery());
                map.put("responsibleId", pu.getResponsibleId());
                map.put("responsibleName", pu.getResponsibleName());
                map.put("clientCompanyId", pu.getClientCompanyId());
                map.put("clientCompanyName", pu.getClientCompanyName());
                map.put("attendantName", pu.getAttendantName());
                map.put("attendantEmail", pu.getAttendantEmail());
                map.put("attendantDddCellphone", pu.getAttendantDddCellphone());
                map.put("attendantCellphone", pu.getAttendantCellphone());
                map.put("attendantDddPhone", pu.getAttendantDddPhone());
                map.put("attendantPhone", pu.getAttendantPhone());
                map.put("paymentType", pu.getPaymentType());
                map.put("nfNum", pu.getNfNum());
                map.put("nfSerie", pu.getNfSerie());
                if (pu.getNfDate() == null) {
                    map.put("nfDate", "");
                } else {
                    map.put("nfDate", pu.getNfDate());
                }
                map.put("nfKey", pu.getNfKey());
                return map;
            } else {
                throw new RuntimeException(message);
            }
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }
}
