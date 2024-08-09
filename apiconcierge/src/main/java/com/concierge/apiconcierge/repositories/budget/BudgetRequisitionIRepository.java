package com.concierge.apiconcierge.repositories.budget;

import com.concierge.apiconcierge.models.budget.BudgetRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BudgetRequisitionIRepository extends JpaRepository<BudgetRequisition, UUID> {


    @Query(value = "SELECT `company_id`, `resale_id`, `id`, `budget_id`, `ordem`, `description` FROM `tb_budget_requisition` \n" +
            "where company_id = ?1 and resale_id= ?2 and budget_id = ?3 order by ordem",
            nativeQuery = true)
    List<BudgetRequisition> listRequisition(Integer companyId, Integer resaleId, Integer budgetId);

    @Query(value = "DELETE FROM tb_budget_requisition WHERE  company_id = ?1 and resale_id= ?2 and budget_id = ?3 and ordem = ?4", nativeQuery = true)
    void deleteRequisition(Integer companyId, Integer resaleId, Integer budgetId, Integer ordem);

}
