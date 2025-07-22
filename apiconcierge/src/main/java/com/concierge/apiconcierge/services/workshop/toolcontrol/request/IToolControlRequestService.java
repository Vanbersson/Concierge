package com.concierge.apiconcierge.services.workshop.toolcontrol.request;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;

import java.util.Map;

public interface IToolControlRequestService {

    Map<String , Object> loanRequest(ToolControlRequest req);
    Map<String , Object> loanReturn(ToolControlRequest req);


}
