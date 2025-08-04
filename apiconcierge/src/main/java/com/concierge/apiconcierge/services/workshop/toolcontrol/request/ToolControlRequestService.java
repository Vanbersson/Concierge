package com.concierge.apiconcierge.services.workshop.toolcontrol.request;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlRequestRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.workshop.toolcontrol.request.ToolControlRequestValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ToolControlRequestService implements IToolControlRequestService {

    @Autowired
    IToolControlRequestRepository repository;

    @Autowired
    ToolControlRequestValidation validation;

    @SneakyThrows
    @Override
    public ToolControlRequest newRequest(ToolControlRequest req) {
        try {
            String message = this.validation.newRequest(req);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                req.setId(null);
                ToolControlRequest result = this.repository.save(req);
                return result;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public ToolControlRequest updateRequest(ToolControlRequest req) {
        try {
            String message = this.validation.updateRequest(req);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                ToolControlRequest result = this.repository.save(req);
                return result;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> loanReturn(ToolControlRequest req) {
        try {
            String message = this.validation.loanReturn(req);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                req.setId(null);
                ToolControlRequest result = this.repository.save(req);
                Map<String, Object> map = new HashMap<>();
                map.put("id", result.getId());
                return map;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }


}
