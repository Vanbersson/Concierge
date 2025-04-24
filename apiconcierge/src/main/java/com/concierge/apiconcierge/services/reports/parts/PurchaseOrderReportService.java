package com.concierge.apiconcierge.services.reports.parts;

import com.concierge.apiconcierge.dtos.reports.parts.PurchaseOrderReportDto;
import com.concierge.apiconcierge.exceptions.purchase.PurchaseOrderException;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.repositories.reports.parts.PurchaseOrderReportRepository;
import com.concierge.apiconcierge.repositories.vehicle.reports.VehicleReportRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderReportService implements IPurchaseOrderReportService {

    @Autowired
    PurchaseOrderReportRepository repository;

    @SneakyThrows
    @Override
    public List<Object> filterPurchase(PurchaseOrderReportDto purchase) {

        try {
            if (purchase.companyId() == null || purchase.companyId() == 0)
                throw new PurchaseOrderException(ConstantsMessage.ERROR_COMPANY);
            if (purchase.resaleId() == null || purchase.resaleId() == 0)
                throw new PurchaseOrderException(ConstantsMessage.ERROR_RESALE);


            List<PurchaseOrder> list = this.repository.filterPurchase(purchase);

            return null;

        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }
}
