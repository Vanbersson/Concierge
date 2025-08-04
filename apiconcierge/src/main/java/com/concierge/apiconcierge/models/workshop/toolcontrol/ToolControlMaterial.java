package com.concierge.apiconcierge.models.workshop.toolcontrol;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeRequest;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_tool_control_category", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_tool_control_material")
public class ToolControlMaterial {
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

    private TypeRequest type;

    @Column(name = "number_ca")
    private Integer numberCA;

    private String description;

    @JoinColumn(table = "tb_tool_control_category",referencedColumnName = "id")
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "quantity_accounting_loan")
    private float quantityAccountingLoan;

    @Column(name = "quantity_available_loan")
    private float quantityAvailableLoan;

    @Column(name = "quantity_accounting_kit")
    private float quantityAccountingKit;

    @Column(name = "quantity_available_kit")
    private float quantityAvailableKit;

    @Column(name = "validity_day")
    private Integer validityDay;

    @Lob
    private byte[] photo;
}
