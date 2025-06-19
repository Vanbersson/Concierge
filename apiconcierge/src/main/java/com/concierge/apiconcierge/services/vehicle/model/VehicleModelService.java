package com.concierge.apiconcierge.services.vehicle.model;

import com.concierge.apiconcierge.exceptions.vehicle.VehicleModelException;
import com.concierge.apiconcierge.models.vehicle.model.VehicleModel;
import com.concierge.apiconcierge.repositories.vehicle.model.IVehicleModelRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.vehicle.model.VehicleModelValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class VehicleModelService implements IVehicleModelService {

    @Autowired
    IVehicleModelRepository repository;

    @Autowired
    VehicleModelValidation validation;

    @SneakyThrows
    @Override
    public Map<String, Object> save(VehicleModel mod) {
        try {
            String message = this.validation.save(mod);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                mod.setId(null);
                VehicleModel resultMod = this.repository.save(mod);

                Map<String, Object> map = new HashMap<>();
                map.put("id", resultMod.getId());
                return map;
            } else {
                throw new VehicleModelException(message);
            }
        } catch (Exception ex) {
            throw new VehicleModelException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(VehicleModel mod) {
        try {
            String message = this.validation.update(mod);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                VehicleModel resultMod = this.repository.save(mod);

                return ConstantsMessage.SUCCESS;
            } else {
                throw new VehicleModelException(message);
            }
        } catch (Exception ex) {
            throw new VehicleModelException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<VehicleModel> resultList = this.repository.listAll(companyId, resaleId);
                List<Map<String, Object>> list = new ArrayList<>();
                for (VehicleModel m : resultList) {
                    list.add(this.loadModel(m));
                }
                return list;
            } else {
                throw new VehicleModelException(message);
            }
        } catch (Exception ex) {
            throw new VehicleModelException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAllEnabled(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAllEnabled(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<VehicleModel> resultList = this.repository.listAllEnabled(companyId, resaleId);
                List<Map<String, Object>> list = new ArrayList<>();
                for (VehicleModel m : resultList) {
                    list.add(this.loadModel(m));
                }
                return list;
            } else {
                throw new VehicleModelException(message);
            }
        } catch (Exception ex) {
            throw new VehicleModelException(ex.getMessage());
        }
    }

    private Map<String, Object> loadModel(VehicleModel mod) {
        Map<String, Object> map = new HashMap<>();

        map.put("companyId", mod.getCompanyId());
        map.put("resaleId", mod.getId());
        map.put("id", mod.getId());
        map.put("status", mod.getStatus());
        map.put("description", mod.getDescription());
        if (mod.getPhoto() == null) {
            map.put("photo", "");
        } else {
            map.put("photo", mod.getPhoto());
        }
        return map;
    }
}
