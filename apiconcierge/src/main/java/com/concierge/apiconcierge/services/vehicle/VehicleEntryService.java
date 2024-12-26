package com.concierge.apiconcierge.services.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.AuthExit;
import com.concierge.apiconcierge.exceptions.vehicle.VehicleEntryException;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StepVehicleEnum;
import com.concierge.apiconcierge.repositories.vehicle.IVehicleEntryRepository;
import com.concierge.apiconcierge.services.clientcompany.ClientCompanyService;
import com.concierge.apiconcierge.validation.vehicle.VehicleEntryValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class VehicleEntryService implements IVehicleEntryService {

    private static final String SUCCESS = "Success.";

    @Autowired
    private IVehicleEntryRepository repository;

    @Autowired
    private VehicleEntryValidation validation;

    @Autowired
    private ClientCompanyService clientCompanyService;

    @SneakyThrows
    @Override
    public Integer save(VehicleEntry vehicle) {
        VehicleEntry result;
        try {
            vehicle.setId(null);
            VehicleEntry vehicleEntry = this.loadVehicle(vehicle);
            String message = this.validation.save(vehicleEntry);
            if (message.equals(SUCCESS)) {

                if (vehicleEntry.getClientCompanyId() != null) {
                    //Consulta local o cliente
                    ClientCompany clientLocal = this.clientCompanyService.filterIdLocal(vehicleEntry.getClientCompanyId());
                    if (clientLocal == null) {
                        //Consulta Remoto e salva localmente o cliente
                        ClientCompany clientNew = this.clientCompanyService.filterIdRemote(vehicleEntry.getClientCompanyId());

                        //Save local
                        clientNew.setCompanyId(vehicleEntry.getCompanyId());
                        clientNew.setResaleId(vehicleEntry.getResaleId());
                        clientNew.setStatus(StatusEnableDisable.ativo);
                        clientNew.setContactName("");
                        clientNew.setContactEmail("");
                        clientNew.setContactDDDPhone("");
                        clientNew.setContactPhone("");
                        clientNew.setContactDDDCellphone("");
                        clientNew.setContactCellphone("");

                        Integer resultClientNew = this.clientCompanyService.save(clientNew);
                    }
                }

                result = this.repository.save(vehicleEntry);
            } else {
                throw new VehicleEntryException(message);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
        return result.getId();
    }

    @SneakyThrows
    @Override
    public boolean update(VehicleEntry vehicle) {
        VehicleEntry result;
        try {
            VehicleEntry vehicleEntry = this.loadVehicle(vehicle);
            String message = this.validation.update(vehicleEntry);
            if (message.equals(SUCCESS)) {

                if (vehicleEntry.getClientCompanyId() != null) {
                    //Consulta local o cliente
                    ClientCompany clientLocal = this.clientCompanyService.filterIdLocal(vehicleEntry.getClientCompanyId());
                    if (clientLocal == null) {
                        //Consulta Remoto e salva localmente o cliente
                        ClientCompany clientNew = this.clientCompanyService.filterIdRemote(vehicleEntry.getClientCompanyId());

                        //Save local
                        clientNew.setCompanyId(vehicleEntry.getCompanyId());
                        clientNew.setResaleId(vehicleEntry.getResaleId());
                        clientNew.setStatus(StatusEnableDisable.ativo);
                        clientNew.setContactName("");
                        clientNew.setContactEmail("");
                        clientNew.setContactDDDPhone("");
                        clientNew.setContactPhone("");
                        clientNew.setContactDDDCellphone("");
                        clientNew.setContactCellphone("");

                        Integer resultClientNew = this.clientCompanyService.save(clientNew);
                    }

                }

                result = this.repository.save(vehicleEntry);
            } else {
                throw new VehicleEntryException(message);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
        return true;
    }

    @SneakyThrows
    @Override
    public String exit(VehicleEntry vehicle) {
        try {

            Optional<VehicleEntry> optional = this.repository.findById(vehicle.getId());
            VehicleEntry vehicleEntry = optional.get();

            vehicleEntry.setStepEntry(StepVehicleEnum.Exit);
            vehicleEntry.setUserIdExit(vehicle.getUserIdExit());
            vehicleEntry.setUserNameExit(vehicle.getUserNameExit());
            vehicleEntry.setDateExit(vehicle.getDateExit());

            String message = this.validation.exit(vehicleEntry);
            if (message.equals(SUCCESS)) {
                this.repository.save(vehicleEntry);
            } else {
                throw new VehicleEntryException(message);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }

        return SUCCESS;
    }

    @SneakyThrows
    @Override
    public List<Object> allAuthorized() {

        List<Object> list = new ArrayList();

        try {
            List<VehicleEntry> vehicles = this.repository.allAuthorized();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            for (VehicleEntry item : vehicles) {
                long differenceMilliseconds = new Date().getTime() - item.getDateEntry().getTime();
                String placa = "";
                if (!item.getPlaca().isBlank())
                    placa = item.getPlaca().substring(0, 3) + "-" + item.getPlaca().substring(3, 7);

                Map<String, Object> map = new HashMap<>();
                map.put("id", item.getId());
                map.put("placa", placa);
                map.put("frota", item.getFrota());
                map.put("vehicleNew", item.getVehicleNew());
                map.put("modelDescription", item.getModelDescription());
                map.put("dateEntry", dateFormat.format(item.getDateEntry()));
                map.put("days", TimeUnit.DAYS.convert(differenceMilliseconds, TimeUnit.MILLISECONDS));
                map.put("nameUserAttendant", item.getNameUserAttendant());
                map.put("clientCompanyName", item.getClientCompanyName());
                map.put("budgetStatus", item.getBudgetStatus());
                map.put("statusAuthExit", item.getStatusAuthExit());
                list.add(map);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }

        return list;
    }

    @SneakyThrows
    @Override
    public List<Object> allPendingAuthorization() {
        List<Object> list = new ArrayList();

        try {
            List<VehicleEntry> vehicles = this.repository.allPendingAuthorization();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            for (VehicleEntry item : vehicles) {
                long differenceMilliseconds = new Date().getTime() - item.getDateEntry().getTime();
                String placa = "";
                if (!item.getPlaca().isBlank())
                    placa = item.getPlaca().substring(0, 3) + "-" + item.getPlaca().substring(3, 7);

                Map<String, Object> map = new HashMap<>();
                map.put("id", item.getId());
                map.put("placa", placa);
                map.put("frota", item.getFrota());
                map.put("vehicleNew", item.getVehicleNew());
                map.put("modelDescription", item.getModelDescription());
                map.put("dateEntry", dateFormat.format(item.getDateEntry()));
                map.put("days", TimeUnit.DAYS.convert(differenceMilliseconds, TimeUnit.MILLISECONDS));
                map.put("nameUserAttendant", item.getNameUserAttendant());
                map.put("clientCompanyName", item.getClientCompanyName());
                map.put("budgetStatus", item.getBudgetStatus());
                map.put("statusAuthExit", item.getStatusAuthExit());
                list.add(map);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }

        return list;
    }

    @SneakyThrows
    @Override
    public List<Object> allEntry() {
        List<Object> list = new ArrayList();

        try {
            List<VehicleEntry> vehicles = this.repository.findAll();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            for (VehicleEntry item : vehicles) {
                long differenceMilliseconds = new Date().getTime() - item.getDateEntry().getTime();
                String placa = "";
                if (!item.getPlaca().isBlank())
                    placa = item.getPlaca().substring(0, 3) + "-" + item.getPlaca().substring(3, 7);

                Map<String, Object> map = new HashMap<>();
                map.put("id", item.getId());
                map.put("placa", placa);
                map.put("frota", item.getFrota());
                map.put("vehicleNew", item.getVehicleNew());
                map.put("modelDescription", item.getModelDescription());
                map.put("dateEntry", dateFormat.format(item.getDateEntry()));
                map.put("days", TimeUnit.DAYS.convert(differenceMilliseconds, TimeUnit.MILLISECONDS));
                map.put("nameUserAttendant", item.getNameUserAttendant());
                map.put("clientCompanyName", item.getClientCompanyName());
                map.put("budgetStatus", item.getBudgetStatus());
                map.put("statusAuthExit", item.getStatusAuthExit());
                list.add(map);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }

        return list;
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterId(Integer id) {
        try {
            Optional<VehicleEntry> vehicle0 = repository.findById(id);
            if (vehicle0.isEmpty())
                return null;
            VehicleEntry vehicle = vehicle0.get();
            return this.loadObject(vehicle);
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterPlaca(String placa) {
        try {
            VehicleEntry vehicle = repository.findByPlaca(placa);
            if (vehicle == null)
                return null;

            return this.loadObject(vehicle);
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String NotExistsVehicle(String placa) {
        try {
            VehicleEntry vehicle = repository.findByNotExistsVehicle(placa);
            if (vehicle == null)
                return SUCCESS;
            throw new VehicleEntryException("Placa exists.");
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> addAuthExit(AuthExit authExit) {
        Map<String, Object> map = new HashMap<>();
        try {
            Optional<VehicleEntry> vehicle0 = this.repository.findById(authExit.idVehicle());
            if (vehicle0.isEmpty())
                throw new VehicleEntryException();
            VehicleEntry vehicle = vehicle0.get();
            String message = this.validation.addAuthExit(vehicle);

            if (message.equals(SUCCESS)) {
                if (vehicle.getIdUserExitAuth1() == null) {
                    vehicle.setIdUserExitAuth1(authExit.idUserExitAuth());
                    vehicle.setNameUserExitAuth1(authExit.nameUserExitAuth());
                    vehicle.setDateExitAuth1(new Date());
                    vehicle.setStatusAuthExit(statusAuthorization(vehicle));

                    this.repository.save(vehicle);

                    map.put("idVehicle", vehicle.getId());
                    map.put("idUserExitAuth", vehicle.getIdUserExitAuth1());
                    map.put("nameUserExitAuth", vehicle.getNameUserExitAuth1());
                    map.put("dateExitAuth", vehicle.getDateExitAuth1());
                    return map;
                } else if (vehicle.getIdUserExitAuth2() == null) {
                    vehicle.setIdUserExitAuth2(authExit.idUserExitAuth());
                    vehicle.setNameUserExitAuth2(authExit.nameUserExitAuth());
                    vehicle.setDateExitAuth2(new Date());
                    vehicle.setStatusAuthExit(statusAuthorization(vehicle));

                    this.repository.save(vehicle);

                    map.put("idVehicle", vehicle.getId());
                    map.put("idUserExitAuth", vehicle.getIdUserExitAuth2());
                    map.put("nameUserExitAuth", vehicle.getNameUserExitAuth2());
                    map.put("dateExitAuth", vehicle.getDateExitAuth2());
                    return map;
                }
            } else {
                throw new VehicleEntryException(message);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
        throw new VehicleEntryException("Vehicle already authorized.");
    }

    @SneakyThrows
    @Override
    public String deleteAuthExit1(AuthExit authExit) {
        try {
            Optional<VehicleEntry> vehicle0 = this.repository.findById(authExit.idVehicle());
            if (vehicle0.isEmpty())
                throw new VehicleEntryException();

            VehicleEntry vehicle = vehicle0.get();
            String message = this.validation.deleteAuthExit1(vehicle);
            if (message.equals(SUCCESS)) {
                vehicle.setIdUserExitAuth1(null);
                vehicle.setNameUserExitAuth1("");
                vehicle.setDateExitAuth1(null);
                vehicle.setStatusAuthExit(this.deleteAuthExit(vehicle.getStatusAuthExit()));

                this.repository.save(vehicle);
                return SUCCESS;
            } else {
                throw new VehicleEntryException(message);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String deleteAuthExit2(AuthExit authExit) {
        try {
            Optional<VehicleEntry> vehicle0 = this.repository.findById(authExit.idVehicle());
            if (vehicle0.isEmpty())
                throw new VehicleEntryException();

            VehicleEntry vehicle = vehicle0.get();
            String message = this.validation.deleteAuthExit2(vehicle);
            if (message.equals(SUCCESS)) {
                vehicle.setIdUserExitAuth2(null);
                vehicle.setNameUserExitAuth2("");
                vehicle.setDateExitAuth2(null);
                vehicle.setStatusAuthExit(this.deleteAuthExit(vehicle.getStatusAuthExit()));

                this.repository.save(vehicle);
                return SUCCESS;
            } else {
                throw new VehicleEntryException(message);
            }
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    private VehicleEntry loadVehicle(VehicleEntry vehicle) {

        if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0) {
            vehicle.setIdUserAttendant(null);
            vehicle.setNameUserAttendant("");
        }
        if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0) {
            vehicle.setClientCompanyId(null);
            vehicle.setClientCompanyName("");
            vehicle.setClientCompanyCnpj("");
            vehicle.setClientCompanyCpf("");
            vehicle.setClientCompanyRg("");
        }
        if (vehicle.getIdUserExitAuth1() == null || vehicle.getIdUserExitAuth1() == 0) {
            vehicle.setIdUserExitAuth1(null);
            vehicle.setNameUserExitAuth1("");
            vehicle.setDateExitAuth1(null);
        }
        if (vehicle.getIdUserExitAuth2() == null || vehicle.getIdUserExitAuth2() == 0) {
            vehicle.setIdUserExitAuth2(null);
            vehicle.setNameUserExitAuth2("");
            vehicle.setDateExitAuth2(null);
        }
        if (vehicle.getId() == null || vehicle.getId() == 0) {
            vehicle.setStatus(StatusVehicleEnum.entradaAutorizada);
            vehicle.setStepEntry(StepVehicleEnum.Attendant);
            vehicle.setBudgetStatus(StatusBudgetEnum.semOrcamento);
            vehicle.setStatusAuthExit(StatusAuthExitEnum.NotAuth);
        }

        return vehicle;
    }

    private StatusAuthExitEnum statusAuthorization(VehicleEntry vehicle) {
        if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.NotAuth) {
            return StatusAuthExitEnum.FirstAuth;
        } else if (vehicle.getStatusAuthExit() == StatusAuthExitEnum.FirstAuth) {
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

    private Map<String, Object> loadObject(VehicleEntry vehicle) {
        Map<String, Object> map = new HashMap<>();

        map.put("companyId", vehicle.getCompanyId());
        map.put("resaleId", vehicle.getResaleId());
        map.put("id", vehicle.getId());
        map.put("status", vehicle.getStatus());
        map.put("stepEntry", vehicle.getStepEntry());
        map.put("budgetStatus", vehicle.getBudgetStatus());
        map.put("idUserEntry", vehicle.getIdUserEntry());
        map.put("nameUserEntry", vehicle.getNameUserEntry());
        map.put("dateEntry", vehicle.getDateEntry());
        if (vehicle.getDatePrevisionExit() == null) {
            map.put("datePrevisionExit", "");
        } else {
            map.put("datePrevisionExit", vehicle.getDatePrevisionExit());
        }
        if (vehicle.getIdUserAttendant() == null) {
            map.put("idUserAttendant", 0);
        } else {
            map.put("idUserAttendant", vehicle.getIdUserAttendant());
        }
        map.put("nameUserAttendant", vehicle.getNameUserAttendant());
        if (vehicle.getIdUserExitAuth1() == null) {
            map.put("idUserExitAuth1", 0);
        } else {
            map.put("idUserExitAuth1", vehicle.getIdUserExitAuth1());
        }
        map.put("nameUserExitAuth1", vehicle.getNameUserExitAuth1());
        if (vehicle.getDateExitAuth1() == null) {
            map.put("dateExitAuth1", "");
        } else {
            map.put("dateExitAuth1", vehicle.getDateExitAuth1());
        }
        if (vehicle.getIdUserExitAuth2() == null) {
            map.put("idUserExitAuth2", 0);
        } else {
            map.put("idUserExitAuth2", vehicle.getIdUserExitAuth2());
        }
        map.put("nameUserExitAuth2", vehicle.getNameUserExitAuth2());
        if (vehicle.getDateExitAuth2() == null) {
            map.put("dateExitAuth2", "");
        } else {
            map.put("dateExitAuth2", vehicle.getDateExitAuth2());
        }
        map.put("statusAuthExit", vehicle.getStatusAuthExit());
        map.put("modelId", vehicle.getModelId());
        map.put("modelDescription", vehicle.getModelDescription());
        if (vehicle.getClientCompanyId() == null) {
            map.put("clientCompanyId", 0);
        } else {
            map.put("clientCompanyId", vehicle.getClientCompanyId());
        }
        map.put("clientCompanyName", vehicle.getClientCompanyName());
        map.put("clientCompanyCnpj", vehicle.getClientCompanyCnpj());
        map.put("clientCompanyCpf", vehicle.getClientCompanyCpf());
        map.put("clientCompanyRg", vehicle.getClientCompanyRg());

        map.put("driverEntryName", vehicle.getDriverEntryName());
        map.put("driverEntryCpf", vehicle.getDriverEntryCpf());
        if (vehicle.getDriverEntryRg() == null) {
            map.put("driverEntryRg", 0);
        } else {
            map.put("driverEntryRg", vehicle.getDriverEntryRg());
        }
        if (vehicle.getDriverEntryPhoto() == null) {
            map.put("driverEntryPhoto", "");
        } else {
            map.put("driverEntryPhoto", vehicle.getDriverEntryPhoto());
        }
        if (vehicle.getDriverEntrySignature() == null) {
            map.put("driverEntrySignature", "");
        } else {
            map.put("driverEntrySignature", vehicle.getDriverEntrySignature());
        }
        if (vehicle.getDriverEntryPhotoDoc1() == null) {
            map.put("driverEntryPhotoDoc1", "");
        } else {
            map.put("driverEntryPhotoDoc1", vehicle.getDriverEntryPhotoDoc1());
        }
        if (vehicle.getDriverEntryPhotoDoc2() == null) {
            map.put("driverEntryPhotoDoc2", "");
        } else {
            map.put("driverEntryPhotoDoc2", vehicle.getDriverEntryPhotoDoc2());
        }
        map.put("driverExitName", vehicle.getDriverExitName());
        map.put("driverExitCpf", vehicle.getDriverExitCpf());
        if (vehicle.getDriverExitRg() == null) {
            map.put("driverExitRg", "");
        } else {
            map.put("driverExitRg", vehicle.getDriverExitRg());
        }
        if (vehicle.getDriverExitPhoto() == null) {
            map.put("driverExitPhoto", "");
        } else {
            map.put("driverExitPhoto", vehicle.getDriverExitPhoto());
        }
        if (vehicle.getDriverExitSignature() == null) {
            map.put("driverExitSignature", "");
        } else {
            map.put("driverExitSignature", vehicle.getDriverExitSignature());
        }
        if (vehicle.getDriverExitPhotoDoc1() == null) {
            map.put("driverExitPhotoDoc1", "");
        } else {
            map.put("driverExitPhotoDoc1", vehicle.getDriverExitPhotoDoc1());
        }
        if (vehicle.getDriverExitPhotoDoc2() == null) {
            map.put("driverExitPhotoDoc2", "");
        } else {
            map.put("driverExitPhotoDoc2", vehicle.getDriverExitPhotoDoc2());
        }
        map.put("color", vehicle.getColor());
        map.put("placa", vehicle.getPlaca());
        map.put("frota", vehicle.getFrota());
        map.put("vehicleNew", vehicle.getVehicleNew());
        map.put("kmEntry", vehicle.getKmEntry());
        map.put("kmExit", vehicle.getKmExit());
        if (vehicle.getPhoto1() == null) {
            map.put("photo1", "");
        } else {
            map.put("photo1", vehicle.getPhoto1());
        }
        if (vehicle.getPhoto2() == null) {
            map.put("photo2", "");
        } else {
            map.put("photo2", vehicle.getPhoto2());
        }
        if (vehicle.getPhoto3() == null) {
            map.put("photo3", "");
        } else {
            map.put("photo3", vehicle.getPhoto3());
        }
        if (vehicle.getPhoto4() == null) {
            map.put("photo4", "");
        } else {
            map.put("photo4", vehicle.getPhoto4());
        }
        map.put("quantityExtinguisher", vehicle.getQuantityExtinguisher());
        map.put("quantityTrafficCone", vehicle.getQuantityTrafficCone());
        map.put("quantityTire", vehicle.getQuantityTire());
        map.put("quantityTireComplete", vehicle.getQuantityTireComplete());
        map.put("quantityToolBox", vehicle.getQuantityToolBox());
        map.put("serviceOrder", vehicle.getServiceOrder());
        map.put("numNfe", vehicle.getNumNfe());
        map.put("numNfse", vehicle.getNumNfse());
        map.put("information", vehicle.getInformation());
        map.put("informationConcierge", vehicle.getInformationConcierge());

        return map;
    }

}
