package com.concierge.apiconcierge.repositories.budget;

import com.concierge.apiconcierge.models.budget.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetIRepository extends JpaRepository<Budget, Integer> {
}
