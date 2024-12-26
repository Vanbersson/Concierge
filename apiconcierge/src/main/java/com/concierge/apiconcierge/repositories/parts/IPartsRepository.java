package com.concierge.apiconcierge.repositories.parts;

import com.concierge.apiconcierge.models.parts.Parts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPartsRepository extends JpaRepository<Parts,Integer> {
}
