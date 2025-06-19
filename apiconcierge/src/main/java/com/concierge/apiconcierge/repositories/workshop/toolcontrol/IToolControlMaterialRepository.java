package com.concierge.apiconcierge.repositories.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IToolControlMaterialRepository extends JpaRepository<ToolControlMaterial, Integer> {
}
