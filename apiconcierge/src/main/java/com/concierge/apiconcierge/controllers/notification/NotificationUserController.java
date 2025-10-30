package com.concierge.apiconcierge.controllers.notification;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.NotificationUser;
import com.concierge.apiconcierge.services.notification.user.INotificationUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notification/user")
public class NotificationUserController {
    @Autowired
    INotificationUserService service;

    @GetMapping("/{companyId}/{resaleId}/filter/u/{user}")
    public ResponseEntity<Object> filterUser(@PathVariable(name = "companyId") Integer companyId,
                                             @PathVariable(name = "resaleId") Integer resaleId,
                                             @PathVariable(name = "user") Integer userId) {
        try {
            MessageResponse result = this.service.filterUser(companyId, resaleId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
