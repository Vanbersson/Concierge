package com.concierge.apiconcierge.controllers.version1.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.AuthExit;
import com.concierge.apiconcierge.dtos.vehicle.VehicleEntryDto;
import com.concierge.apiconcierge.models.vehicle.Vehicle;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import com.concierge.apiconcierge.repositories.vehicle.VehicleEntryIRepository;
import com.concierge.apiconcierge.repositories.vehicle.VehicleEntryRepository;
import jakarta.validation.Valid;
import lombok.SneakyThrows;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/v1/{companyid}/{resaleid}/vehicleEntry")
public class VehicleEntryController {

    @Autowired
    VehicleEntryIRepository vehicleEntryIRepository;

    @Autowired
    VehicleEntryRepository vehicleRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveVehicle(@RequestBody @Valid VehicleEntryDto data) {

        VehicleEntry vehicleEntry = new VehicleEntry();
        BeanUtils.copyProperties(data, vehicleEntry);

        if (data.vehicleNew().equals(VehicleYesNotEnum.yes)) {
            vehicleEntry.setPlaca("");
        }

        if (data.vehicleNew().equals(VehicleYesNotEnum.not) && data.id() == null) {
            VehicleEntry vehicle = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndPlaca(data.companyId(), data.resaleId(), data.placa());

            if (vehicle != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Placa already exists.");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleEntryIRepository.save(vehicleEntry));
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateVehicle(@RequestBody @Valid VehicleEntryDto data) {

        VehicleEntry vehicleEntry = new VehicleEntry();
        BeanUtils.copyProperties(data, vehicleEntry);

        if (data.vehicleNew().equals(VehicleYesNotEnum.yes)) {
            vehicleEntry.setPlaca("");
        }

        return ResponseEntity.status(HttpStatus.OK).body(vehicleEntryIRepository.save(vehicleEntry));
    }

    @GetMapping("/all")
    public ResponseEntity<List<VehicleEntry>> listAll(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<VehicleEntry> list = vehicleEntryIRepository.findByCompanyIdAndResaleId(companyId, resaleId);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/listEntry")
    public ResponseEntity<List<VehicleEntry>> listEntry(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<VehicleEntry> list = vehicleRepository.getListEntry(companyId, resaleId);

        return ResponseEntity.ok(list);
    }

    @GetMapping("filter/id/{id}")
    public ResponseEntity<VehicleEntry> getId(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId,
            @PathVariable(name = "id") Integer id) {

        VehicleEntry vehicle = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndId(companyId, resaleId, id);

        if (vehicle == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("filter/placa/{placa}")
    public ResponseEntity<VehicleEntry> getPlaca(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId,
            @PathVariable(name = "placa") String placa) {

        VehicleEntry vehicle = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndPlaca(companyId, resaleId, placa);

        if (vehicle == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(vehicle);
    }

    @PostMapping("add/authorization")
    public ResponseEntity<String> addAuthorizationExit(@RequestBody @Valid AuthExit data) {
        VehicleEntry vehicle = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());


        String mensagem = validAuthorization(vehicle);

        if (mensagem != "Authorized") {
            return ResponseEntity.ok(mensagem);
        }

        mensagem = "Not authorized.";

        if (vehicle.getIdUserExitAuth1() == null) {
            vehicle.setIdUserExitAuth1(data.idUserExitAuth());
            vehicle.setNameUserExitAuth1(data.nameUserExitAuth());
            vehicle.setDateExitAuth1(new Date());

            mensagem = "Success.";

        } else if (vehicle.getIdUserExitAuth2() == null) {
            vehicle.setIdUserExitAuth2(data.idUserExitAuth());
            vehicle.setNameUserExitAuth2(data.nameUserExitAuth());
            vehicle.setDateExitAuth2(new Date());
            mensagem = "Success.";
        }

        //Status Authorization exit
        vehicle.setStatusAuthExit(statusAuthorization(vehicle));

        vehicleEntryIRepository.save(vehicle);

        return ResponseEntity.ok(mensagem);
    }

    @PostMapping("delete/authorization1")
    public ResponseEntity<String> deleteAuthorizationExit1(@RequestBody @Valid AuthExit data) {

        VehicleEntry vehicle = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (vehicle.getIdUserExitAuth1().equals(data.idUserExitAuth())) {
            vehicle.setIdUserExitAuth1(null);
            vehicle.setNameUserExitAuth1("");
            vehicle.setDateExitAuth1(null);

            //Status Authorization exit
            vehicle.setStatusAuthExit(statusAuthorization(vehicle));

            vehicleEntryIRepository.save(vehicle);
            return ResponseEntity.ok("Success.");
        }

        return ResponseEntity.ok("Not delete.");
    }

    @PostMapping("delete/authorization2")
    public ResponseEntity<String> deleteAuthorizationExit2(@RequestBody @Valid AuthExit data) {

        VehicleEntry vehicle = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (vehicle.getIdUserExitAuth2() == data.idUserExitAuth()) {
            vehicle.setIdUserExitAuth2(null);
            vehicle.setNameUserExitAuth2("");
            vehicle.setDateExitAuth2(null);

            //Status Authorization exit
            vehicle.setStatusAuthExit(statusAuthorization(vehicle));

            vehicleEntryIRepository.save(vehicle);
            return ResponseEntity.ok("Success.");
        }

        return ResponseEntity.ok("Not delete.");
    }

    private StatusAuthExitEnum statusAuthorization(VehicleEntry vehicle) {

        if (vehicle.getIdUserExitAuth1() != null && vehicle.getIdUserExitAuth2() == null) {
            vehicle.setStatusAuthExit(StatusAuthExitEnum.FirstAuth);
        }

        if (vehicle.getIdUserExitAuth1() == null && vehicle.getIdUserExitAuth2() != null) {
            vehicle.setStatusAuthExit(StatusAuthExitEnum.FirstAuth);
        }

        if (vehicle.getIdUserExitAuth2() == null && vehicle.getIdUserExitAuth1() == null) {
            vehicle.setStatusAuthExit(StatusAuthExitEnum.NotAuth);
        }

        if (vehicle.getIdUserExitAuth2() != null && vehicle.getIdUserExitAuth1() != null) {
            vehicle.setStatusAuthExit(StatusAuthExitEnum.Authorized);
        }

        return vehicle.getStatusAuthExit();
    }

    private String validAuthorization(VehicleEntry vehicle) {

        if (vehicle.getClientCompanyId() == 1) {
            return "ClientCompany";
        }
        if (vehicle.getIdUserAttendant() == null || vehicle.getNameUserAttendant().equals("falta")) {
            return "UserAttendant";
        }

        //Driver entry
        if (vehicle.getDriverEntryName().isEmpty() && vehicle.getDriverEntryCpf().isEmpty() && vehicle.getDriverEntryRg().isEmpty()) {
            return "Driver";
        }
        if (vehicle.getDriverEntryName().isEmpty() && !vehicle.getDriverEntryCpf().isEmpty() && !vehicle.getDriverEntryRg().isEmpty()) {
            return "Driver";
        }
        if (!vehicle.getDriverEntryName().isEmpty() && vehicle.getDriverEntryCpf().isEmpty() && vehicle.getDriverEntryRg().isEmpty()) {
            return "Driver";
        }
        if (vehicle.getDriverEntryName().isEmpty() && vehicle.getDriverEntryCpf().isEmpty() && !vehicle.getDriverEntryRg().isEmpty()) {
            return "Driver";
        }
        if (vehicle.getDriverEntryName().isEmpty() && !vehicle.getDriverEntryCpf().isEmpty() && vehicle.getDriverEntryRg().isEmpty()) {
            return "Driver";
        }

        //Driver Exit
        if (vehicle.getDriverExitName().isEmpty() && vehicle.getDriverExitCpf().isEmpty() && vehicle.getDriverExitRg().isEmpty()) {
            return "Driver";
        }
        if (vehicle.getDriverExitName().isEmpty() && !vehicle.getDriverExitCpf().isEmpty() && !vehicle.getDriverExitRg().isEmpty()) {
            return "Driver";
        }
        if (!vehicle.getDriverExitName().isEmpty() && vehicle.getDriverExitCpf().isEmpty() && vehicle.getDriverExitRg().isEmpty()) {
            return "Driver";
        }
        if (vehicle.getDriverExitName().isEmpty() && vehicle.getDriverExitCpf().isEmpty() && !vehicle.getDriverExitRg().isEmpty()) {
            return "Driver";
        }
        if (vehicle.getDriverExitName().isEmpty() && !vehicle.getDriverExitCpf().isEmpty() && vehicle.getDriverExitRg().isEmpty()) {
            return "Driver";
        }

        return "Authorized";

    }
}
