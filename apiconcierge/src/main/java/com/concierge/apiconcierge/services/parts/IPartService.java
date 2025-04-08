package com.concierge.apiconcierge.services.parts;

import com.concierge.apiconcierge.models.part.Part;

import java.util.List;

public interface IPartService {

    public Integer save(Part parts);

    public String update(Part parts);

    public List<Part> listAll(Integer companyId,Integer resaleId);

}
