package com.concierge.apiconcierge.repositories.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IToolControlRequestRepository extends JpaRepository<ToolControlRequest, Integer> {
}
