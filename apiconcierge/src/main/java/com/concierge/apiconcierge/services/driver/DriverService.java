package com.concierge.apiconcierge.services.driver;

import com.concierge.apiconcierge.exceptions.driver.DriverException;
import com.concierge.apiconcierge.models.driver.Driver;
import com.concierge.apiconcierge.repositories.driver.IDriverRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.driver.IDriverValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DriverService implements IDriverService {

    @Autowired
    IDriverRepository repository;

    @Autowired
    IDriverValidation validation;

    @SneakyThrows
    @Override
    public Map<String, Object> save(Driver driver) {
        try {
            String message = this.validation.save(driver);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                driver.setId(null);
                driver.setDateRegister(new Date());
                Driver result = this.repository.save(driver);
                return this.load(result);
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(Driver driver) {
        try {
            String message = this.validation.update(driver);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(driver);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<Driver> result = this.repository.listAll(companyId, resaleId);

                List<Map<String, Object>> list = new ArrayList<>();
                for (Driver driver : result) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", driver.getId());
                    map.put("status", driver.getStatus());
                    map.put("name", driver.getName());
                    map.put("cpf", driver.getCpf());
                    map.put("rg", driver.getRg());
                    map.put("cnhCategory", driver.getCnhCategory());
                    list.add(map);
                }
                return list;
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterDriverId(Integer companyId, Integer resaleId, Integer driverId) {
        try {
            String message = this.validation.filterDriverId(companyId, resaleId, driverId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                Driver result = this.repository.filterId(companyId, resaleId, driverId);
                return this.load(result);
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterDriverCPF(Integer companyId, Integer resaleId, String cpf) {
        try {
            String message = this.validation.filterDriverCPF(companyId, resaleId, cpf);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                Driver result = this.repository.filterCPF(companyId, resaleId, cpf);
                return this.load(result);
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterDriverRG(Integer companyId, Integer resaleId, String rg) {
        try {
            String message = this.validation.filterDriverRG(companyId, resaleId, rg);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                Driver result = this.repository.filterRG(companyId, resaleId, rg);
                return this.load(result);
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> filterDriverName(Integer companyId, Integer resaleId, String name){
        try {
            String message = this.validation.filterDriverName(companyId, resaleId, name);
            if (ConstantsMessage.SUCCESS.equals(message)) {
               List<Driver>  result = this.repository.filterName(companyId, resaleId, name);
                List<Map<String, Object>> list = new ArrayList<>();
                for(Driver driver: result){
                    list.add(this.load(driver));
                }
                return list;
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }
    @SneakyThrows
    @Override
    public Map<String, Object> filterDriverCNHRegister(Integer companyId, Integer resaleId, String cnhRegister){
        try {
            String message = this.validation.filterDriverCNHRegister(companyId, resaleId, cnhRegister);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                Driver result = this.repository.filterCNHRegister(companyId, resaleId, cnhRegister);
                return this.load(result);
            } else {
                throw new DriverException(message);
            }
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    private Map<String, Object> load(Driver driver) {
        Map<String, Object> map = new HashMap<>();
        map.put("companyId", driver.getCompanyId());
        map.put("resaleId", driver.getResaleId());
        map.put("id", driver.getId());
        map.put("status", driver.getStatus());
        map.put("name", driver.getName());
        map.put("cpf", driver.getCpf());
        map.put("rg", driver.getRg());
        map.put("maleFemale", driver.getMaleFemale());
        map.put("dateBirth", driver.getDateBirth());
        map.put("cnhRegister", driver.getCnhRegister());
        map.put("cnhCategory", driver.getCnhCategory());
        map.put("cnhValidation", driver.getCnhValidation());
        map.put("email", driver.getEmail());
        map.put("dddPhone", driver.getDddPhone());
        map.put("phone", driver.getPhone());
        map.put("dddCellphone", driver.getDddCellphone());
        map.put("cellphone", driver.getCellphone());
        map.put("zipCode", driver.getZipCode());
        map.put("address", driver.getAddress());
        map.put("addressNumber", driver.getAddressNumber());
        map.put("state", driver.getState());
        map.put("city", driver.getCity());
        map.put("neighborhood", driver.getNeighborhood());
        map.put("addressComplement", driver.getAddressComplement());
        map.put("userId", driver.getUserId());
        map.put("userName", driver.getUserName());
        map.put("dateRegister", driver.getDateRegister());
        if (driver.getPhotoDriver() == null) {
            map.put("photoDriver", "");
        } else {
            map.put("photoDriver", driver.getPhotoDriver());
        }
        if(driver.getPhotoDoc1() == null){
            map.put("photoDoc1", "");
        }else{
            map.put("photoDoc1", driver.getPhotoDoc1());
        }
        if(driver.getPhotoDoc2() == null){
            map.put("photoDoc2", "");
        }else{
            map.put("photoDoc2", driver.getPhotoDoc2());
        }
        return map;
    }
}
