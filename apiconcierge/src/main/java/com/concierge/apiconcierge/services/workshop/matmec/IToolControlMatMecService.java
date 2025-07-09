package com.concierge.apiconcierge.services.workshop.matmec;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;

import java.util.List;
import java.util.Map;

public interface IToolControlMatMecService {
    Map<String, Object> save(ToolControlMatMec matMec);

    String update(ToolControlMatMec matMec);

    List<Map<String, Object>> filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId);

    List<Map<String, Object>> filterMecIdDevPend(Integer companyId, Integer resaleId, Integer mechanicId);

    List<Map<String, Object>> listAll(Integer companyId, Integer resaleId);

    List<Map<String, Object>> listAllDevPend(Integer companyId, Integer resaleId);

    List<Map<String, Object>> listAllDevComp(Integer companyId, Integer resaleId);
}
