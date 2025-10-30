package com.concierge.apiconcierge.models.notification;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_notification", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity(name = "tb_notification_user")
@Table(name = "tb_notification_user")
public class NotificationUser {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JoinColumn(table = "tb_notification",referencedColumnName = "id")
    @Column(name = "notification_id")
    private UUID notificationId;

    @JoinColumn(table = "tb_user",referencedColumnName = "id")
    @Column(name = "user_id")
    private Integer userId;


}
