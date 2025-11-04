package com.concierge.apiconcierge.services.notification.user;

import com.concierge.apiconcierge.dtos.notification.NotificationUserDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.NotificationUser;

import java.util.UUID;

public interface INotificationUserService {
    public MessageResponse save(NotificationUser n);

    public MessageResponse delete(NotificationUserDto notification);

    public MessageResponse filterUser(Integer companyId, Integer resaleId, Integer userId);

    public MessageResponse filterNotification(Integer companyId, Integer resaleId, UUID notificationId);
}
