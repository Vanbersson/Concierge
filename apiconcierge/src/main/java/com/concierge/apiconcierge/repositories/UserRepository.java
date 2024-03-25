package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByCompanyIdAndResaleIdAndId(Integer companyId,Integer resaleId,Integer id);


  List<User> findByCompanyIdAndResaleId(Integer companyId,Integer resaleId);

    User findByResaleIdAndId(Integer resaleId, Integer id);

    User findByLogin(String login);

    User findByEmail(String email);

}
