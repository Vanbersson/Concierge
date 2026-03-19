package com.concierge.apiconcierge.services.parts;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.part.Part;
import com.concierge.apiconcierge.services.parts.interfaces.IPartListAll;

import java.util.List;
import java.util.Map;

public interface IPartService {

    public MessageResponse save(Part part);

    public MessageResponse update(Part part);

    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId);

}
