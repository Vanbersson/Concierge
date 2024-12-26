package com.concierge.apiconcierge.validation.parts;

import com.concierge.apiconcierge.models.parts.Parts;
import org.springframework.stereotype.Service;

@Service
public class PartsValidation implements IPartsValidation{

    private static final String SUCCESS = "success.";

    @Override
    public String save(Parts parts) {
        return SUCCESS;
    }

    @Override
    public String update(Parts parts) {
        return SUCCESS;
    }
}
