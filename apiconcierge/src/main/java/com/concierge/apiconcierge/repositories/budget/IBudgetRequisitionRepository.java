package com.concierge.apiconcierge.repositories.budget;

import com.concierge.apiconcierge.models.budget.BudgetRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IBudgetRequisitionRepository extends JpaRepository<BudgetRequisition, UUID> {

    @Query(value = "SELECT * FROM `tb_budget_requisition` WHERE company_id=?1 AND resale_id=?2 AND budget_id = ?3 order by ordem",
            nativeQuery = true)
    List<BudgetRequisition> listAllRequisition(Integer companyId, Integer resaleId, Integer budgetId);

}
