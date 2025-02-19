package com.concierge.apiconcierge.services.budget;

import com.concierge.apiconcierge.models.budget.Budget;

import java.util.Map;

public interface IBudgetService {

    public Integer save(Integer vehicleEntryId, String userEmail);

    public boolean update(Budget budget,String userEmail);

    public Map<String,Object> filterVehicleId(Integer vehicleId);
}
