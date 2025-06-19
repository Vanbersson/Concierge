package com.concierge.apiconcierge.validation.vehicle.entry;

import com.concierge.apiconcierge.dtos.vehicle.entry.AuthExitDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.ExistsPlacaDto;
import com.concierge.apiconcierge.dtos.vehicle.exit.VehicleExitSaveDto;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StepVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


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
        if(vehicle.getStatus() == StatusVehicleEnum.saidaAutorizada)
            return ConstantsMessage.ERROR_STATUS;
        if(vehicle.getStepEntry() == StepVehicleEnum.Exit)
            return ConstantsMessage.ERROR_STATUS;
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

        if(vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget ){
            if(vehicle.getServiceOrder() == VehicleYesNotEnum.not)
                return  ConstantsMessage.ERROR_SERVICE_ORDER_NOT;
        }

        if (vehicle.getServiceOrder() == VehicleYesNotEnum.yes) {
            if (vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget) {
                if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank())
                    return ConstantsMessage.ERROR_BUDGET_ATTENDANT;

                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
                    return ConstantsMessage.ERROR_BUDGET_CLIENT_COMPANY;
                if(vehicle.getNumServiceOrder().isBlank())
                    return ConstantsMessage.ERROR_VEHICLE_NUMBER_O_S;
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

            if (vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget)
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

    public String exit(VehicleExitSaveDto dataExit) {

        if(dataExit.companyId() == null || dataExit.companyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if(dataExit.resaleId() == null || dataExit.resaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if(dataExit.vehicleId() == null || dataExit.vehicleId() == 0)
            return ConstantsMessage.ERROR_VEHICLE_ID;
        if(dataExit.userId() == null || dataExit.userId() == 0)
            return ConstantsMessage.ERROR_USER_ID;
        if(dataExit.userName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if(dataExit.dateExit() == null)
            return ConstantsMessage.ERROR;

        if (dataExit.userId() != 1) {
            PermissionUser permission = this.permissionUser.findPermissionId(dataExit.companyId(), dataExit.resaleId(), dataExit.userId(), AUTH_EXIT_VEHICLE);
            if (permission == null)
                return ConstantsMessage.ERROR_PERMISSION;
        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String addAuthExit(VehicleEntry vehicle, AuthExitDto authExitDto) {

        if (authExitDto.companyId() == null || authExitDto.companyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (authExitDto.resaleId() == null || authExitDto.resaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if(vehicle.getStatus() == StatusVehicleEnum.saidaAutorizada)
            return ConstantsMessage.ERROR_STATUS;
        if(vehicle.getStepEntry() == StepVehicleEnum.Exit)
            return ConstantsMessage.ERROR_STATUS;

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
                if (authExitDto.idUserExitAuth() != 1) {
                    PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_1);
                    if (permission == null)
                        return ConstantsMessage.ERROR_PERMISSION;
                }
            } else if (vehicle.getIdUserExitAuth2() == null) {
                if (authExitDto.idUserExitAuth() != 1) {
                    PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_2);
                    if (permission == null)
                        return ConstantsMessage.ERROR_PERMISSION;
                }
            }

        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (authExitDto.idUserExitAuth() != 1) {
                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.idUserExitAuth(), ADD_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null)
                    return ConstantsMessage.ERROR_PERMISSION;
            }
        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAuthExit1(VehicleEntry vehicle, AuthExitDto authExitDto) {
        if(vehicle.getStatus() == StatusVehicleEnum.saidaAutorizada)
            return ConstantsMessage.ERROR_STATUS;
        if(vehicle.getStepEntry() == StepVehicleEnum.Exit)
            return ConstantsMessage.ERROR_STATUS;
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth1() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth1().isBlank())
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getDateExitAuth1() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {

            if (authExitDto.idUserExitAuth() != 1) {
                if (vehicle.getIdUserExitAuth1() != authExitDto.idUserExitAuth())
                    return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_1);
                if (permission == null)
                    return ConstantsMessage.ERROR_PERMISSION;
            }
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (authExitDto.idUserExitAuth() != 1) {
                if (vehicle.getIdUserExitAuth1() != authExitDto.idUserExitAuth())
                    return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null)
                    return ConstantsMessage.ERROR_PERMISSION;
            }
        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAuthExit2(VehicleEntry vehicle, AuthExitDto authExitDto) {
        if(vehicle.getStatus() == StatusVehicleEnum.saidaAutorizada)
            return ConstantsMessage.ERROR_STATUS;
        if(vehicle.getStepEntry() == StepVehicleEnum.Exit)
            return ConstantsMessage.ERROR_STATUS;
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getIdUserExitAuth2() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getNameUserExitAuth2().isBlank())
            return ConstantsMessage.ERROR_NOTAUTHEXIT;
        if (vehicle.getDateExitAuth2() == null)
            return ConstantsMessage.ERROR_NOTAUTHEXIT;

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
            if (authExitDto.idUserExitAuth() != 1) {

                if (vehicle.getIdUserExitAuth2() != authExitDto.idUserExitAuth())
                    return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_2);
                if (permission == null)
                    return ConstantsMessage.ERROR_PERMISSION;
            }
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {

            if (authExitDto.idUserExitAuth() != 1) {
                if (vehicle.getIdUserExitAuth2() != authExitDto.idUserExitAuth())
                    return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;

                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.idUserExitAuth(), DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null)
                    return ConstantsMessage.ERROR_PERMISSION;
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
