package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

    List<UserRole> findByCompanyIdAndResaleId(Integer companyId, Integer resaleId);

    UserRole findByCompanyIdAndResaleIdAndId(Integer companyId, Integer resaleId,Integer id);
}
