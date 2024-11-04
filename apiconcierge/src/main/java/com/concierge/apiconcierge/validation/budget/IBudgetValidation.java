package com.concierge.apiconcierge.validation.budget;

import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;

public interface IBudgetValidation {
    public String save( VehicleEntry vehicleEntry);
    public String update(Budget budget);
}
