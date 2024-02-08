package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.permissions.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
}
