package com.concierge.apiconcierge.services.vehicle.model;

import com.concierge.apiconcierge.models.vehicle.model.VehicleModel;

import java.util.List;
import java.util.Map;

public interface IVehicleModelService {
    Map<String, Object> save(VehicleModel mod);

    String update(VehicleModel mod);

    List<VehicleModel> listAll(Integer companyId, Integer resaleId);

    List<VehicleModel> listAllEnabled(Integer companyId, Integer resaleId);
}
