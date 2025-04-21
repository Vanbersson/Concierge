package com.concierge.apiconcierge.models.purchase;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_purchase_order", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_part", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity(name = "tb_purchase_order_item")
@Table(name = "tb_purchase_order_item")
public class PurchaseOrderItem {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JoinColumn(table = "tb_purchase_order", referencedColumnName = "id")
    @Column(name = "purchase_id")
    private Integer purchaseId;

    @JoinColumn(table = "tb_part",referencedColumnName = "id")
    @Column(name = "part_id")
    private Integer partId;

    @Column(name = "part_code")
    private String partCode;

    @Column(name = "part_description")
    private String partDescription;

    private float quantity;

    private float discount;

    private float price;

}
