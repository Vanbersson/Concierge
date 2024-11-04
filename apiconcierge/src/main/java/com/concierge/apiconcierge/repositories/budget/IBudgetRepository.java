package com.concierge.apiconcierge.repositories.budget;

import com.concierge.apiconcierge.models.budget.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IBudgetRepository extends JpaRepository<Budget, Integer> {

    Budget findByVehicleEntryId(Integer vehicleEntryId);
}
