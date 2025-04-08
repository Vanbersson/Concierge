package com.concierge.apiconcierge.validation.budget;

import com.concierge.apiconcierge.dtos.budget.BudgetNewDto;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;

public interface IBudgetValidation {
    public String save(BudgetNewDto budgetNewDto, String userLoginEmail);

    public String save(VehicleEntry vehicleEntry);

    public String update(Budget budget, String userLoginEmail);

    public String filterVehicleId(Integer companyId, Integer resaleId, Integer vehicleId, String userLoginEmail);
}
