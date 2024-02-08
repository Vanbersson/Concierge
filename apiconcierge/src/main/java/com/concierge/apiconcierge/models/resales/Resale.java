package com.concierge.apiconcierge.models.resales;


import com.concierge.apiconcierge.models.address.Address;
import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company",pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_address",pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_resale")
public class Resale implements Serializable {

    private static final long serialVersionUID = 3L;

    @JoinColumn(referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnabledDisabledEnum status;

    private String name;

    private String cnpj;

    @JoinColumn(referencedColumnName = "id")
    @Column(name = "address_id")
    private Integer addressId;
}
