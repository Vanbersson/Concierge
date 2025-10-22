package com.concierge.apiconcierge.validation.vehicle.entry;

import com.concierge.apiconcierge.dtos.vehicle.entry.AuthExitDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.ExistsPlacaDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.VehicleEntryDto;
import com.concierge.apiconcierge.dtos.vehicle.exit.VehicleExitSaveDto;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.message.MessageResponse;
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


import java.util.ArrayList;
import java.util.List;

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

        //Driver
        if (vehicle.getDriverEntryId() == null || vehicle.getDriverEntryId() == 0)
            return ConstantsMessage.ERROR_DRIVERENTRY;
        if (vehicle.getDriverEntryName().isBlank())
            return ConstantsMessage.ERROR_DRIVERENTRY;
        if (vehicle.getDriverEntryCpf().isBlank())
            return ConstantsMessage.ERROR_DRIVERENTRY;
        if (vehicle.getDriverEntryRg().isBlank())
            return ConstantsMessage.ERROR_DRIVERENTRY;

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
    public MessageResponse update(VehicleEntry vehicle) {
        MessageResponse response = new MessageResponse();
        if (vehicle.getCompanyId() == null || vehicle.getCompanyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getResaleId() == null || vehicle.getResaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getId() == null || vehicle.getId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getStepEntry() == StepVehicleEnum.Exit) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Etapas Veículo");
            response.setMessage("Etapa inválida.");
            return response;
        }
        if (vehicle.getDateEntry() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Data entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getVehicleNew() == VehicleYesNotEnum.not) {
            if (vehicle.getPlaca().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Placa");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
        }
        if (vehicle.getColor() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Cor");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getModelId() == null || vehicle.getModelId() == 0 || vehicle.getModelDescription().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Modelo Veículo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        //Driver
        if (vehicle.getDriverEntryId() == null || vehicle.getDriverEntryId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Motorista Entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getDriverEntryName().isBlank() || vehicle.getDriverEntryCpf().isBlank() || vehicle.getDriverEntryRg().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Motorista Entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getServiceOrder() == VehicleYesNotEnum.yes) {
            //Verifica autorização de saída
            if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.NotAuth) {
                if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Consultor");
                    response.setMessage(ConstantsMessage.NOT_INFORMED);
                    return response;
                }
                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Proprietário");
                    response.setMessage(ConstantsMessage.NOT_INFORMED);
                    return response;
                }
                if (vehicle.getDriverExitId() == null || vehicle.getDriverExitId() == 0) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Motorista Saída");
                    response.setMessage(ConstantsMessage.NOT_INFORMED);
                    return response;
                }
            }
        }
        //Já existe orçamento
        if (vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget) {
            if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Consultor");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
            if (vehicle.getNumServiceOrder().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Número O.S.");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
            if (vehicle.getServiceOrder() == VehicleYesNotEnum.not) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Ordem serviço");
                response.setMessage("Ordem de serviço iqual a não.");
                return response;
            }
            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Proprietário");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }

        }

        if (vehicle.getServiceOrder() == VehicleYesNotEnum.not) {
            if (vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Ordem de serviço");
                response.setMessage("Existe orçamento para esse veículo.");
                return response;
            }
            if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.NotAuth) {
                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Proprietário");
                    response.setMessage(ConstantsMessage.NOT_INFORMED);
                    return response;
                }
                if (vehicle.getDriverExitId() == null || vehicle.getDriverExitId() == 0) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Motorista Saída");
                    response.setMessage(ConstantsMessage.NOT_INFORMED);
                    return response;
                }
            }
        }

