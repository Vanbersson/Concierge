package com.concierge.apiconcierge.controllers.vehicle;

import com.concierge.apiconcierge.dtos.UpdateStatusDto;
import com.concierge.apiconcierge.dtos.vehicle.VehicleModelDto;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.vehicle.VehicleModel;
import com.concierge.apiconcierge.repositories.vehicle.VehicleModelIRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vehicle/model")
public class VehicleModelController {

    @Autowired
    VehicleModelIRepository vehicleModelIRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveModel(@RequestBody @Valid VehicleModelDto data) {

        VehicleModel model = new VehicleModel();
        BeanUtils.copyProperties(data, model);

        this.vehicleModelIRepository.save(model);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateModel(@RequestBody @Valid VehicleModelDto data) {

        Optional<VehicleModel> model0 = this.vehicleModelIRepository.findById(data.id());

        if (model0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        VehicleModel model = new VehicleModel();
        BeanUtils.copyProperties(data, model);

        this.vehicleModelIRepository.save(model);

        return ResponseEntity.ok().build();

    }

    @PostMapping("/update/status")
    public ResponseEntity<Object> updateStatus(@RequestBody @Valid UpdateStatusDto data) {

        Optional<VehicleModel> model0 = vehicleModelIRepository.findById(data.id());
        if (model0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        VehicleModel model = model0.get();

        if(model.getStatus() == StatusEnableDisable.ativo){
            model.setStatus(StatusEnableDisable.inativo);
        }else{
            model.setStatus(StatusEnableDisable.ativo);
        }

        this.vehicleModelIRepository.save(model);

        return ResponseEntity.ok().build();

    }

    @GetMapping("/all")
    public ResponseEntity<List<VehicleModel>> getAll() {
        List<VehicleModel> list = this.vehicleModelIRepository.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/all/enabled")
    public ResponseEntity<List<VehicleModel>> getAllEnabled() {

        List<VehicleModel> list = this.vehicleModelIRepository.listAllEnabled();

        return ResponseEntity.ok(list);

    }

}
