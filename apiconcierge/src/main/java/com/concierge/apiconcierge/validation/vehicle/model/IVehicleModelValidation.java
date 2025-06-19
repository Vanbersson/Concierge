package com.concierge.apiconcierge.validation.vehicle.model;

import com.concierge.apiconcierge.models.vehicle.model.VehicleModel;

import java.util.List;
import java.util.Map;

public interface IVehicleModelValidation {
    String save(VehicleModel mod);

    String update(VehicleModel mod);

    String listAll(Integer companyId, Integer resaleId);

    String listAllEnabled(Integer companyId, Integer resaleId);
}
