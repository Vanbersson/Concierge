package com.concierge.apiconcierge.services.reports.parts;

import com.concierge.apiconcierge.dtos.reports.concierge.VehicleReportDto;
import com.concierge.apiconcierge.dtos.reports.parts.PurchaseOrderReportDto;

import java.util.List;

public interface IPurchaseOrderReportService {
    public List<Object> filterPurchase(PurchaseOrderReportDto purchase);
}
