package com.concierge.apiconcierge.controllers.workshop.toolcontrol;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.workshop.toolcontrol.ToolControlRequestDto;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;
import com.concierge.apiconcierge.services.workshop.toolcontrol.request.ToolControlRequestService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/workshop/tool/control/request")
public class ToolControlRequestController {

    @Autowired
    ToolControlRequestService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody ToolControlRequestDto data) {
        try {
            ToolControlRequest req = new ToolControlRequest();
            BeanUtils.copyProperties(data, req);
            Map<String, Object> result = this.service.save(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody ToolControlRequestDto data) {
        try {
            ToolControlRequest req = new ToolControlRequest();
            BeanUtils.copyProperties(data, req);
            String result = this.service.update(req);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(result));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
