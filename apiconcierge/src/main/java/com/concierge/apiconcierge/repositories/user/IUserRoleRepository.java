package com.concierge.apiconcierge.repositories.user;

import com.concierge.apiconcierge.models.role.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUserRoleRepository extends JpaRepository<UserRole, Integer> {


    @Query(value = "SELECT * FROM `tb_user_role` WHERE STATUS = 0",nativeQuery = true)
    List<UserRole> listEnabled();

}
