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
@Entity
@Table(name = "tb_resale")
public class Resale implements Serializable {

    private static final long serialVersionUID = 3L;

    private Company company;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnabledDisabledEnum status;

    private String name;

    private String cnpj;

    private Address address;
}
