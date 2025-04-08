package com.concierge.apiconcierge.services.budget;

import com.concierge.apiconcierge.dtos.budget.BudgetNewDto;
import com.concierge.apiconcierge.models.budget.Budget;

import java.util.Map;

public interface IBudgetService {

    public Integer save(BudgetNewDto budget, String userLoginEmail);

    public boolean update(Budget budget, String userLoginEmail);

    public Map<String, Object> filterVehicleId(Integer companyId, Integer resaleId, Integer vehicleId, String userLoginEmail);
}
