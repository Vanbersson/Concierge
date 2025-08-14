package com.concierge.apiconcierge.services.workshop.report;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.report.IToolControlReport;
import com.concierge.apiconcierge.repositories.workshop.report.IToolControlReportRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMatMecRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlRequestRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.util.*;

@Service
public class ToolControlReportService implements IToolControlReportService {

    @Autowired
    IToolControlReportRepository reportRepository;

    @Autowired
    IToolControlRequestRepository requestRepository;

    @Autowired
    IToolControlMatMecRepository matMecRepository;

    @SneakyThrows
    @Override
    public Map<String, Object> filterMechanic(Integer companyId, Integer resaleId, Integer mechanicId) {
        try {
            List<IToolControlReport> list = this.reportRepository.filterMechanic(companyId, resaleId, mechanicId);
            if (list.isEmpty())
                throw new ToolControlException("Not found.");

            Map<String, Object> map = new HashMap<>();
            map.put("companyId", list.get(0).getCompanyId());
            map.put("resaleId", list.get(0).getResaleId());
            map.put("mecId", mechanicId);
            List<Map<String, Object>> listItems = new ArrayList<>();
            for (var item : list) {
                Map<String, Object> map1 = new HashMap<>();
                map1.put("requestId", item.getRequestId());
                map1.put("requestDate", item.getRequestDate());
                map.put("requestStatus", item.getRequestStatus());
                map.put("requestTypeMaterial", item.getRequestType() == 0 ? TypeRequest.Loan : TypeRequest.Kit);
                map.put("requestUserId", item.getRequestUserId());
                map1.put("requestInformation", item.getRequestInformation());
                map1.put("categoryId", item.getCategoryId());
                map1.put("categoryDesc", item.getCategoryDesc());

                map1.put("matMecId", convertBytesToUUID(item.getMatMecId()));

                map1.put("matMecDelivUserId", item.getMatMecDelivUserId());
                map1.put("matMecDelivUserName", item.getMatMecDelivUserName());
                map1.put("matMecDelivQuantity", item.getMatMecDelivQuantity());
                map1.put("matMecDelivDate", item.getMatMecDelivDate());
                map1.put("matMecDelivInfor",item.getMatMecDelivInfor());

                map1.put("matMecReturUserId", item.getMatMecReturUserId() != null ? item.getMatMecReturUserId() : 0);
                map1.put("matMecReturUserName", item.getMatMecReturUserName() != null ? item.getMatMecReturUserName() : "");
                map1.put("matMecReturQuantity", item.getMatMecReturQuantity());
                map1.put("matMecReturDate", item.getMatMecReturDate() != null ? item.getMatMecReturDate() : "");
                map1.put("matMecReturInfor",item.getMatMecReturInfor());

                map1.put("matMecMaterialId", item.getMatMecMaterialId());
                map1.put("matMecMaterialDesc", item.getMatMecMaterialDesc());
                listItems.add(map1);
            }
            map.put("materials", listItems);
            return map;
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    private static UUID convertBytesToUUID(byte[] bytes) {
        ByteBuffer byteBuffer = ByteBuffer.wrap(bytes);
        long high = byteBuffer.getLong();
        long low = byteBuffer.getLong();
        return new UUID(high, low);
    }


}
