package com.concierge.apiconcierge.repositories.notification;

import com.concierge.apiconcierge.models.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, UUID> {
}
