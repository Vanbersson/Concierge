package com.concierge.apiconcierge.models.permissions;

import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_permission", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_user_permission")
public class PermissionUser implements Serializable {

    private static final long serialVersionUID = 7L;

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
    @Column(name = "user_id")
    private Integer userId;

    @JoinColumn(table = "tb_permission", referencedColumnName = "id")
    @Column(name = "permission_id")
    private Integer permissionId;
}
