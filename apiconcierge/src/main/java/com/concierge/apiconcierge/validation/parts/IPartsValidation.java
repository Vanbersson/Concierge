package com.concierge.apiconcierge.validation.parts;

import com.concierge.apiconcierge.models.parts.Parts;

public interface IPartsValidation {

    public String save(Parts parts);
    public String update(Parts parts);
}
