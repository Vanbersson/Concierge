package com.concierge.apiconcierge.validation.vehicle;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import com.concierge.apiconcierge.repositories.vehicle.IVehicleEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleEntryValidation implements IVehicleEntryValidation {

    @Autowired
    private IVehicleEntryRepository repository;
    private static final String SUCCESS = "success.";
    private final String ID = "Id not informed.";
    private final String DATEENTRY = "DateEntry not informed.";
    private final String PLACA = "Placa not informed.";
    private final String PLACAEXISTS = "Placa already exists.";
    private final String VEHICLEMODEL = "Model not informed.";
    private final String COLOR = "Color not informed.";
    private final String RG = "Invalid RG.";
    private final String DRIVERENTRY = "DriverEntry not informed.";
    private final String DRIVEREXIT = "DriverExit not informed.";
    private final String ATTENDANT = "Attendant not informed.";
    private final String CLIENTCOMPANY = "ClientCompany not informed.";
    private final String BUDGET_ATTENDANT = "BUDGET-Attendant not informed.";
    private final String BUDGET_CLIENTCOMPANY = "BUDGET-ClientCompany not informed.";
    private final String NOTAUTHEXIT = "Unauthorized.";

    @Override
    public String save(VehicleEntry vehicle) {
        String message = SUCCESS;

        if (vehicle.getDateEntry() == null)
            return DATEENTRY;
        if (vehicle.getVehicleNew() == VehicleYesNotEnum.not) {
            if (vehicle.getPlaca().isBlank())
                return PLACA;

            VehicleEntry vehicleEntry = this.repository.findByPlaca(vehicle.getPlaca());
            if (vehicleEntry != null)
                return PLACAEXISTS;
        }
        if (vehicle.getModelId() == null || vehicle.getModelDescription().isBlank())
            return VEHICLEMODEL;
        if (vehicle.getColor() == null)
            return COLOR;
        if (!vehicle.getDriverEntryRg().isBlank())
            if (vehicle.getDriverEntryRg().length() > 11)
                return RG;
        return message;
    }

    @Override
    public String update(VehicleEntry vehicle) {
        String message = SUCCESS;
        if (vehicle.getId() == null || vehicle.getId() == 0)
            return ID;
        if (vehicle.getDateEntry() == null)
            return DATEENTRY;
        if (vehicle.getVehicleNew() == VehicleYesNotEnum.not) {
            if (vehicle.getPlaca().isBlank())
                return PLACA;
        }
        if (vehicle.getModelId() == null || vehicle.getModelDescription().isBlank())
            return VEHICLEMODEL;
        if (vehicle.getColor() == null)
            return COLOR;

        int countDriver = 0;
        if (!vehicle.getDriverEntryName().isBlank()) {
            countDriver++;
        }
        if (!vehicle.getDriverEntryCpf().isBlank()) {
            countDriver++;
        }
        if (!vehicle.getDriverEntryRg().isBlank()) {
            countDriver++;
        }
        if (countDriver <= 1) {
            return DRIVERENTRY;
        }
        if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.NotAuth) {

            if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank())
                return ATTENDANT;

            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
                return CLIENTCOMPANY;
            countDriver = 0;
            if (!vehicle.getDriverExitName().isBlank()) {
                countDriver++;
            }
            if (!vehicle.getDriverExitCpf().isBlank()) {
                countDriver++;
            }
            if (!vehicle.getDriverExitRg().isBlank()) {
                countDriver++;
            }
            if (countDriver <= 1)
                return DRIVEREXIT;
        }

        if(vehicle.getBudgetStatus() != StatusBudgetEnum.semOrcamento){
            if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank())
                return BUDGET_ATTENDANT;

            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
                return BUDGET_CLIENTCOMPANY;
        }
        return message;
    }

    @Override
    public String addAuthExit(VehicleEntry vehicle) {
        if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
            return CLIENTCOMPANY;
        }
        if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank()) {
            return ATTENDANT;
        }
        int countDriver = 0;
        if (!vehicle.getDriverExitName().isBlank()) {
            countDriver++;
        }
        if (!vehicle.getDriverExitCpf().isBlank()) {
            countDriver++;
        }
        if (!vehicle.getDriverExitRg().isBlank()) {
            countDriver++;
        }
        if (countDriver < 2) {
            return DRIVEREXIT;
        }

        return SUCCESS;
    }

    @Override
    public String deleteAuthExit1(VehicleEntry vehicle) {
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth1() == null)
            return NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth1().isBlank())
            return NOTAUTHEXIT;
        if (vehicle.getDateExitAuth1() == null)
            return NOTAUTHEXIT;
        return SUCCESS;
    }

    @Override
    public String deleteAuthExit2(VehicleEntry vehicle) {
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth2() == null)
            return NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth2().isBlank())
            return NOTAUTHEXIT;
        if (vehicle.getDateExitAuth2() == null)
            return NOTAUTHEXIT;
        return SUCCESS;
    }
}
