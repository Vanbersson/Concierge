package com.concierge.apiconcierge.services.workshop.toolcontrol.material;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;

import java.util.List;
import java.util.Map;

public interface IToolControlMaterialService {
    Map<String, Object> save(ToolControlMaterial mat);
    MessageResponse update(ToolControlMaterial mat);
    List<Map<String, Object>> listAll(Integer companyId, Integer resaleId);
    List<Map<String, Object>> listAllEnabled(Integer companyId, Integer resaleId);
}
