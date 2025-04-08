package com.concierge.apiconcierge.repositories.budget;

import com.concierge.apiconcierge.models.budget.BudgetService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IBudgetServiceRepository extends JpaRepository<BudgetService, UUID> {

    @Query(value = "SELECT * FROM `tb_budget_service` WHERE company_id=?1 AND resale_id=?2 AND budget_id=?3 order by ordem",
            nativeQuery = true)
    List<BudgetService> listAllService(Integer companyId, Integer resaleId, Integer budgetId);

}


