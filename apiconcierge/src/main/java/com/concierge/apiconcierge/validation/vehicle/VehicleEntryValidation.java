package com.concierge.apiconcierge.validation.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.AuthExit;
import com.concierge.apiconcierge.dtos.vehicle.ExistsPlacaDto;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.concierge.apiconcierge.util.ConstantsMessage.*;
import static com.concierge.apiconcierge.util.ConstantsPermission.*;

@Service
public class VehicleEntryValidation implements IVehicleEntryValidation {

    @Autowired
    private IVehicleEntryRepository repository;

    @Autowired
    IPermissionUserRepository permissionUser;

    @Override
    public String save(VehicleEntry vehicle) {

        if (vehicle.getCompanyId() == null || vehicle.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (vehicle.getResaleId() == null || vehicle.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (vehicle.getDateEntry() == null)
            return ConstantsMessage.ERROR_DATEENTRY;
        if (vehicle.getModelId() == null || vehicle.getModelId() == 0 || vehicle.getModelDescription().isBlank())
            return ConstantsMessage.ERROR_VEHICLE_MODEL;
        if (vehicle.getColor() == null)
            return ConstantsMessage.ERROR_COLOR;
        if (!vehicle.getDriverEntryRg().isBlank()) {
            if (vehicle.getDriverEntryRg().length() > 11)
                return ConstantsMessage.ERROR_RG;
        }

        if (vehicle.getVehicleNew() == VehicleYesNotEnum.not) {
            if (vehicle.getPlaca().isBlank())
                return ConstantsMessage.ERROR_PLACA;
            if (vehicle.getPlaca().length() != 7)
                return ConstantsMessage.ERROR_PLACA;

            VehicleEntry vehicleEntry = this.repository.findByExistsPlaca(vehicle.getCompanyId(), vehicle.getResaleId(), vehicle.getPlaca());
            if (vehicleEntry != null) {
                return ConstantsMessage.ERROR_PLACA_EXISTS;
            }

        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(VehicleEntry vehicle) {
        if (vehicle.getCompanyId() == null || vehicle.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (vehicle.getResaleId() == null || vehicle.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (vehicle.getId() == null || vehicle.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (vehicle.getDateEntry() == null)
            return ConstantsMessage.ERROR_DATEENTRY;
        if (vehicle.getVehicleNew() == VehicleYesNotEnum.not) {
            if (vehicle.getPlaca().isBlank())
                return ConstantsMessage.ERROR_PLACA;
        }
        if (vehicle.getColor() == null)
            return ConstantsMessage.ERROR_COLOR;
        if (vehicle.getModelId() == null || vehicle.getModelId() == 0 || vehicle.getModelDescription().isBlank())
            return ConstantsMessage.ERROR_VEHICLE_MODEL;

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
            return ConstantsMessage.ERROR_DRIVERENTRY;
        }

        if (vehicle.getServiceOrder() == VehicleYesNotEnum.yes) {
            if (vehicle.getBudgetStatus() != StatusBudgetEnum.semOrcamento) {
                if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank())
                    return ConstantsMessage.ERROR_BUDGET_ATTENDANT;

                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
                    return ConstantsMessage.ERROR_BUDGET_CLIENT_COMPANY;
            }

            //Verifica autorização de saída
            if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.NotAuth) {

                if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank())
                    return ConstantsMessage.ERROR_ATTENDANT;

                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
                    return ConstantsMessage.ERROR_CLIENTCOMPANY;
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
                    return ConstantsMessage.ERROR_DRIVEREXIT;
            }
        }

        if (vehicle.getServiceOrder() == VehicleYesNotEnum.not) {

            if (vehicle.getBudgetStatus() != StatusBudgetEnum.semOrcamento)
                return "Budget already exists.";

            if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.NotAuth) {

                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
                    return ConstantsMessage.ERROR_CLIENTCOMPANY;
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
                    return ConstantsMessage.ERROR_DRIVEREXIT;
            }
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {

            Optional<VehicleEntry> resultVehicle = this.repository.findById(vehicle.getId());
            VehicleEntry ve = resultVehicle.get();

            if (ve.getServiceOrder() == VehicleYesNotEnum.not) {
                if (ve.getStatusAuthExit() != StatusAuthExitEnum.NotAuth)
                    return ConstantsMessage.ERROR_AUTH_EXIT;
            }

        }

        return ConstantsMessage.SUCCESS;
    }

    public String exit(VehicleEntry vehicle) {
        if (vehicle.getDateEntry() == null)
            return ConstantsMessage.ERROR_DATEENTRY;
        if (vehicle.getModelId() == null || vehicle.getModelDescription().isBlank())
            return ConstantsMessage.ERROR_VEHICLE_MODEL;
        if (vehicle.getColor() == null)
            return ConstantsMessage.ERROR_COLOR;
        if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.Authorized)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;

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
            return ConstantsMessage.ERROR_DRIVERENTRY;
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
            return ConstantsMessage.ERROR_DRIVEREXIT;


        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String addAuthExit(VehicleEntry vehicle, AuthExit authExit) {

        if (authExit.companyId() == null || authExit.companyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (authExit.resaleId() == null || authExit.resaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                return ConstantsMessage.ERROR_CLIENTCOMPANY;
            }
            if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank()) {
                return ConstantsMessage.ERROR_ATTENDANT;
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
                return ConstantsMessage.ERROR_DRIVEREXIT;
            }
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                return ConstantsMessage.ERROR_CLIENTCOMPANY;
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
                return ConstantsMessage.ERROR_DRIVEREXIT;
            }

        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {

            if (vehicle.getIdUserExitAuth1() == null) {
                if (authExit.idUserExitAuth() != 1) {
                    PermissionUser permission = this.permissionUser.findPermissionId(authExit.companyId(), authExit.resaleId(), authExit.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_1);
                    if (permission == null)
                        return ERROR_PERMISSION;
                }
            } else if (vehicle.getIdUserExitAuth2() == null) {
                if (authExit.idUserExitAuth() != 1) {
                    PermissionUser permission = this.permissionUser.findPermissionId(authExit.companyId(), authExit.resaleId(), authExit.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_2);
                    if (permission == null)
                        return ERROR_PERMISSION;
                }
            }

        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (authExit.idUserExitAuth() != 1) {
                PermissionUser permission = this.permissionUser.findPermissionId(authExit.companyId(), authExit.resaleId(), authExit.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null)
                    return ERROR_PERMISSION;
            }
        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAuthExit1(VehicleEntry vehicle, AuthExit authExit) {
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth1() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth1().isBlank())
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getDateExitAuth1() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {

            if (authExit.idUserExitAuth() != 1) {
                if (vehicle.getIdUserExitAuth1() != authExit.idUserExitAuth())
                    return ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExit.companyId(), authExit.resaleId(), authExit.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_1);
                if (permission == null)
                    return ERROR_PERMISSION;
            }
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (authExit.idUserExitAuth() != 1) {
                if (vehicle.getIdUserExitAuth1() != authExit.idUserExitAuth())
                    return ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExit.companyId(), authExit.resaleId(), authExit.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null)
                    return ERROR_PERMISSION;
            }
        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAuthExit2(VehicleEntry vehicle, AuthExit authExit) {
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth2() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth2().isBlank())
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getDateExitAuth2() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
            if (authExit.idUserExitAuth() != 1) {

                if (vehicle.getIdUserExitAuth2() != authExit.idUserExitAuth())
                    return ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExit.companyId(), authExit.resaleId(), authExit.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_2);
                if (permission == null)
                    return ERROR_PERMISSION;
            }
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (authExit.idUserExitAuth() != 1) {
                if (vehicle.getIdUserExitAuth2() != authExit.idUserExitAuth())
                    return ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExit.companyId(), authExit.resaleId(), authExit.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null)
                    return ERROR_PERMISSION;
            }
        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String existsPlaca(ExistsPlacaDto placa) {
        if (placa.companyId() == null || placa.companyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (placa.resaleId() == null || placa.resaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (placa.placa().isBlank())
            return ConstantsMessage.ERROR_PLACA;
        return ConstantsMessage.SUCCESS;
    }
}
