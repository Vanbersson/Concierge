package com.concierge.apiconcierge.models.clientcompany;

import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_client_company_type", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_address", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_client_company")
public class ClientCompany implements Serializable {

    private static final long serialVersionUID = 9L;

    @JoinColumn(referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnabledDisabledEnum status;

    private String name;

    private String cnpj;

    private String cpf;

    private String rg;

    private String email;

    private String phone;

    private String cellphone;

    @JoinColumn(referencedColumnName = "id")
    @Column(name = "type_id")
    private Integer typeId;

    @JoinColumn(referencedColumnName = "id")
    @Column(name = "address_id")
    private Integer addressId;


}
