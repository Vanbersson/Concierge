package com.concierge.apiconcierge.services.notification.notification;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.Notification;
import com.concierge.apiconcierge.repositories.notification.INotificationRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService implements INotificationService {
    @Autowired
    INotificationRepository repository;

    @Override
    public MessageResponse save(Notification n) {
        MessageResponse response = new MessageResponse();
        try {
            Notification result =   this.repository.save(n);
            response.setStatus(ConstantsMessage.SUCCESS);
            response.setHeader(ConstantsMessage.SUCCESS);
            response.setMessage(ConstantsMessage.SUCCESS);
            response.setData(result);
            return response;
        } catch (Exception e) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader(ConstantsMessage.ERROR);
            response.setMessage(ConstantsMessage.ERROR);
            return response;
        }
    }

    @Override
    public MessageResponse delete(UUID id) {
        return null;
    }

    @Override
    public MessageResponse filterId(Integer companyId, Integer resaleId, UUID id) {
        return null;
    }
}
