package com.concierge.apiconcierge.repositories.permission;

import com.concierge.apiconcierge.models.permissions.PermissionUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface PermissionUserIRepository extends JpaRepository<PermissionUser, UUID> {

    List<PermissionUser> findByUserId(Integer userId);

    PermissionUser findByUserIdAndPermissionId(Integer userId, Integer permissionId);


    @Transactional
    @Modifying
    @Query(value = "delete from tb_user_permission where user_id = :userId", nativeQuery = true)
    void deleteUser(@Param("userId") Integer userId);

}
