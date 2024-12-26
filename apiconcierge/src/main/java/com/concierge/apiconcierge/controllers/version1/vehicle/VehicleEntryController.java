package com.concierge.apiconcierge.controllers.version1.vehicle;

import com.concierge.apiconcierge.dtos.MessageErrorDto;
import com.concierge.apiconcierge.dtos.vehicle.*;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.services.vehicle.VehicleEntryService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/vehicle/entry")
public class VehicleEntryController {

    @Autowired
    private VehicleEntryService service;

    @PostMapping("/save")
    public ResponseEntity<Object> saveVehicle(@RequestBody VehicleEntrySaveDto data) {
        try {
            VehicleEntry vehicleEntry = new VehicleEntry();
            BeanUtils.copyProperties(data, vehicleEntry);

            Integer id = this.service.save(vehicleEntry);
            Map<String, Object> map = new HashMap<>();
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(map);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateVehicle(@RequestBody VehicleEntryDto data) {
        try {
            VehicleEntry vehicleEntry = new VehicleEntry();
            BeanUtils.copyProperties(data, vehicleEntry);
            boolean result = this.service.update(vehicleEntry);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @PostMapping("/exit")
    public ResponseEntity<Object> confirmationExit(@RequestBody VehicleEntryDto data) {
        try {
            VehicleEntry vehicle = new VehicleEntry();
            BeanUtils.copyProperties(data, vehicle);
            String result = this.service.exit(vehicle);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @GetMapping("/allAuthorized")
    public ResponseEntity<Object> allAuthorized() {
        try {
            return ResponseEntity.ok(this.service.allAuthorized());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @GetMapping("/allPendingAuthorization")
    public ResponseEntity<Object> allPendingAuthorization() {
        try {
            return ResponseEntity.ok(this.service.allPendingAuthorization());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/id/{id}")
    public ResponseEntity<Object> getId(@PathVariable(name = "id") Integer id) {
        try {
            Map<String, Object> vehicle = this.service.filterId(id);
            if (vehicle == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            return ResponseEntity.ok(vehicle);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/placa/{placa}")
    public ResponseEntity<Object> getPlaca(@PathVariable(name = "placa") String placa) {
        try {
            Map<String, Object> vehicle = this.service.filterPlaca(placa);
            if (vehicle == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            return ResponseEntity.ok(vehicle);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/notexists/placa/{placa}")
    public ResponseEntity<Object> notExistsVehicle(@PathVariable(name = "placa") String placa) {
        try {
            String message = this.service.NotExistsVehicle(placa);
            return ResponseEntity.ok(message);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @PostMapping("/authorization/add")
    public ResponseEntity<Object> addAuthorizationExit(@RequestBody @Valid AuthExit data) {
        try {
            Map<String, Object> map = this.service.addAuthExit(data);
            return ResponseEntity.ok(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @PostMapping("/authorization/delete1")
    public ResponseEntity<Object> deleteAuthorizationExit1(@RequestBody @Valid AuthExit data) {
        try {
            String result = this.service.deleteAuthExit1(data);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @PostMapping("/authorization/delete2")
    public ResponseEntity<Object> deleteAuthorizationExit2(@RequestBody @Valid AuthExit data) {
        try {
            String result = this.service.deleteAuthExit2(data);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

}