//        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
//            Optional<VehicleEntry> resultVehicle = this.repository.findById(vehicle.getId());
//            VehicleEntry ve = resultVehicle.get();
//            if (ve.getServiceOrder() == VehicleYesNotEnum.not) {
//                if (ve.getStatusAuthExit() != StatusAuthExitEnum.NotAuth)
//                    return ConstantsMessage.ERROR_AUTH_EXIT;
//            }
//        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Veículo");
        response.setMessage("Atualizado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse exit(VehicleExitSaveDto dataExit) {
        MessageResponse response = new MessageResponse();
        if (dataExit.companyId() == null || dataExit.companyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (dataExit.resaleId() == null || dataExit.resaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (dataExit.vehicleId() == null || dataExit.vehicleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (dataExit.userId() == null || dataExit.userId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Usuário");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (dataExit.userName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Usuário");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (dataExit.dateExit() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Data e Hora");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        //Permissão
        if (dataExit.userId() != 1) {
            PermissionUser permission = this.permissionUser.findPermissionId(dataExit.companyId(), dataExit.resaleId(), dataExit.userId(), AUTH_EXIT_VEHICLE);
            if (permission == null) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Permissão - " + AUTH_EXIT_VEHICLE);
                response.setMessage(ConstantsMessage.NOT_PERMISSION);
                return response;
            }
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Saída Veículo");
        response.setMessage("Saída realizada com sucesso.");
        return response;
    }

    @Override
    public MessageResponse addAuthExit(VehicleEntry vehicle, AuthExitDto authExitDto) {
        MessageResponse response = new MessageResponse();
        if (authExitDto.companyId() == null || authExitDto.companyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.resaleId() == null || authExitDto.resaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.vehicleId() == null || authExitDto.vehicleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código Veículo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.userId() == null || authExitDto.userId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código Usuário");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.userName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Nome Usuário");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.dateAuth() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Data Autorização");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getStatus() == StatusVehicleEnum.saidaAutorizada || vehicle.getStepEntry() == StepVehicleEnum.Exit) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está na empresa.");
            return response;
        }
        if (vehicle.getDriverEntryId() == null || vehicle.getDriverEntryId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Motorista Entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getDriverExitId() == null || vehicle.getDriverExitId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Motorista Saída");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
            if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Consultor");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Proprietário");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
        }

        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {
            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Proprietário");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
        }

        //Permission
        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
            if (vehicle.getIdUserExitAuth1() == null) {
                if (authExitDto.userId() != 1) {
                    PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), ADD_AUTH_EXIT_VEHICLE_1);
                    if (permission == null) {
                        response.setStatus(ConstantsMessage.ERROR);
                        response.setHeader("Permissão - " + ADD_AUTH_EXIT_VEHICLE_1);
                        response.setMessage(ConstantsMessage.NOT_PERMISSION);
                        return response;
                    }
                }
            } else if (vehicle.getIdUserExitAuth2() == null) {
                if (authExitDto.userId() != 1) {
                    PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), ADD_AUTH_EXIT_VEHICLE_2);
                    if (permission == null) {
                        response.setStatus(ConstantsMessage.ERROR);
                        response.setHeader("Permissão - " + ADD_AUTH_EXIT_VEHICLE_2);
                        response.setMessage(ConstantsMessage.NOT_PERMISSION);
                        return response;
                    }
                }
            }

        }
        //Permission
        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {
            if (authExitDto.userId() != 1) {
                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), ADD_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Permissão - " + ADD_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                    response.setMessage(ConstantsMessage.NOT_PERMISSION);
                    return response;
                }
            }
        }

        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Autorização Saída");
        response.setMessage("Autorizado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse deleteAuthExit1(VehicleEntry vehicle, AuthExitDto authExitDto) {
        MessageResponse response = new MessageResponse();
        if (vehicle.getStatus() == StatusVehicleEnum.saidaAutorizada || vehicle.getStepEntry() == StepVehicleEnum.Exit) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está na empresa.");
            return response;
        }
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está autorizado.");
            return response;
        }
        //Permission
        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
            if (authExitDto.userId() != 1) {
                //Permissão de outro usuário
//                if (vehicle.getIdUserExitAuth1() != authExitDto.userId()){
//                 return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;
//                }
                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), DEL_AUTH_EXIT_VEHICLE_1);
                if (permission == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Permissão - " + DEL_AUTH_EXIT_VEHICLE_1);
                    response.setMessage(ConstantsMessage.NOT_PERMISSION);
                    return response;
                }
            }
        }
        //Permission
        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {
            if (authExitDto.userId() != 1) {
                //Permissão de outro usuário
//                if (vehicle.getIdUserExitAuth1() != authExitDto.userId()){
//                    return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;
//                }
                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Permissão - " + DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                    response.setMessage(ConstantsMessage.NOT_PERMISSION);
                    return response;
                }
            }
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Autorização");
        response.setMessage("Removida com sucesso.");
        return response;
    }

    @Override
    public MessageResponse deleteAuthExit2(VehicleEntry vehicle, AuthExitDto authExitDto) {
        MessageResponse response = new MessageResponse();
        if (vehicle.getStatus() == StatusVehicleEnum.saidaAutorizada || vehicle.getStepEntry() == StepVehicleEnum.Exit) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está na empresa.");
            return response;
        }
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está autorizado.");
            return response;
        }
        //Permission
        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.yes)) {
            if (authExitDto.userId() != 1) {
//                if (vehicle.getIdUserExitAuth2() != authExitDto.userId()){
//                    return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;
//                }
                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), DEL_AUTH_EXIT_VEHICLE_2);
                if (permission == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Permissão - " + DEL_AUTH_EXIT_VEHICLE_2);
                    response.setMessage(ConstantsMessage.NOT_PERMISSION);
                    return response;
                }
            }
        }
        //Permission
        if (vehicle.getServiceOrder().equals(VehicleYesNotEnum.not)) {
            if (authExitDto.userId() != 1) {
//                if (vehicle.getIdUserExitAuth2() != authExitDto.userId()){
//                    return ConstantsMessage.ERROR_PERMISSION_ANOTHER_USER;
//                }
                PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                if (permission == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Permissão - " + DEL_AUTH_EXIT_VEHICLE_WITHOUT_O_S);
                    response.setMessage(ConstantsMessage.NOT_PERMISSION);
                    return response;
                }
            }
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Autorização");
        response.setMessage("Removida com sucesso.");
        return response;
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
