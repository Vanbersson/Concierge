package com.concierge.apiconcierge.repositories.notification;

import com.concierge.apiconcierge.models.notification.Notification;
import com.concierge.apiconcierge.models.notification.NotificationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface INotificationUserRepository extends JpaRepository<NotificationUser, UUID> {

    @Query(value = "SELECT tbn.* FROM tb_notification_user AS tbnu\n" +
            "INNER JOIN tb_notification AS tbn \n" +
            "    ON tbnu.company_id = tbn.company_id\n" +
            "    AND tbnu.resale_id = tbn.resale_id\n" +
            "    AND tbnu.notification_id = tbn.id\n" +
            "WHERE \n" +
            "  tbnu.company_id = ?1\n" +
            "  AND tbnu.resale_id = ?2\n" +
            "  AND tbnu.user_id = ?3\n" +
            "GROUP BY \n" +
            "tbn.id \n" +
            "ORDER BY \n" +
            "  tbn.orig_date DESC", nativeQuery = true)
    List<Notification> filterUser(Integer companyId, Integer resaleId, Integer userId);
}
