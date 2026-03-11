package com.concierge.apiconcierge.repositories.parts.unit;


import com.concierge.apiconcierge.models.enums.StatusEnableDisable;
import com.concierge.apiconcierge.models.part.unit.UnitMeasure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUnitMeasureRepository extends JpaRepository<UnitMeasure, Integer> {
    @Query(value = "SELECT * FROM `tb_unit_measure` WHERE status=?1 ", nativeQuery = true)
    List<UnitMeasure> listAllEnabled(StatusEnableDisable status);
}
