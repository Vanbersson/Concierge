package com.concierge.apiconcierge.services.notification.user;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.Notification;
import com.concierge.apiconcierge.models.notification.NotificationUser;
import com.concierge.apiconcierge.repositories.notification.INotificationUserRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationUserService implements INotificationUserService {
    @Autowired
    INotificationUserRepository repository;

    @Override
    public MessageResponse save(NotificationUser n) {
        MessageResponse response = new MessageResponse();
        try {
            NotificationUser result = this.repository.save(n);
            response.setStatus(ConstantsMessage.SUCCESS);
            response.setHeader("Notificação");
            response.setMessage("Criada com sucesso.");
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
    public MessageResponse filterUser(Integer companyId, Integer resaleId, Integer userId) {
        try {
            MessageResponse response = new MessageResponse();
            List<Notification> list = this.repository.filterUser(companyId, resaleId, userId);
            response.setStatus(ConstantsMessage.SUCCESS);
            response.setHeader("Notificações");
            response.setMessage("Encontrada com sucesso.");
            response.setData(list);
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public MessageResponse filterNotification(Integer companyId, Integer resaleId, UUID notificationId) {
        return null;
    }
}
