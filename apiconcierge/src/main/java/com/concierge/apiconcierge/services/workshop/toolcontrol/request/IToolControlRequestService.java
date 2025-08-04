package com.concierge.apiconcierge.services.workshop.toolcontrol.request;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;

import java.util.Map;

public interface IToolControlRequestService {

    ToolControlRequest newRequest(ToolControlRequest req);
    ToolControlRequest updateRequest(ToolControlRequest req);
    Map<String , Object> loanReturn(ToolControlRequest req);


}
