package com.concierge.apiconcierge.controllers.vehicle;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateVehicle(@RequestBody VehicleEntryDto data) {
        try {
            VehicleEntry vehicleEntry = new VehicleEntry();
            BeanUtils.copyProperties(data, vehicleEntry);
            String message = this.service.update(vehicleEntry);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/exit")
    public ResponseEntity<Object> confirmationExit(@RequestBody VehicleExitSaveDto data) {
        try {
            String message = this.service.exit(data);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/allAuthorized")
    public ResponseEntity<Object> allAuthorized(@PathVariable(name = "companyId") Integer companyId,
                                                @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            return ResponseEntity.ok(this.service.allAuthorized(companyId, resaleId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/allPendingAuthorization")
    public ResponseEntity<Object> allPendingAuthorization(@PathVariable(name = "companyId") Integer companyId,
                                                          @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            return ResponseEntity.ok(this.service.allPendingAuthorization(companyId, resaleId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/id/{id}")
    public ResponseEntity<Object> getId(@PathVariable(name = "companyId") Integer companyId,
                                        @PathVariable(name = "resaleId") Integer resaleId,
                                        @PathVariable(name = "id") Integer id) {
        try {
            Map<String, Object> vehicle = this.service.filterId(companyId, resaleId, id);
            if (vehicle == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            return ResponseEntity.ok(vehicle);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/placa/{placa}")
    public ResponseEntity<Object> getPlaca(@PathVariable(name = "companyId") Integer companyId,
                                           @PathVariable(name = "resaleId") Integer resaleId,
                                           @PathVariable(name = "placa") String placa) {
        try {
            Map<String, Object> vehicle = this.service.filterPlaca(companyId, resaleId, placa);
            if (vehicle == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            return ResponseEntity.ok(vehicle);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/filter/exists/placa")
    public ResponseEntity<Object> existsPlaca(@RequestBody ExistsPlacaDto data) {
        try {
            String message = this.service.existsPlaca(data);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/authorization/add")
    public ResponseEntity<Object> addAuthorizationExit(@RequestBody AuthExit data) {
        try {
            Map<String, Object> map = this.service.addAuthExit(data);
            return ResponseEntity.status(HttpStatus.OK).body(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/authorization/delete1")
    public ResponseEntity<Object> deleteAuthorizationExit1(@RequestBody AuthExit data) {
        try {
            String result = this.service.deleteAuthExit1(data);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(result));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/authorization/delete2")
    public ResponseEntity<Object> deleteAuthorizationExit2(@RequestBody AuthExit data) {
        try {
            String result = this.service.deleteAuthExit2(data);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(result));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

}
