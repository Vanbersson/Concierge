package com.concierge.apiconcierge.validation.vehicle.entry;

import com.concierge.apiconcierge.dtos.vehicle.entry.AuthExitDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.ExistsVehiclePlateDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.VehicleExitDto;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.enums.YesNot;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StepVehicleEnum;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import static com.concierge.apiconcierge.util.ConstantsPermission.*;

@Service
public class VehicleEntryValidation implements IVehicleEntryValidation {

    @Autowired
    private IVehicleEntryRepository repository;

    @Autowired
    IPermissionUserRepository permissionUser;

    @Override
    public MessageResponse save(VehicleEntry vehicle, String userEmail) {
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
        if (vehicle.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getEntryDate() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Data Entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getModelId() == null || vehicle.getModelId() == 0 || vehicle.getModelDescription().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Modelo do Veículo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        //Driver
        if (vehicle.getDriverEntryId() == null || vehicle.getDriverEntryId() == 0 || vehicle.getDriverEntryName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Motorista Entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }

        if (vehicle.getVehicleNew() == YesNot.not) {


            if (vehicle.getVehiclePlate().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Placa");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }

            if (vehicle.getVehiclePlate().length() != 7) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Placa");
                response.setMessage("Informação inválida");
                return response;
            }
//            VehicleEntry vehicleEntry = this.repository.filterExistsPlate(vehicle.getCompanyId(), vehicle.getResaleId(), StatusVehicleEnum.Entered, vehicle.getVehiclePlate());
//            if (vehicleEntry != null) {
//                response.setStatus(ConstantsMessage.ERROR);
//                response.setHeader("Placa");
//                response.setMessage("Informação inválida");
//                return response;
//            }

        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Entrada");
        response.setMessage("Realizada com sucesso.");
        return response;
    }

    @Override
    public MessageResponse update(VehicleEntry vehicle, String userEmail) {
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
        if (vehicle.getEntryDate() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Data entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getVehicleNew() == YesNot.not) {
            if (vehicle.getVehiclePlate().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Placa");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
        }
        if (vehicle.getModelId() == null || vehicle.getModelId() == 0 || vehicle.getModelDescription().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Modelo Veículo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        //Driver
        if (vehicle.getDriverEntryId() == null || vehicle.getDriverEntryId() == 0 || vehicle.getDriverEntryName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Motorista Entrada");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }

        if (vehicle.getVehicleServiceOrder() == YesNot.yes) {
            //Verifica autorização de saída
//            if (vehicle.getStatusAuthExit() != StatusAuthExitEnum.NotAuth) {
//                if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank()) {
//                    response.setStatus(ConstantsMessage.ERROR);
//                    response.setHeader("Consultor");
//                    response.setMessage(ConstantsMessage.NOT_INFORMED);
//                    return response;
//                }
//                if (vehicle.getNumServiceOrder().isBlank()) {
//                    response.setStatus(ConstantsMessage.ERROR);
//                    response.setHeader("Número O.S.");
//                    response.setMessage(ConstantsMessage.NOT_INFORMED);
//                    return response;
//                }
//                if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
//                    response.setStatus(ConstantsMessage.ERROR);
//                    response.setHeader("Proprietário");
//                    response.setMessage(ConstantsMessage.NOT_INFORMED);
//                    return response;
//                }
//                if (vehicle.getDriverExitId() == null || vehicle.getDriverExitId() == 0) {
//                    response.setStatus(ConstantsMessage.ERROR);
//                    response.setHeader("Motorista Saída");
//                    response.setMessage(ConstantsMessage.NOT_INFORMED);
//                    return response;
//                }
//            }
        }
        //Já existe orçamento
//        if (vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget) {
//            if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank()) {
//                response.setStatus(ConstantsMessage.ERROR);
//                response.setHeader("Consultor");
//                response.setMessage(ConstantsMessage.NOT_INFORMED);
//                return response;
//            }
//            if (vehicle.getNumServiceOrder().isBlank()) {
//                response.setStatus(ConstantsMessage.ERROR);
//                response.setHeader("Número O.S.");
//                response.setMessage(ConstantsMessage.NOT_INFORMED);
//                return response;
//            }
//            if (vehicle.getServiceOrder() == YesNot.not) {
//                response.setStatus(ConstantsMessage.ERROR);
//                response.setHeader("Ordem serviço");
//                response.setMessage("Ordem de serviço iqual a não.");
//                return response;
//            }
//            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
//                response.setStatus(ConstantsMessage.ERROR);
//                response.setHeader("Proprietário");
//                response.setMessage(ConstantsMessage.NOT_INFORMED);
//                return response;
//            }
//
//        }

        if (vehicle.getVehicleServiceOrder() == YesNot.not) {
//            if (vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget) {
//                response.setStatus(ConstantsMessage.ERROR);
//                response.setHeader("Ordem de serviço");
//                response.setMessage("Existe orçamento para esse veículo.");
//                return response;
//            }
            if (vehicle.getAuthExitStatus() != StatusAuthExitEnum.NotAuth) {
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
    public MessageResponse exit(VehicleExitDto dataExit, String userEmail) {
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
        if (dataExit.exitUserId() == null || dataExit.exitUserId() == 0 || dataExit.exitUserName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Usuário");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (dataExit.exitDate() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Data e Hora");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        //Permissão
        if (dataExit.exitUserId() != 1) {
            PermissionUser permission = this.permissionUser.findPermissionId(dataExit.companyId(), dataExit.resaleId(), dataExit.exitUserId(), AUTH_EXIT_VEHICLE);
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
    public String listAllAuthorized(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listAll(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public MessageResponse filterId(Integer companyId, Integer resaleId,Integer id) {
        MessageResponse response = new MessageResponse();
        if (companyId == null || companyId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (resaleId == null || resaleId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (id == null || id == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Veículo");
        response.setMessage("Encontrado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse filterPlate(Integer companyId, Integer resaleId, String plate) {
        MessageResponse response = new MessageResponse();
        if (companyId == null || companyId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (resaleId == null || resaleId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (plate.isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Placa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Veículo");
        response.setMessage("Encontrado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse addAuthExit(VehicleEntry vehicle, AuthExitDto authExitDto, String userEmail) {
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
            response.setHeader("Código do Veículo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.userId() == null || authExitDto.userId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código do Usuário");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.userName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Nome do Usuário");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (authExitDto.dateAuth() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Data do Autorização");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (vehicle.getStatus() == StatusVehicleEnum.Exited) {
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
        if (vehicle.getVehicleServiceOrder() == YesNot.yes) {
            if (vehicle.getAttendantUserId() == null || vehicle.getAttendantUserId() == 0 || vehicle.getAttendantUserName().isBlank()) {
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
            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Proprietário");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
        }

        if (vehicle.getVehicleServiceOrder() == YesNot.not) {
            if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank()) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Proprietário");
                response.setMessage(ConstantsMessage.NOT_INFORMED);
                return response;
            }
        }

        //Permission
        if (vehicle.getVehicleServiceOrder() == YesNot.yes) {

            if (vehicle.getAuth1ExitUserId() == null || vehicle.getAuth1ExitUserId() == 0) {
                if (authExitDto.userId() != 1) {
                    PermissionUser permission = this.permissionUser.findPermissionId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.userId(), ADD_AUTH_EXIT_VEHICLE_1);
                    if (permission == null) {
                        response.setStatus(ConstantsMessage.ERROR);
                        response.setHeader("Permissão - " + ADD_AUTH_EXIT_VEHICLE_1);
                        response.setMessage(ConstantsMessage.NOT_PERMISSION);
                        return response;
                    }
                }
            } else if (vehicle.getAuth2ExitUserId() == null || vehicle.getAuth2ExitUserId() == 0) {
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
        if (vehicle.getVehicleServiceOrder() == YesNot.not) {
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
    public MessageResponse deleteAuthExit1(VehicleEntry vehicle, AuthExitDto authExitDto, String userEmail) {
        MessageResponse response = new MessageResponse();
        if (vehicle.getStatus() == StatusVehicleEnum.Exited || vehicle.getStepEntry() == StepVehicleEnum.Exit) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está na empresa.");
            return response;
        }
        if (vehicle.getAuthExitStatus() == StatusAuthExitEnum.NotAuth) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está autorizado.");
            return response;
        }
        //Permission
        if (vehicle.getVehicleServiceOrder().equals(YesNot.yes)) {
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
        if (vehicle.getVehicleServiceOrder().equals(YesNot.not)) {
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
    public MessageResponse deleteAuthExit2(VehicleEntry vehicle, AuthExitDto authExitDto, String userEmail) {
        MessageResponse response = new MessageResponse();
        if (vehicle.getStatus() == StatusVehicleEnum.Exited || vehicle.getStepEntry() == StepVehicleEnum.Exit) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está na empresa.");
            return response;
        }
        if (vehicle.getAuthExitStatus() == StatusAuthExitEnum.NotAuth) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Veículo");
            response.setMessage("Veículo não está autorizado.");
            return response;
        }
        //Permission
        if (vehicle.getVehicleServiceOrder().equals(YesNot.yes)) {
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
        if (vehicle.getVehicleServiceOrder().equals(YesNot.not)) {
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


}
