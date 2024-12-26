package com.concierge.apiconcierge.services.parts;

import com.concierge.apiconcierge.models.parts.Parts;

import java.util.List;

public interface IPartsService {

    public Integer save(Parts parts);

    public Object update(Parts parts);

    public List<Parts> filterAll();

}
