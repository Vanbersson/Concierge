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
@Table(name = "tb_company")
public class Company implements Serializable {

    private static final long serialVersionUID = 2l;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnabledDisabledEnum status;

    private String name;

    private String cnpj;

    private Address address;
}
