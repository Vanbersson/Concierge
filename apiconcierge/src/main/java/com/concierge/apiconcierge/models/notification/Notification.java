package com.concierge.apiconcierge.models.notification;

import com.concierge.apiconcierge.models.enums.YesNot;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user_role", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_vehicle_entry", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_budget", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_purchase_order", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_tool_control_request", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity(name = "tb_notification")
@Table(name = "tb_notification")
public class Notification {
    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "orig_user_id")
    private Integer origUserId;

    @Column(name = "orig_user_name")
    private String origUserName;

    @Column(name = "orig_date")
    private Date origDate;

    @JoinColumn(table = "tb_user_role", referencedColumnName = "id")
    @Column(name = "orig_role_id")
    private Integer origRoleId;

    @Column(name = "orig_role_desc")
    private String origRoleDesc;

    @Column(name = "orig_notification_menu")
    private NotificationMenu origNotificationMenu;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "dest_user_id")
    private Integer destUserId;

    @JoinColumn(table = "tb_user_role", referencedColumnName = "id")
    @Column(name = "dest_user_role_id")
    private Integer destUserRoleId;

    @Column(name = "dest_user_all")
    private YesNot destUserAll;

    @JoinColumn(table = "tb_vehicle_entry", referencedColumnName = "id")
    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @JoinColumn(table = "tb_budget", referencedColumnName = "id")
    @Column(name = "budget_id")
    private Integer budgetId;

    @JoinColumn(table = "tb_purchase_order", referencedColumnName = "id")
    @Column(name = "purchase_order_id")
    private Integer purchaseOrderId;

    @JoinColumn(table = "tb_tool_control_request", referencedColumnName = "id")
    @Column(name = "tool_control_request_id")
    private Integer toolControlRequestId;

    private String header;

    private String message1;

    private String message2;

    private String message3;

    @Column(name = "share_message")
    private YesNot shareMessage;

    @Column(name = "delete_message")
    private YesNot deleteMessage;

}
