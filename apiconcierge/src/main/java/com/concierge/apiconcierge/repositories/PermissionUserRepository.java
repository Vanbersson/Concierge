package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.permissions.PermissionUser;
import com.concierge.apiconcierge.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PermissionUserRepository extends JpaRepository<PermissionUser, UUID> {

    List<PermissionUser> findByResaleIdAndUserId(Integer resaleId,Integer userId);

    PermissionUser findByResaleIdAndUserIdAndPermissionId(Integer resaleId,Integer userId,Integer permissionId);
}
