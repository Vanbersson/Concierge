package com.concierge.apiconcierge.validation.workshop.toolcontrol.request;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;

public interface IToolControlRequestValidation {

    String newRequest(ToolControlRequest req);
    String updateRequest(ToolControlRequest req);
    String loanReturn(ToolControlRequest req);

}
