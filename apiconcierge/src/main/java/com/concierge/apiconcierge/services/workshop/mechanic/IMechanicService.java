package com.concierge.apiconcierge.services.workshop.mechanic;

import com.concierge.apiconcierge.models.workshop.mechanic.Mechanic;

import java.util.List;
import java.util.Map;

public interface IMechanicService {

    Map<String, Object> save(Mechanic mec);

    String update(Mechanic mec);

    List<Map<String, Object>> listAll(Integer companyId, Integer resaleId);

    Map<String, Object> filterCodePass(Mechanic mec);
}
