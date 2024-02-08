package com.concierge.apiconcierge.models.user;

import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_resale",pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user_role",pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_user")
public class User implements Serializable {
    private static final long serialVersionUID = 5L;

    @JoinColumn(referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnabledDisabledEnum status;

    private String name;

    private String login;

    private String password;

    private String email;

    private String cellphone;

    @JoinColumn(referencedColumnName = "id")
    @Column(name = "role_id")
    private Integer roleId;


}
