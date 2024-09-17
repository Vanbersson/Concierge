package com.concierge.apiconcierge.repositories.budget;

import com.concierge.apiconcierge.models.budget.BudgetService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IBudgetService extends JpaRepository<BudgetService, UUID> {

    @Query(value = "SELECT `company_id`, `resale_id`, `id`, `budget_id`, `status`, `ordem`, `description`, `hour_service`, `price`, `discount` FROM `tb_budget_service` \n" +
            "where budget_id = ?1 order by ordem",
            nativeQuery = true)
    List<BudgetService> listService(Integer budgetId);

}


