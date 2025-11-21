package com.concierge.apiconcierge.repositories.notification;

import com.concierge.apiconcierge.models.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, UUID> {
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM tb_notification WHERE company_id=?1 AND resale_id=?2 AND id=?3", nativeQuery = true)
    void delete(Integer companyId, Integer resaleId, UUID id);
}
