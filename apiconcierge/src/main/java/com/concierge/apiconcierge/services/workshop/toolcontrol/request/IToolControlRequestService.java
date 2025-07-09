package com.concierge.apiconcierge.services.workshop.toolcontrol.request;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;

import java.util.Map;

public interface IToolControlRequestService {

    Map<String , Object> save(ToolControlRequest req);

   String update(ToolControlRequest req);
}
