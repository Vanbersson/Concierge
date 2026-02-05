package com.concierge.apiconcierge.services.vehicle.entry;

import com.concierge.apiconcierge.dtos.vehicle.entry.AuthExitDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.ExistsVehiclePlateDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.VehicleExitDto;
import com.concierge.apiconcierge.exceptions.vehicle.VehicleEntryException;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.enums.YesNot;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.Notification;
import com.concierge.apiconcierge.models.notification.NotificationMenu;
import com.concierge.apiconcierge.models.notification.NotificationUser;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StepVehicleEnum;
import com.concierge.apiconcierge.repositories.budget.IBudgetRepository;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.repositories.user.IUserRepository;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.services.notification.notification.INotificationService;
import com.concierge.apiconcierge.services.notification.user.INotificationUserService;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.vehicle.entry.IVehicleEntryValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.concierge.apiconcierge.util.ConstantsPermission.*;

@Service
public class VehicleEntryService implements IVehicleEntryService {

    @Autowired
    private IVehicleEntryRepository repository;

    @Autowired
    private IVehicleEntryValidation validation;

    @Autowired
    private IBudgetRepository repositoryBudget;

    @Autowired
    private INotificationService notificationService;

    @Autowired
    private INotificationUserService notificationUserService;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IPermissionUserRepository permissionUser;

