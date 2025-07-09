package com.concierge.apiconcierge.services.workshop.report;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.mechanic.Mechanic;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.models.workshop.toolcontrol.report.IToolControlReport;
import com.concierge.apiconcierge.repositories.workshop.mechanic.IMechanicRepository;
import com.concierge.apiconcierge.repositories.workshop.report.IToolControlReportRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMaterialRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.util.*;

@Service
public class ToolControlReportService implements IToolControlReportService {

    @Autowired
    IToolControlReportRepository reportRepository;

    @SneakyThrows
    @Override
    public Map<String, Object> filterRequest(Integer companyId, Integer resaleId, Integer requestId) {
        try {
            Map<String, Object> result = this.reportRepository.filterRequest(companyId, resaleId, requestId);
            Map<String, Object> mapMec = new HashMap<>();
            mapMec.put("mecName", result.get("name"));
            mapMec.put("mecPhoto", result.get("photo"));
            return mapMec;
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }


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
            map.put("mecId", list.get(0).getMecId());
            map.put("mecName", list.get(0).getMecName());
            map.put("mecPhoto", list.get(0).getMecPhoto());

            List<Map<String, Object>> listItems = new ArrayList<>();
            for (var item : list) {
                Map<String, Object> map1 = new HashMap<>();
                map1.put("requestId", item.getRequestId());
                map1.put("matMecId", convertBytesToUUID(item.getMatMecId()));
                map1.put("requestDateReq", item.getRequestDateReq());
                map1.put("categoryId", item.getCategoryId());
                map1.put("categoryDesc", item.getCategoryDesc());
                map1.put("materialId", item.getMaterialId());
                map1.put("materialDesc", item.getMaterialDesc());
                map1.put("materialPhoto", item.getMaterialPhoto());
                map1.put("materialQuantReq", item.getMaterialQuantReq());
                map1.put("materialInfReq", item.getMaterialInfReq());
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
