package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {


    List<User> findByResaleId(Integer resaleId);
    User findByLogin(String login);

    User findByEmail(String email);

}
