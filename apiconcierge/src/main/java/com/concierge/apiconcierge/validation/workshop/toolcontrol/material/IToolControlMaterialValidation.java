package com.concierge.apiconcierge.validation.workshop.toolcontrol.material;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;

public interface IToolControlMaterialValidation {
    String save(ToolControlMaterial mat);

    MessageResponse update(ToolControlMaterial mat);

    String listAll(Integer companyId, Integer resaleId);

    String listAllEnabled(Integer companyId, Integer resaleId);
}
