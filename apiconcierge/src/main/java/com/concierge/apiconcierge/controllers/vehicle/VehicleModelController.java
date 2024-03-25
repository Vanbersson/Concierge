package com.concierge.apiconcierge.controllers.vehicle;

import com.concierge.apiconcierge.dtos.UpdateStatusDto;
import com.concierge.apiconcierge.dtos.vehicle.VehicleModelDto;
import com.concierge.apiconcierge.models.vehicle.VehicleModel;
import com.concierge.apiconcierge.repositories.vehicle.VehicleModelRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle/model")
public class VehicleModelController {

    @Autowired
    VehicleModelRepository vehicleModelRepository;


    @PostMapping("/add")
    public ResponseEntity<Object> addModel(@RequestBody @Valid VehicleModelDto data) {

        VehicleModel model = new VehicleModel();
        BeanUtils.copyProperties(data, model);

        model.setId(0);

        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleModelRepository.save(model));
    }

    @PostMapping("/update")
    public ResponseEntity updateModel(@RequestBody @Valid VehicleModelDto data) {

        VehicleModel model = vehicleModelRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (model == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        BeanUtils.copyProperties(data,model);

        return ResponseEntity.ok(vehicleModelRepository.save(model));

    }

    @PostMapping("/update/status")
    public ResponseEntity updateStatus(@RequestBody @Valid UpdateStatusDto data) {

        VehicleModel model = vehicleModelRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (model == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        model.setStatus(data.status());

        return ResponseEntity.ok(vehicleModelRepository.save(model));

    }

    @GetMapping("/all/{companyid}/{resaleid}")
    public ResponseEntity<List<VehicleModel>> allModels(@PathVariable(name = "companyid") Integer companyId, @PathVariable(name = "resaleid") Integer resaleId) {

        return ResponseEntity.ok(vehicleModelRepository.findByCompanyIdAndResaleId(companyId, resaleId));

    }

}
