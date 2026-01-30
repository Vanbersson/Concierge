package com.concierge.apiconcierge.services.driver;

import com.concierge.apiconcierge.exceptions.driver.DriverException;
import com.concierge.apiconcierge.models.driver.Driver;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
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
    public MessageResponse save(Driver driver) {
        try {
            MessageResponse response = this.validation.save(driver);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                driver.setId(null);
                driver.setDateRegister(new Date());
                Driver result = this.repository.save(driver);
                response.setData(result);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse update(Driver driver) {
        try {
            MessageResponse response = this.validation.update(driver);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                this.repository.save(driver);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse listAll(Integer companyId, Integer resaleId) {
        try {
            MessageResponse response = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
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
                response.setData(list);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterDriverId(Integer companyId, Integer resaleId, Integer driverId) {
        try {
            MessageResponse response = this.validation.filterDriverId(companyId, resaleId, driverId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                Driver result = this.repository.filterId(companyId, resaleId, driverId);
                response.setData(result);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterDriverCPF(Integer companyId, Integer resaleId, String cpf) {
        try {
            MessageResponse response = this.validation.filterDriverCPF(companyId, resaleId, cpf);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                Driver result = this.repository.filterCPF(companyId, resaleId, cpf);
                response.setData(result);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterDriverRG(Integer companyId, Integer resaleId, String rg) {
        try {
            MessageResponse response = this.validation.filterDriverRG(companyId, resaleId, rg);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                Driver result = this.repository.filterRG(companyId, resaleId, rg);
                response.setData(result);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterDriverName(Integer companyId, Integer resaleId, String name) {
        try {
            MessageResponse response = this.validation.filterDriverName(companyId, resaleId, name);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<Driver> result = this.repository.filterName(companyId, resaleId, name);
                response.setData(result);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterDriverCNHRegister(Integer companyId, Integer resaleId, String cnhRegister) {
        try {
            MessageResponse response = this.validation.filterDriverCNHRegister(companyId, resaleId, cnhRegister);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                Driver result = this.repository.filterCNHRegister(companyId, resaleId, cnhRegister);
                response.setData(result);
            }
            return response;
        } catch (Exception e) {
            throw new DriverException(e.getMessage());
        }
    }

}
