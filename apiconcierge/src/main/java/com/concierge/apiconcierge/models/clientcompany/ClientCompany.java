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

    private String fantasia;

    private CliForEnum clifor;

    private FisJurEnum fisjur;

    private String cnpj;

    private String cpf;

    private String rg;

    @Column(name = "email_home")
    private String emailHome;

    @Column(name = "email_work")
    private String emailWork;

    @Column(name = "ddd_cellphone")
    private String dddCellphone;

    private String cellphone;

    @Column(name = "ddd_phone")
    private String dddPhone;

    private String phone;

    @Column(name = "zip_code")
    private String zipCode;

    private String state;

    private String city;

    private String neighborhood;

    private String address;

    @Column(name = "address_number")
    private String addressNumber;

    @Column(name = "address_complement")
    private String addressComplement;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_ddd_phone")
    private String contactDDDPhone;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_ddd_cellphone")
    private String contactDDDCellphone;

    @Column(name = "contact_cellphone")
    private String contactCellphone;







}
