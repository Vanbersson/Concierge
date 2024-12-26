package com.concierge.apiconcierge.services.parts;

import com.concierge.apiconcierge.exceptions.parts.PartsException;
import com.concierge.apiconcierge.models.parts.Parts;
import com.concierge.apiconcierge.repositories.parts.IPartsRepository;
import com.concierge.apiconcierge.validation.parts.PartsValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartsService implements IPartsService {
    private static final String SUCCESS = "success.";
    @Autowired
    private IPartsRepository repository;

    @Autowired
    private PartsValidation validation;

    @SneakyThrows
    @Override
    public Integer save(Parts parts) {
        Parts part;
        try {
            String message = this.validation.save(parts);
            if (message.equals(SUCCESS)) {
                part = this.repository.save(parts);
                return part.getId();
            } else {
                throw new PartsException(message);
            }
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public Object update(Parts parts) {
        try {
            String message = this.validation.update(parts);
            if (message.equals(SUCCESS)) {
                return this.repository.save(parts);
            } else {
                throw new PartsException(message);
            }
        } catch (Exception ex) {
            throw new PartsException(ex.getMessage());
        }
    }

    public List<Parts> filterAll() {
        return this.repository.findAll();
    }


}
