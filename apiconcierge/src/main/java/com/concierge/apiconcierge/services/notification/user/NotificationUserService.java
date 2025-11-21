package com.concierge.apiconcierge.services.notification.user;

import com.concierge.apiconcierge.dtos.notification.NotificationUserDto;
import com.concierge.apiconcierge.exceptions.notification.NotificationException;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.Notification;
import com.concierge.apiconcierge.models.notification.NotificationUser;
import com.concierge.apiconcierge.repositories.notification.INotificationUserRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.notification.user.INotificationUserValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationUserService implements INotificationUserService {
    @Autowired
    INotificationUserRepository repository;

    @Autowired
    INotificationUserValidation validation;

    @SneakyThrows
    @Override
    public MessageResponse save(NotificationUser n) {
        try {
            MessageResponse response = this.validation.save(n);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                n.setId(null);
                this.repository.save(n);
                return response;
            } else {
                return response;
            }
        } catch (Exception e) {
            throw new NotificationException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse delete(NotificationUserDto notification, String userEmail) {
        try {
            MessageResponse response = this.validation.delete(notification, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                this.repository.delete(notification.companyId(), notification.resaleId(), notification.id());
                return response;
            } else {
                return response;
            }
        } catch (Exception e) {
            throw new NotificationException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse deleteAll(NotificationUserDto notification, String userEmail) {
        try {
            MessageResponse response = this.validation.deleteAll(notification, userEmail);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                this.repository.deleteAll(notification.companyId(), notification.resaleId(), notification.userId());
                return response;
            } else {
                return response;
            }
        } catch (Exception e) {
            throw new NotificationException(e.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterUser(Integer companyId, Integer resaleId, Integer userId) {
        try {
            MessageResponse response = this.validation.filterUser(companyId, resaleId, userId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<Notification> list = this.repository.filterUser(companyId, resaleId, userId);
                response.setData(list);
                return response;
            } else {
                return response;
            }
        } catch (Exception e) {
            throw new NotificationException(e.getMessage());
        }
    }

}
