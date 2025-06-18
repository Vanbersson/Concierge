package com.concierge.apiconcierge.controllers.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.VehicleModelDto;
import com.concierge.apiconcierge.models.vehicle.VehicleModel;
import com.concierge.apiconcierge.repositories.vehicle.model.IVehicleModelRepository;
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
    IVehicleModelRepository IVehicleModelRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveModel(@RequestBody VehicleModelDto data) {

        VehicleModel model = new VehicleModel();
        BeanUtils.copyProperties(data, model);

        this.IVehicleModelRepository.save(model);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateModel(@RequestBody VehicleModelDto data) {

        Optional<VehicleModel> model0 = this.IVehicleModelRepository.findById(data.id());

        if (model0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        VehicleModel model = new VehicleModel();
        BeanUtils.copyProperties(data, model);

        this.IVehicleModelRepository.save(model);

        return ResponseEntity.ok().build();

    }

    @GetMapping("/all")
    public ResponseEntity<List<VehicleModel>> getAll() {
        List<VehicleModel> list = this.IVehicleModelRepository.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/all/enabled")
    public ResponseEntity<List<VehicleModel>> getAllEnabled() {

        List<VehicleModel> list = this.IVehicleModelRepository.listAllEnabled();

        return ResponseEntity.ok(list);
    }

}
