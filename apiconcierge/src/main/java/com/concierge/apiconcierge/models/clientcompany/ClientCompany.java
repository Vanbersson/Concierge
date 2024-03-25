package com.concierge.apiconcierge.models.clientcompany;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_client_company_type", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_client_company")
public class ClientCompany implements Serializable {

    private static final long serialVersionUID = 9L;

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnableDisable status;

    private String name;

    private String cnpj;

    private String cpf;

    private String rg;

    private String email;

    private String cellphone;

    private String phone;

    @JoinColumn(table = "tb_client_company_type", referencedColumnName = "id")
    @Column(name = "type_id")
    private Integer typeId;


}
