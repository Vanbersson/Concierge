package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.resales.Resale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResaleRepository extends JpaRepository<Resale, Integer> {
}
