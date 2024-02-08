package com.concierge.apiconcierge.models.companies;

import com.concierge.apiconcierge.models.address.Address;
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
@SecondaryTable(name = "tb_address", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Table(name = "tb_company")
public class Company implements Serializable {

    private static final long serialVersionUID = 2l;

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
