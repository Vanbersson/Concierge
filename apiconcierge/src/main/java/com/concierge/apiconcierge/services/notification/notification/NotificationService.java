package com.concierge.apiconcierge.services.notification.notification;

import com.concierge.apiconcierge.exceptions.notification.NotificationException;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.Notification;
import com.concierge.apiconcierge.repositories.notification.INotificationRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService implements INotificationService {
    @Autowired
    INotificationRepository repository;

    @SneakyThrows
    @Override
    public MessageResponse save(Notification n) {
        try {
            Notification result = this.repository.save(n);
            MessageResponse response = new MessageResponse();
            response.setStatus(ConstantsMessage.SUCCESS);
            response.setData(result);
            return response;
        } catch (Exception e) {
            throw new NotificationException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse delete(Integer companyId, Integer resaleId, UUID id) {
        try {
            this.repository.delete(companyId, resaleId, id);
            MessageResponse response = new MessageResponse();
            response.setStatus(ConstantsMessage.SUCCESS);
            return response;
        } catch (Exception e) {
            throw new NotificationException(e.getMessage());
        }
    }

}
