package com.concierge.apiconcierge.validation.workshop.mechanic;

import com.concierge.apiconcierge.models.workshop.mechanic.Mechanic;

import java.util.List;
import java.util.Map;

public interface IMechanicValidation {
    String save(Mechanic mec);
    String update(Mechanic mec);
    String listAll(Integer companyId, Integer resaleId);
    String filterCodePass(Mechanic mec);
}
