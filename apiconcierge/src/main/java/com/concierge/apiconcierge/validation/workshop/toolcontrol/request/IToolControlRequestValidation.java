package com.concierge.apiconcierge.validation.workshop.toolcontrol.request;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;

public interface IToolControlRequestValidation {
    String save(ToolControlRequest req);

    String update(ToolControlRequest req);
}
