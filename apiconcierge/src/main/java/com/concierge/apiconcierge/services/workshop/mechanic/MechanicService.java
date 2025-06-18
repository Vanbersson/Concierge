package com.concierge.apiconcierge.services.workshop.mechanic;

import com.concierge.apiconcierge.exceptions.workshop.mechanic.MechanicException;
import com.concierge.apiconcierge.models.workshop.mechanic.Mechanic;
import com.concierge.apiconcierge.repositories.workshop.mechanic.IMechanicRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.workshop.mechanic.MechanicValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MechanicService implements IMechanicService {

    @Autowired
    IMechanicRepository repository;

    @Autowired
    MechanicValidation validation;

    @SneakyThrows
    @Override
    public Map<String, Object> save(Mechanic mec) {
        try {
            String message = this.validation.save(mec);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                mec.setId(null);
                Mechanic resultMec = this.repository.save(mec);
                Map<String, Object> map = new HashMap<>();
                map.put("id", resultMec.getId());
                return map;
            } else {
                throw new MechanicException(message);
            }
        } catch (Exception ex) {
            throw new MechanicException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(Mechanic mec) {
        try {
            String message = this.validation.update(mec);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(mec);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new MechanicException(message);
            }
        } catch (Exception ex) {
            throw new MechanicException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<Mechanic> resultList = this.repository.listAll(companyId, resaleId);
                List<Map<String, Object>> mechanics = new ArrayList<>();
                for (Mechanic mec : resultList) {
                    mechanics.add(this.loadMec(mec));
                }
                return mechanics;
            } else {
                throw new MechanicException(message);
            }
        } catch (Exception ex) {
            throw new MechanicException(ex.getMessage());
        }
    }

    @Override
    public Map<String, Object> filterCodePass(Mechanic mec) {
        return null;
    }

    private Map<String, Object> loadMec(Mechanic mec) {
        Map<String, Object> map = new HashMap<>();
        map.put("companyId", mec.getCompanyId());
        map.put("resaleId", mec.getResaleId());
        map.put("id", mec.getId());
        map.put("status", mec.getStatus());
        map.put("name", mec.getName());
        map.put("codePassword", mec.getCodePassword());
        if (mec.getPhoto() == null) {
            map.put("photo", "");
        } else {
            map.put("photo", mec.getPhoto());
        }
        return map;
    }

}
