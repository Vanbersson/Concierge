package com.concierge.apiconcierge.validation.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.AuthExit;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.concierge.apiconcierge.util.ConstantsMessage.*;
import static com.concierge.apiconcierge.util.ConstantsPermission.*;

@Service
public class VehicleEntryValidation implements IVehicleEntryValidation {

    @Autowired
    private IVehicleEntryRepository repository;

    private final String DATEENTRY = "DateEntry not informed.";


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

    @Autowired
    IPermissionUserRepository permissionUser;

    @Override
    public String save(VehicleEntry vehicle) {

        if (vehicle.getDateEntry() == null)
            return DATEENTRY;
        if (vehicle.getVehicleNew() == VehicleYesNotEnum.not) {
            if (vehicle.getPlaca().isBlank())
                return ERROR_PLACA;

            VehicleEntry vehicleEntry = this.repository.findByPlaca(vehicle.getPlaca());
            if (vehicleEntry != null)
                return ERROR_PLACA_EXISTS;
        }
        if (vehicle.getModelId() == null || vehicle.getModelDescription().isBlank())
            return VEHICLEMODEL;
        if (vehicle.getColor() == null)
            return COLOR;
        if (!vehicle.getDriverEntryRg().isBlank())
            if (vehicle.getDriverEntryRg().length() > 11)
                return RG;
        if (vehicle.getVehicleNew().equals(VehicleYesNotEnum.not)) {
            if(vehicle.getPlaca().length() != 7)
                return ERROR_PLACA;
        }
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(VehicleEntry vehicle) {
        if (vehicle.getId() == null || vehicle.getId() == 0)
            return ERROR_ID;
        if (vehicle.getDateEntry() == null)
            return DATEENTRY;

        if (vehicle.getVehicleNew() == VehicleYesNotEnum.not) {
            if (vehicle.getPlaca().isBlank())
                return ERROR_PLACA;
        }

        if (vehicle.getColor() == null)
            return COLOR;

        if (vehicle.getModelId() == null || vehicle.getModelDescription().isBlank())
            return VEHICLEMODEL;

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

        if (vehicle.getServiceOrder() == VehicleYesNotEnum.yes) {
            if (vehicle.getBudgetStatus() != StatusBudgetEnum.semOrcamento) {
                if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank())
                    return BUDGET_ATTENDANT;

                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
                    return BUDGET_CLIENTCOMPANY;
            }

            //Verifica autorização de saída
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
        }

        if (vehicle.getServiceOrder() == VehicleYesNotEnum.not) {

            if (vehicle.getBudgetStatus() != StatusBudgetEnum.semOrcamento)
                return "Budget already exists.";

            if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.NotAuth) {

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
        }

        return ConstantsMessage.SUCCESS;
    }

    public String exit(VehicleEntry vehicle) {
        if (vehicle.getDateEntry() == null)
            return DATEENTRY;
        if (vehicle.getModelId() == null || vehicle.getModelDescription().isBlank())
            return VEHICLEMODEL;
        if (vehicle.getColor() == null)
            return COLOR;
        if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.Authorized)
            return NOTAUTHEXIT;

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


        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String addAuthExit(VehicleEntry vehicle, AuthExit authExit) {

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
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
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                return CLIENTCOMPANY;
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

        }

        if (vehicle.getIdUserExitAuth1() == null) {
            if (authExit.idUserExitAuth() != 1) {
                PermissionUser permission = this.permissionUser.findByUserIdAndPermissionId(authExit.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_1);
                if (permission == null)
                    return ERROR_PERMISSION;
            }
        } else if (vehicle.getIdUserExitAuth2() == null) {
            if (authExit.idUserExitAuth() != 1) {
                PermissionUser permission = this.permissionUser.findByUserIdAndPermissionId(authExit.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_2);
                if (permission == null)
                    return ERROR_PERMISSION;
            }
        }


        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAuthExit1(VehicleEntry vehicle, AuthExit authExit) {
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth1() == null)
            return NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth1().isBlank())
            return NOTAUTHEXIT;
        if (vehicle.getDateExitAuth1() == null)
            return NOTAUTHEXIT;

        if (authExit.idUserExitAuth() != 1) {
            if (vehicle.getIdUserExitAuth1() != null) {
                PermissionUser permission = this.permissionUser.findByUserIdAndPermissionId(authExit.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_1);
                if (permission == null)
                    return ERROR_PERMISSION;

                if (vehicle.getIdUserExitAuth1() != authExit.idUserExitAuth())
                    return ERROR_PERMISSION_ANOTHER_USER;
            }
        }


        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAuthExit2(VehicleEntry vehicle, AuthExit authExit) {
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth2() == null)
            return NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth2().isBlank())
            return NOTAUTHEXIT;
        if (vehicle.getDateExitAuth2() == null)
            return NOTAUTHEXIT;

        if (authExit.idUserExitAuth() != 1) {
            if (vehicle.getIdUserExitAuth2() != null) {
                PermissionUser permission = this.permissionUser.findByUserIdAndPermissionId(authExit.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_2);
                if (permission == null)
                    return ERROR_PERMISSION;

                if (vehicle.getIdUserExitAuth2() != authExit.idUserExitAuth())
                    return ERROR_PERMISSION_ANOTHER_USER;
            }
        }
        return ConstantsMessage.SUCCESS;
    }
}
