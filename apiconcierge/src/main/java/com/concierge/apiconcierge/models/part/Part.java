package com.concierge.apiconcierge.models.part;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
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
@Entity
@Table(name = "tb_part")
public class Part {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    private Integer id;

    private StatusEnableDisable status;

    private String code;

    private String description;

    @Column(name = "qtd_available")
    private float qtdAvailable;

    @Column(name = "qtd_accounting")
    private float qtdAccounting;

    @Column(name = "unit_measure")
    private String unitMeasure;

    private float price;

    @Column(name = "location_street")
    private String locationStreet;

    @Column(name = "location_bookcase")
    private String locationBookcase;

    @Column(name = "location_shelf")
    private String locationShelf;

    @Column(name = "date_last_entry")
    private Date dateLastEntry;

}
