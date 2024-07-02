package com.concierge.apiconcierge.controllers.version1.vehicle;

import com.concierge.apiconcierge.dtos.UpdateStatusDto;
import com.concierge.apiconcierge.dtos.vehicle.VehicleModelDto;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.vehicle.VehicleModel;
import com.concierge.apiconcierge.repositories.vehicle.VehicleModelIRepository;
import com.concierge.apiconcierge.repositories.vehicle.VehicleModelRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/{companyid}/{resaleid}/vehicle/model")
public class VehicleModelController {

    @Autowired
    VehicleModelIRepository vehicleModelIRepository;

    @Autowired
    VehicleModelRepository modelRepository;


    @PostMapping("/add")
    public ResponseEntity<Object> addModel(@PathVariable(name = "companyid") Integer companyId,
                                           @PathVariable(name = "resaleid") Integer resaleId,
                                           @RequestBody @Valid VehicleModelDto data) {

        VehicleModel model = new VehicleModel();
        BeanUtils.copyProperties(data, model);

        model.setId(0);

        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleModelIRepository.save(model));
    }

    @PostMapping("/update")
    public ResponseEntity updateModel(@RequestBody @Valid VehicleModelDto data) {

        VehicleModel model = vehicleModelIRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (model == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        BeanUtils.copyProperties(data, model);

        return ResponseEntity.ok(vehicleModelIRepository.save(model));

    }

    @PostMapping("/update/status")
    public ResponseEntity updateStatus(@PathVariable(name = "companyid") Integer companyId,
                                       @PathVariable(name = "resaleid") Integer resaleId,
                                       @RequestBody @Valid UpdateStatusDto data) {

        VehicleModel model = vehicleModelIRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (model == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        model.setStatus(data.status());

        return ResponseEntity.ok(vehicleModelIRepository.save(model));

    }

    @GetMapping("/all")
    public ResponseEntity<List<VehicleModel>> getAll(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        return ResponseEntity.ok(vehicleModelIRepository.findByCompanyIdAndResaleId(companyId, resaleId));

    }

    @GetMapping("/all/enabled")
    public ResponseEntity<List<VehicleModel>> allModelsEnabled(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        // List<VehicleModel> list = modelRepository.listAllEnabled(companyId, resaleId);
        List<VehicleModel> list = vehicleModelIRepository.findByCompanyIdAndResaleIdAndStatus(companyId, resaleId, StatusEnableDisable.ativo);
        return ResponseEntity.ok(list);

    }

}
