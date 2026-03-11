package com.concierge.apiconcierge.models.part;

import com.concierge.apiconcierge.models.enums.StatusEnableDisable;
import com.concierge.apiconcierge.models.part.enums.AdditionDiscount;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusEnableDisable status;

    @Column(name = "date_register")
    private Date dateRegister;

    private String code;

    private String description;

    @Column(name = "unit_measure_id")
    private Integer unitMeasureId;

    @Column(name = "price_now")
    private float priceNow;

    @Column(name = "price_old")
    private float priceOld;

    @Column(name = "addition_discount")
    private AdditionDiscount additionDiscount;

    @Column(name = "brand_id")
    private Integer brandId;

    @Column(name = "group_id")
    private Integer groupId;

    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "location_pri_street")
    private String locationPriStreet;

    @Column(name = "location_pri_bookcase")
    private String locationPriBookcase;

    @Column(name = "location_pri_shelf")
    private String locationPriShelf;

    @Column(name = "location_pri_position")
    private String locationPriPosition;

    @Column(name = "location_sec_street")
    private String locationSecStreet;

    @Column(name = "location_sec_bookcase")
    private String locationSecBookcase;

    @Column(name = "location_sec_shelf")
    private String locationSecShelf;

    @Column(name = "location_sec_position")
    private String locationSecPosition;

    @Column(name = "photo_url_front")
    private String photoUrlFront;

    @Column(name = "photo_url_verse")
    private String photoUrlVerse;








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
