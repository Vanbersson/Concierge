package com.concierge.apiconcierge.models.purchase;

import com.concierge.apiconcierge.models.purchase.statusEnum.PurchaseOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_client_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity(name = "tb_purchase_order")
@Table(name = "tb_purchase_order")
public class PurchaseOrder {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private PurchaseOrderStatus status;

    @Column(name = "date_generation")
    private Date dateGeneration;

    @Column(name = "date_delivery")
    private Date dateDelivery;

    @Column(name = "date_received")
    private Date dateReceived;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "responsible_id")
    private Integer responsibleId;

    @Column(name = "responsible_name")
    private String responsibleName;

    @JoinColumn(table = "tb_client_company", referencedColumnName = "id")
    @Column(name = "client_company_id")
    private Integer clientCompanyId;

    @Column(name = "client_company_name")
    private String clientCompanyName;

    @Column(name = "attendant_name")
    private String attendantName;

    @Column(name = "attendant_email")
    private String attendantEmail;

    @Column(name = "attendant_ddd_cellphone")
    private String attendantDddCellphone;

    @Column(name = "attendant_cellphone")
    private String attendantCellphone;

    @Column(name = "attendant_ddd_phone")
    private String attendantDddPhone;

    @Column(name = "attendant_phone")
    private String attendantPhone;

    @Column(name = "payment_type")
    private String paymentType;

    @Column(name = "nf_num")
    private Integer nfNum;

    @Column(name = "nf_serie")
    private String nfSerie;

    @Column(name = "nf_date")
    private Date nfDate;

    @Column(name = "nf_key")
    private String nfKey;

    private String information;

}
