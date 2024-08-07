package com.concierge.apiconcierge.models.budget;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetItemEnum;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_budget", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_budget_item")
public class BudgetItem {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(table = "tb_budget", referencedColumnName = "id")
    @Column(name = "budget_id")
    private Integer budgetId;

    private StatusBudgetItemEnum status;

    private String code;

    private String description;

    private Integer quantity;

    private Double discount;

    private Double price;
}
