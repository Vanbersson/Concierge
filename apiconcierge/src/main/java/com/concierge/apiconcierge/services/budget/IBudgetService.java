package com.concierge.apiconcierge.services.budget;

import com.concierge.apiconcierge.models.budget.Budget;

import java.util.Map;

public interface IBudgetService {

    public Integer save(Integer vehicleEntryId);

    public boolean update(Budget budget);

    public Map<String,Object> filterVehicleId(Integer vehicleId);
}
