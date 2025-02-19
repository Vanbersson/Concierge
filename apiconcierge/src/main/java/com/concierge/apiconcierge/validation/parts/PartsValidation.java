package com.concierge.apiconcierge.validation.parts;

import com.concierge.apiconcierge.models.parts.Parts;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class PartsValidation implements IPartsValidation{



    @Override
    public String save(Parts parts) {
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(Parts parts) {
        return ConstantsMessage.SUCCESS;
    }
}
