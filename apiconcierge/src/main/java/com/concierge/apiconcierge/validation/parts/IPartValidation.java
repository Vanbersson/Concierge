package com.concierge.apiconcierge.validation.parts;

import com.concierge.apiconcierge.models.part.Part;

import java.util.List;

public interface IPartValidation {

    public String save(Part part);
    public String update(Part part);
    public String listAll(Integer companyId, Integer resaleId);
}
