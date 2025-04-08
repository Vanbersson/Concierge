package com.concierge.apiconcierge.services.parts;

import com.concierge.apiconcierge.exceptions.parts.PartsException;
import com.concierge.apiconcierge.models.part.Part;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.repositories.parts.IPartRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.parts.PartValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartService implements IPartService {
    private static final String SUCCESS = "Success.";
    @Autowired
    private IPartRepository repository;

    @Autowired
    private PartValidation validation;

    @SneakyThrows
    @Override
    public Integer save(Part part) {
        try {
            String message = this.validation.save(part);
            if (message.equals(SUCCESS)) {
                Part resultPart = this.repository.save(part);
                return resultPart.getId();
            } else {
                throw new PartsException(message);
            }
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(Part part) {
        try {
            String message = this.validation.update(part);
            if (message.equals(SUCCESS)) {
                this.repository.save(part);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new PartsException(message);
            }
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }

    @SneakyThrows
    public List<Part> listAll(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                return this.repository.listParts(companyId, resaleId);
            } else {
                throw new PartsException(message);
            }
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }


}
