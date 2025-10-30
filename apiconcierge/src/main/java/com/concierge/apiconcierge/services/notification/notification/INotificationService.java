package com.concierge.apiconcierge.services.notification.notification;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.notification.Notification;

import java.util.UUID;

public interface INotificationService {

    public MessageResponse save(Notification n);

    public MessageResponse delete(UUID id);

    public MessageResponse filterId(Integer companyId, Integer resaleId, UUID id);
}
