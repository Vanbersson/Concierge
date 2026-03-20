package com.concierge.apiconcierge.services.parts;

import com.concierge.apiconcierge.exceptions.parts.PartsException;
import com.concierge.apiconcierge.models.enums.StatusEnableDisable;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.part.Part;
import com.concierge.apiconcierge.repositories.parts.IPartRepository;
import com.concierge.apiconcierge.services.parts.interfaces.IPartListAll;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.parts.IPartValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PartService implements IPartService {
    @Autowired
    private IPartRepository repository;
    @Autowired
    private IPartValidation validation;

    @SneakyThrows
    @Override
    public MessageResponse save(Part part) {
        try {
            MessageResponse response = this.validation.save(part);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                part.setId(null);
                part.setDateRegister(new Date());
                Part resultPart = this.repository.save(part);
                response.setData(resultPart);
            }
            return response;
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse update(Part part) {
        try {
            MessageResponse response = this.validation.update(part);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                Part resultPart = this.repository.save(part);
                response.setData(resultPart);
            }
            return response;
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }

    @SneakyThrows
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        try {
            MessageResponse response = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<IPartListAll> list = this.repository.listAll(companyId, resaleId);
                List<Map<String, Object>> maps = new ArrayList<>();
                for (IPartListAll i : list) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", i.getId());
                    map.put("status", i.getStatus() == 0 ? StatusEnableDisable.Habilitado : StatusEnableDisable.Desabilitado);
                    map.put("code", i.getCode());
                    map.put("description", i.getDescription());
                    map.put("brand", i.getBrand());
                    map.put("group", i.getGroup());
                    map.put("category", i.getCategory());
                    maps.add(map);
                }
                return maps;
            }
            return List.of();
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer id) {
        try {
            MessageResponse response = this.validation.filterId(companyId, resaleId, id);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                Part result = this.repository.filterId(companyId, resaleId, id);
                response.setData(result);
            }
            return response;
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }


}
