package com.concierge.apiconcierge.services.workshop.matmec;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface IToolControlMatMecService {
    String save(ToolControlMatMec matMec);

    String update(ToolControlMatMec matMec);

    Map<String, Object>  filterId(Integer companyId, Integer resaleId, UUID id);

    List<Map<String, Object>> filterRequestId(Integer companyId, Integer resaleId, Integer requestId);

    List<Map<String, Object>> filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId);

    List<Map<String, Object>> filterMecIdDevPend(Integer companyId, Integer resaleId, Integer mechanicId);

    List<Map<String, Object>> listAll(Integer companyId, Integer resaleId);

    List<Map<String, Object>> listAllDevPend(Integer companyId, Integer resaleId);

    List<Map<String, Object>> listAllDevComp(Integer companyId, Integer resaleId);
}