    @SneakyThrows
    @Override
    public MessageResponse save(VehicleEntry vehicle, String userEmail) {
        try {
            MessageResponse response = this.validation.save(vehicle, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                vehicle.setId(null);
                vehicle.setStatus(StatusVehicleEnum.Entered);
                vehicle.setStepEntry(StepVehicleEnum.Attendant);
                vehicle.setBudgetId(null);
                vehicle.setExitUserId(null);
                vehicle.setDriverExitId(null);
                vehicle.setAuth1ExitUserId(null);
                vehicle.setAuth2ExitUserId(null);
                VehicleEntry result = this.repository.save(vehicle);
                response.setData(result);

                //Notification
//                User userOrigem = this.userRepository.filterEmail(result.getCompanyId(), result.getResaleId(), userEmail);
//                this.notification("Entry", result, RECEIVE_VEHICLE_ENTRY_NOTIFICATIONS, userOrigem);
            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse update(VehicleEntry vehicle, String userEmail) {
        try {
            MessageResponse response = this.validation.update(vehicle, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                VehicleEntry result = this.repository.save(vehicle);
                response.setData(result);

//                if (vehicleEntry.getClientCompanyId() != null) {
//                    if (vehicle.getBudgetStatus() != StatusBudgetEnum.NotBudget) {
//                        this.updateBudget(vehicleEntry);
//                    }
//                }
//                if (vehicleEntry.getDriverExitId() == 0) {
//                    vehicleEntry.setDriverExitId(null);
//                }
            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse exit(VehicleExitDto dataExit, String userEmail) {
        try {
            MessageResponse response = this.validation.exit(dataExit, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {

//                VehicleEntry vehicleEntry = this.repository.filterVehicleId(dataExit.companyId(), dataExit.resaleId(), dataExit.vehicleId());
//                if (vehicleEntry.getStatusAuthExit() != StatusAuthExitEnum.Authorized) {
//                    response.setStatus(ConstantsMessage.ERROR);
//                    response.setHeader(ConstantsMessage.ERROR);
//                    response.setMessage("Veículo não autorizado.");
//                    response.setData(null);
//                }
//                vehicleEntry.setStatus(StatusVehicleEnum.saidaAutorizada);
                //              vehicleEntry.setStepEntry(StepVehicleEnum.Exit);
//                vehicleEntry.setUserIdExit(dataExit.userId());
//                vehicleEntry.setUserNameExit(dataExit.userName());
//                vehicleEntry.setDateExit(dataExit.dateExit());
//
//                vehicleEntry.setExitPhoto1(dataExit.exitPhoto1());
//                vehicleEntry.setExitPhoto2(dataExit.exitPhoto2());
//                vehicleEntry.setExitPhoto3(dataExit.exitPhoto3());
//                vehicleEntry.setExitPhoto4(dataExit.exitPhoto4());
                //  vehicleEntry.setExitInformation(dataExit.exitInformation());

                // VehicleEntry result = this.repository.save(vehicleEntry);
                //Notification
//                User userOrigem = this.userRepository.filterEmail(result.getCompanyId(), result.getResaleId(), userEmail);
//                this.notification("Exit", result, RECEIVE_VEHICLE_EXIT_NOTIFICATIONS, userOrigem);

            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAllAuthorized(Integer companyId, Integer resaleId) {

        List<Map<String, Object>> list = new ArrayList();

//        try {
//            List<VehicleEntry> vehicles = this.repository.allAuthorized(companyId, resaleId);
//            for (VehicleEntry item : vehicles) {
//                long differenceMilliseconds = new Date().getTime() - item.getDateEntry().getTime();
//                String placa = "";
//                if (!item.getPlaca().isBlank())
//                    placa = item.getPlaca().substring(0, 3) + "-" + item.getPlaca().substring(3, 7);
//
//                Map<String, Object> map = new HashMap<>();
//                map.put("id", item.getId());
//                map.put("placa", placa);
//                map.put("frota", item.getFrota());
//                map.put("vehicleNew", item.getVehicleNew());
//                map.put("modelDescription", item.getModelDescription());
//                map.put("dateEntry", item.getDateEntry());
//                map.put("days", TimeUnit.DAYS.convert(differenceMilliseconds, TimeUnit.MILLISECONDS));
//                map.put("nameUserAttendant", item.getNameUserAttendant());
//                map.put("clientCompanyName", item.getClientCompanyName());
//                map.put("statusAuthExit", item.getStatusAuthExit());
//                map.put("nameUserExitAuth1", item.getNameUserExitAuth1());
//                map.put("nameUserExitAuth2", item.getNameUserExitAuth2());
//                list.add(map);
//            }
//        } catch (Exception ex) {
//            throw new VehicleEntryException(ex.getMessage());
//        }

        return list;
    }

//    @SneakyThrows
//    @Override
//    public List<Map<String, Object>> listAllAuthorized(Integer companyId, Integer resaleId) {
//        List<Object> list = new ArrayList();
//

    /// /        try {
    /// /            List<VehicleEntry> vehicles = this.repository.allPendingAuthorization(companyId, resaleId);
    /// /
    /// /            for (VehicleEntry item : vehicles) {
    /// /                long differenceMilliseconds = new Date().getTime() - item.getDateEntry().getTime();
    /// /                String placa = "";
    /// /                if (!item.getPlaca().isBlank())
    /// /                    placa = item.getPlaca().substring(0, 3) + "-" + item.getPlaca().substring(3, 7);
    /// /
    /// /                Map<String, Object> map = new HashMap<>();
    /// /                map.put("id", item.getId());
    /// /                map.put("placa", placa);
    /// /                map.put("frota", item.getFrota());
    /// /                map.put("vehicleNew", item.getVehicleNew());
    /// /                map.put("modelDescription", item.getModelDescription());
    /// /                map.put("dateEntry", item.getDateEntry());
    /// /                map.put("days", TimeUnit.DAYS.convert(differenceMilliseconds, TimeUnit.MILLISECONDS));
    /// /                map.put("nameUserAttendant", item.getNameUserAttendant());
    /// /                map.put("clientCompanyName", item.getClientCompanyName());
    /// /                map.put("budgetStatus", item.getBudgetStatus());
    /// /                map.put("statusAuthExit", item.getStatusAuthExit());
    /// /                map.put("numServiceOrder", item.getNumServiceOrder());
    /// /                list.add(map);
    /// /            }
    /// /        } catch (Exception ex) {
    /// /            throw new VehicleEntryException(ex.getMessage());
    /// /        }
//
//        return list;
//    }
    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        List<Map<String, Object>> list = new ArrayList();

//        try {
//            List<VehicleEntry> vehicles = this.repository.findAll();
//            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
//
//            for (VehicleEntry item : vehicles) {
//                long differenceMilliseconds = new Date().getTime() - item.getDateEntry().getTime();
//                String placa = "";
//                if (!item.getPlaca().isBlank())
//                    placa = item.getPlaca().substring(0, 3) + "-" + item.getPlaca().substring(3, 7);
//
//                Map<String, Object> map = new HashMap<>();
//                map.put("id", item.getId());
//                map.put("placa", placa);
//                map.put("frota", item.getFrota());
//                map.put("vehicleNew", item.getVehicleNew());
//                map.put("modelDescription", item.getModelDescription());
//                map.put("dateEntry", dateFormat.format(item.getDateEntry()));
//                map.put("days", TimeUnit.DAYS.convert(differenceMilliseconds, TimeUnit.MILLISECONDS));
//                map.put("nameUserAttendant", item.getNameUserAttendant());
//                map.put("clientCompanyName", item.getClientCompanyName());
//                map.put("budgetStatus", item.getBudgetStatus());
//                map.put("statusAuthExit", item.getStatusAuthExit());
//                list.add(map);
//            }
//        } catch (Exception ex) {
//            throw new VehicleEntryException(ex.getMessage());
//        }

        return list;
    }

    @SneakyThrows
    @Override
    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer id) {
        try {
            MessageResponse response = this.validation.filterId(companyId, resaleId, id);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                VehicleEntry vehicle = repository.filterId(companyId, resaleId, id);
                if (vehicle == null) {
                    throw new VehicleEntryException("Veículo não encontrado.");
                }
                response.setData(vehicle);
            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterPlate(Integer companyId, Integer resaleId, String plate) {
        try {
            MessageResponse response = this.validation.filterPlate(companyId, resaleId, plate);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                VehicleEntry vehicle = repository.filterPlate(companyId, resaleId, plate);
                if (vehicle == null) {
                    throw new VehicleEntryException("Veículo não encontrado.");
                }
                response.setData(vehicle);
            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

//    @SneakyThrows
//    @Override
//    public String existsPlaca(ExistsVehiclePlateDto placa) {
//        try {
//            String message = this.validation.existsPlaca(placa);
//
//            if (ConstantsMessage.SUCCESS.equals(message)) {
//
//                VehicleEntry vehicle = repository.findByExistsPlaca(placa.companyId(), placa.resaleId(), placa.placa());
//                if (vehicle != null) {
//                    return "yes";
//                } else {
//                    return "not";
//                }
//
//            } else {
//                throw new VehicleEntryException(message);
//            }
//        } catch (Exception ex) {
//            throw new VehicleEntryException(ex.getMessage());
//        }
//    }

    @SneakyThrows
    @Override
    public MessageResponse addAuthExit(AuthExitDto authExitDto, String userEmail) {
        try {
            VehicleEntry vehicle = this.repository.filterId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.vehicleId());
            if (vehicle == null) {
                throw new VehicleEntryException("Veículo não encontrado.");
            }
            MessageResponse response = this.validation.addAuthExit(vehicle, authExitDto, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                if (vehicle.getAuth1ExitUserId() == null) {
                    vehicle.setAuth1ExitUserId(authExitDto.userId());
                    vehicle.setAuth1ExitUserName(authExitDto.userName());
                    vehicle.setAuth1ExitDate(authExitDto.dateAuth());
                    vehicle.setAuthExitStatus(statusAuthorization(vehicle));
                    this.repository.save(vehicle);
                } else if (vehicle.getAuth2ExitUserId() == null) {
                    vehicle.setAuth2ExitUserId(authExitDto.userId());
                    vehicle.setAuth2ExitUserName(authExitDto.userName());
                    vehicle.setAuth2ExitDate(authExitDto.dateAuth());
                    vehicle.setAuthExitStatus(statusAuthorization(vehicle));
                    this.repository.save(vehicle);
                }
            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse deleteAuthExit1(AuthExitDto authExitDto, String userEmail) {
        try {
            VehicleEntry vehicle = this.repository.filterId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.vehicleId());
            if (vehicle == null) {
                throw new VehicleEntryException("Veículo não encontrado.");
            }
            MessageResponse response = this.validation.deleteAuthExit1(vehicle, authExitDto, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                vehicle.setAuth1ExitUserId(null);
                vehicle.setAuth1ExitUserName("");
                vehicle.setAuth1ExitDate(null);
                vehicle.setAuthExitStatus(this.deleteAuthExit(vehicle.getAuthExitStatus()));
                this.repository.save(vehicle);
            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse deleteAuthExit2(AuthExitDto authExitDto, String userEmail) {
        try {
            VehicleEntry vehicle = this.repository.filterId(authExitDto.companyId(), authExitDto.resaleId(), authExitDto.vehicleId());
            if (vehicle == null) {
                throw new VehicleEntryException("Veículo não encontrado.");
            }
            MessageResponse response = this.validation.deleteAuthExit2(vehicle, authExitDto, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                vehicle.setAuth2ExitUserId(null);
                vehicle.setAuth2ExitUserName("");
                vehicle.setAuth2ExitDate(null);
                vehicle.setAuthExitStatus(this.deleteAuthExit(vehicle.getAuthExitStatus()));
                this.repository.save(vehicle);
            }
            return response;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

//    private void updateBudget(VehicleEntry vehicle) {
//        //update client budget
//        Budget budget = this.repositoryBudget.filterVehicleId(vehicle.getCompanyId(), vehicle.getResaleId(), vehicle.getId());
//        budget.setClientCompanyId(vehicle.getClientCompanyId());
//        budget.setIdUserAttendant(vehicle.getIdUserAttendant());
//        this.repositoryBudget.save(budget);
//    }

//    private VehicleEntry loadVehicle(VehicleEntry vehicle) {
//        if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0) {
//            vehicle.setIdUserAttendant(null);
//            vehicle.setNameUserAttendant("");
//        }
//        if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0) {
//            vehicle.setClientCompanyId(null);
//            vehicle.setClientCompanyName("");
//            vehicle.setClientCompanyCnpj("");
//            vehicle.setClientCompanyCpf("");
//            vehicle.setClientCompanyRg("");
//        }
//        if (vehicle.getIdUserExitAuth1() == null || vehicle.getIdUserExitAuth1() == 0) {
//            vehicle.setIdUserExitAuth1(null);
//            vehicle.setNameUserExitAuth1("");
//            vehicle.setDateExitAuth1(null);
//        }
//        if (vehicle.getIdUserExitAuth2() == null || vehicle.getIdUserExitAuth2() == 0) {
//            vehicle.setIdUserExitAuth2(null);
//            vehicle.setNameUserExitAuth2("");
//            vehicle.setDateExitAuth2(null);
//        }
//        return vehicle;
//    }

    private StatusAuthExitEnum statusAuthorization(VehicleEntry vehicle) {
        if (vehicle.getAuthExitStatus() == StatusAuthExitEnum.NotAuth) {
            return StatusAuthExitEnum.FirstAuth;
        } else if (vehicle.getAuthExitStatus() == StatusAuthExitEnum.FirstAuth) {
            return StatusAuthExitEnum.Authorized;
        }
        return StatusAuthExitEnum.NotAuth;
    }

    private StatusAuthExitEnum deleteAuthExit(StatusAuthExitEnum status) {
        //Status Authorization exit
        if (status == StatusAuthExitEnum.FirstAuth) {
            return StatusAuthExitEnum.NotAuth;
        } else if (status == StatusAuthExitEnum.Authorized) {
            return StatusAuthExitEnum.FirstAuth;
        }
        return status;
    }
//
//    public Map<String, Object> loadObject(VehicleEntry vehicle) {
//        Map<String, Object> map = new HashMap<>();
//        map.put("companyId", vehicle.getCompanyId());
//        map.put("resaleId", vehicle.getResaleId());
//        map.put("id", vehicle.getId());
//        map.put("status", vehicle.getStatus());
//        map.put("stepEntry", vehicle.getStepEntry());
//        map.put("budgetStatus", vehicle.getBudgetStatus());
//
//        map.put("idUserEntry", vehicle.getIdUserEntry());
//        map.put("nameUserEntry", vehicle.getNameUserEntry());
//        map.put("dateEntry", vehicle.getDateEntry());
//        map.put("entryPhoto1", vehicle.getEntryPhoto1() == null ? "" : vehicle.getEntryPhoto1());
//        map.put("entryPhoto2", vehicle.getEntryPhoto2() == null ? "" : vehicle.getEntryPhoto2());
//        map.put("entryPhoto3", vehicle.getEntryPhoto3() == null ? "" : vehicle.getEntryPhoto3());
//        map.put("entryPhoto4", vehicle.getEntryPhoto4() == null ? "" : vehicle.getEntryPhoto4());
//        map.put("datePrevisionExit", vehicle.getDatePrevisionExit() == null ? "" : vehicle.getDatePrevisionExit());
//
//        map.put("userIdExit", vehicle.getUserIdExit() == null ? 0 : vehicle.getUserIdExit());
//        map.put("userNameExit", vehicle.getUserNameExit());
//        map.put("dateExit", vehicle.getDateExit() == null ? "" : vehicle.getDateExit());
//        map.put("exitPhoto1", vehicle.getExitPhoto1() == null ? "" : vehicle.getExitPhoto1());
//        map.put("exitPhoto2", vehicle.getExitPhoto2() == null ? "" : vehicle.getExitPhoto2());
//        map.put("exitPhoto3", vehicle.getExitPhoto3() == null ? "" : vehicle.getExitPhoto3());
//        map.put("exitPhoto4", vehicle.getExitPhoto4() == null ? "" : vehicle.getExitPhoto4());
//        map.put("exitInformation", vehicle.getExitInformation());
//
//        map.put("idUserAttendant", vehicle.getIdUserAttendant() == null ? 0 : vehicle.getIdUserAttendant());
//        map.put("nameUserAttendant", vehicle.getNameUserAttendant());
//        map.put("photo1", vehicle.getPhoto1() == null ? "" : vehicle.getPhoto1());
//        map.put("photo2", vehicle.getPhoto2() == null ? "" : vehicle.getPhoto2());
//        map.put("photo3", vehicle.getPhoto3() == null ? "" : vehicle.getPhoto3());
//        map.put("photo4", vehicle.getPhoto4() == null ? "" : vehicle.getPhoto4());
//
//        map.put("idUserExitAuth1", vehicle.getIdUserExitAuth1() == null ? 0 : vehicle.getIdUserExitAuth1());
//        map.put("nameUserExitAuth1", vehicle.getNameUserExitAuth1());
//        map.put("dateExitAuth1", vehicle.getDateExitAuth1() == null ? "" : vehicle.getDateExitAuth1());
//
//        map.put("idUserExitAuth2", vehicle.getIdUserExitAuth2() == null ? 0 : vehicle.getIdUserExitAuth2());
//        map.put("nameUserExitAuth2", vehicle.getNameUserExitAuth2());
//        map.put("dateExitAuth2", vehicle.getDateExitAuth2() == null ? "" : vehicle.getDateExitAuth2());
//
//        map.put("statusAuthExit", vehicle.getStatusAuthExit());
//        map.put("modelId", vehicle.getModelId());
//        map.put("modelDescription", vehicle.getModelDescription());
//
//        map.put("clientCompanyId", vehicle.getClientCompanyId() == null ? 0 : vehicle.getClientCompanyId());
//        map.put("clientCompanyName", vehicle.getClientCompanyName());
//        map.put("clientCompanyCnpj", vehicle.getClientCompanyCnpj());
//        map.put("clientCompanyCpf", vehicle.getClientCompanyCpf());
//        map.put("clientCompanyRg", vehicle.getClientCompanyRg());
//
//        map.put("driverEntryId", vehicle.getDriverEntryId() == null ? 0 : vehicle.getDriverEntryId());
//        map.put("driverEntryName", vehicle.getDriverEntryName());
//        map.put("driverEntryCpf", vehicle.getDriverEntryCpf());
//        map.put("driverEntryRg", vehicle.getDriverEntryRg());
//        map.put("driverEntryPhoto", vehicle.getDriverEntryPhoto() == null ? "" : vehicle.getDriverEntryPhoto());
//        map.put("driverEntrySignature", vehicle.getDriverEntrySignature() == null ? "" : vehicle.getDriverEntrySignature());
//        map.put("driverEntryPhotoDoc1", vehicle.getDriverEntryPhotoDoc1() == null ? "" : vehicle.getDriverEntryPhotoDoc1());
//        map.put("driverEntryPhotoDoc2", vehicle.getDriverEntryPhotoDoc2() == null ? "" : vehicle.getDriverEntryPhotoDoc2());
//
//        map.put("driverExitId", vehicle.getDriverExitId() == null ? 0 : vehicle.getDriverExitId());
//        map.put("driverExitName", vehicle.getDriverExitName());
//        map.put("driverExitCpf", vehicle.getDriverExitCpf());
//        map.put("driverExitRg", vehicle.getDriverExitRg());
//        map.put("driverExitPhoto", vehicle.getDriverExitPhoto() == null ? "" : vehicle.getDriverExitPhoto());
//        map.put("driverExitSignature", vehicle.getDriverExitSignature() == null ? "" : vehicle.getDriverExitSignature());
//        map.put("driverExitPhotoDoc1", vehicle.getDriverExitPhotoDoc1() == null ? "" : vehicle.getDriverExitPhotoDoc1());
//        map.put("driverExitPhotoDoc2", vehicle.getDriverExitPhotoDoc2() == null ? "" : vehicle.getDriverExitPhotoDoc2());
//        map.put("color", vehicle.getColor());
//        map.put("placa", vehicle.getPlaca());
//        map.put("placasJunto", vehicle.getPlacasJunto());
//        map.put("frota", vehicle.getFrota());
//        map.put("vehicleNew", vehicle.getVehicleNew());
//        map.put("kmEntry", vehicle.getKmEntry());
//        map.put("kmExit", vehicle.getKmExit());
//        map.put("quantityExtinguisher", vehicle.getQuantityExtinguisher());
//        map.put("quantityTrafficCone", vehicle.getQuantityTrafficCone());
//        map.put("quantityTire", vehicle.getQuantityTire());
//        map.put("quantityTireComplete", vehicle.getQuantityTireComplete());
//        map.put("quantityToolBox", vehicle.getQuantityToolBox());
//        map.put("serviceOrder", vehicle.getServiceOrder());
//        map.put("numServiceOrder", vehicle.getNumServiceOrder());
//        map.put("numNfe", vehicle.getNumNfe());
//        map.put("numNfse", vehicle.getNumNfse());
//        map.put("information", vehicle.getInformation());
//        map.put("informationConcierge", vehicle.getInformationConcierge());
//        return map;
//    }

//    private String notification(String tipo, VehicleEntry vehicle, Integer permissionId, User userOrig) {
//        List<PermissionUser> permissions = this.permissionUser.filterPermissionId(vehicle.getCompanyId(), vehicle.getResaleId(), permissionId);
//        if (permissions.isEmpty()) {
//            return ConstantsMessage.FAILED;
//        }
//        Notification n = new Notification();
//        switch (tipo) {
//            case "Entry":
//                n.setCompanyId(userOrig.getCompanyId());
//                n.setResaleId(userOrig.getResaleId());
//                n.setOrigUserId(userOrig.getId());
//                n.setOrigUserName(userOrig.getName());
//                n.setOrigRoleId(userOrig.getRoleId());
//                n.setOrigRoleDesc(userOrig.getRoleDesc());
//                n.setOrigDate(new Date());
//                n.setOrigNotificationMenu(NotificationMenu.Vehicle_Entry);
//                n.setDestUserAll(YesNot.not);
//                n.setVehicleId(vehicle.getId());
//                n.setHeader("Entrada de Veículo");
//                n.setMessage1("realizou a entrada do veículo.");
//                if (vehicle.getVehicleNew() == YesNot.yes) {
//                    n.setMessage2(vehicle.getId() + ", novo, " + vehicle.getModelDescription());
//                } else {
//                    n.setMessage2(vehicle.getId() + ", " + vehicle.getPlaca() + ", " + vehicle.getModelDescription());
//                }
//                n.setMessage3("");
//                n.setShareMessage(YesNot.yes);
//                n.setDeleteMessage(YesNot.yes);
//                break;
//            case "Exit":
//                n.setCompanyId(userOrig.getCompanyId());
//                n.setResaleId(userOrig.getResaleId());
//                n.setOrigUserId(userOrig.getId());
//                n.setOrigUserName(userOrig.getName());
//                n.setOrigRoleId(userOrig.getRoleId());
//                n.setOrigRoleDesc(userOrig.getRoleDesc());
//                n.setOrigDate(new Date());
//                n.setOrigNotificationMenu(NotificationMenu.Vehicle_Exit);
//                n.setDestUserAll(YesNot.not);
//                n.setVehicleId(vehicle.getId());
//                n.setHeader("Saída de Veículo");
//                n.setMessage1("realizou a saída do veículo.");
//                if (vehicle.getVehicleNew() == YesNot.yes) {
//                    n.setMessage2(vehicle.getId() + ", novo, " + vehicle.getModelDescription());
//                } else {
//                    n.setMessage2(vehicle.getId() + ", " + vehicle.getPlaca() + ", " + vehicle.getModelDescription());
//                }
//                n.setMessage3("");
//                n.setShareMessage(YesNot.yes);
//                n.setDeleteMessage(YesNot.yes);
//                break;
//        }
//        //Save notification
//        MessageResponse resultNotification = this.notificationService.save(n);
//        Notification dataNotifi = (Notification) resultNotification.getData();
//        for (PermissionUser p : permissions) {
//            User u = this.userRepository.filterId(vehicle.getCompanyId(), vehicle.getResaleId(), p.getUserId());
//            NotificationUser nuDest = new NotificationUser();
//            nuDest.setCompanyId(userOrig.getCompanyId());
//            nuDest.setResaleId(userOrig.getResaleId());
//            nuDest.setNotificationId(dataNotifi.getId());
//            nuDest.setUserId(u.getId());
//            this.notificationUserService.save(nuDest);
//        }
//        return ConstantsMessage.SUCCESS;
//    }
}
