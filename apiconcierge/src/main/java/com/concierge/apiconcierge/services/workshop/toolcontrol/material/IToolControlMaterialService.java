package com.concierge.apiconcierge.services.workshop.toolcontrol.material;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;

import java.util.List;
import java.util.Map;

public interface IToolControlMaterialService {
    Map<String, Object> save(ToolControlMaterial mat);
    Map<String, Object> update(ToolControlMaterial mat);
    List<Map<String, Object>> listAll(Integer companyId, Integer resaleId);
    List<Map<String, Object>> listAllEnabled(Integer companyId, Integer resaleId);
}
