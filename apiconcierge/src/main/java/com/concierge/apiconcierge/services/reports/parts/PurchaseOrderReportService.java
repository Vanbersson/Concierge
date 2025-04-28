package com.concierge.apiconcierge.services.reports.parts;

import com.concierge.apiconcierge.dtos.reports.parts.PurchaseOrderReportDto;
import com.concierge.apiconcierge.exceptions.purchase.PurchaseOrderException;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.models.purchase.statusEnum.PurchaseOrderStatus;
import com.concierge.apiconcierge.repositories.reports.parts.PurchaseOrderReportRepository;
import com.concierge.apiconcierge.repositories.vehicle.reports.VehicleReportRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

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

            List<PurchaseOrder> purchases = this.repository.filterPurchase(purchase);
            List<Object> list = new ArrayList();

            for (var item : purchases) {
                Map<String, Object> map = new HashMap<>();
                map.put("companyId", item.getCompanyId());
                map.put("resaleId", item.getResaleId());
                map.put("id", item.getId());
                map.put("status", item.getStatus());
                map.put("clientCompanyId", item.getCompanyId());
                map.put("clientCompanyName", item.getClientCompanyName());

                if (!item.getAttendantName().isBlank()) {
                    map.put("attendantName", item.getAttendantName());
                } else {
                    map.put("attendantName", "");
                }
                map.put("dateGeneration", item.getDateGeneration());
                map.put("dateDelivery", item.getDateDelivery());
                if (item.getDateReceived() == null) {
                    map.put("dateReceived", "");
                } else {
                    map.put("dateReceived", item.getDateReceived());
                }
                map.put("responsibleName", item.getResponsibleName());
                map.put("nfNum", item.getNfNum());

                if (!purchase.statusDelivery().isBlank()) {

                    if (item.getStatus() == PurchaseOrderStatus.Open_Purchase_Order) {

                        Date dateNow = new Date();
                        LocalDateTime dateInit = dateNow.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                        LocalDateTime dateInit2 = dateInit.withHour(0).withMinute(0).withSecond(0).withNano(0);
                        Date date = Date.from(dateInit2.atZone(ZoneId.systemDefault()).toInstant());

                        String statusD = "Today";
                        var diff = item.getDateDelivery().getTime() - date.getTime();

                        if (diff > 0) statusD = "OnTime";
                        if (diff < 0) statusD = "Late";

                        if (purchase.statusDelivery().equals(statusD)) {
                            map.put("statusDelivery", statusD);
                            list.add(map);
                        }
                    } else {
                        String statusD = "OnTime";
                        var diff = item.getDateDelivery().getTime() - item.getDateReceived().getTime();

                        if (diff > 0) statusD = "OnTime";
                        if (diff < 0) statusD = "Late";

                        if (purchase.statusDelivery().equals(statusD)) {
                            map.put("statusDelivery", statusD);
                            list.add(map);
                        }
                    }
                } else {
                    list.add(map);
                }


            }

            return list;
        } catch (Exception ex) {
            throw new PurchaseOrderException(ex.getMessage());
        }
    }
}
