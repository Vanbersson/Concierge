package com.concierge.apiconcierge.repositories.permission;

import com.concierge.apiconcierge.models.permissions.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionIRepository extends JpaRepository<Permission, Integer> {
}
