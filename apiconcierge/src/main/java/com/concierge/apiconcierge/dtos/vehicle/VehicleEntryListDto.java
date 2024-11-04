package com.concierge.apiconcierge.dtos.vehicle;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

/*

 status, step_entry,budget_id, budget_status, name_user_entry,date_entry, name_user_attendant,id_user_exit_auth1, id_user_exit_auth2, status_auth_exit, model_description, client_company_name,placa,frota,vehicle_new
 */
public record VehicleEntryListDto(

        Integer id,
        String placa,
        VehicleYesNotEnum vehicleNew,
        String frota,
        String modelDescription,
        Date dateEntry,
        String nameUserAttendant,
        String clientCompanyName,
        StatusBudgetEnum budgetStatus,

        StatusAuthExitEnum statusAuthExit) {
}
