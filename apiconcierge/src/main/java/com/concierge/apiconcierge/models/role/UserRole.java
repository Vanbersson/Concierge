package com.concierge.apiconcierge.models.role;

import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_user_role")
public class UserRole implements Serializable {
    private static final long serialVersionUID = 4L;

    private Company company;

    private Resale resale;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnabledDisabledEnum status;

    private String description;

    private RoleEnum role;

}
