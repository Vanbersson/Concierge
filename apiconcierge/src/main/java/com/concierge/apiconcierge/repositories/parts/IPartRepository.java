package com.concierge.apiconcierge.repositories.parts;

import com.concierge.apiconcierge.models.part.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPartRepository extends JpaRepository<Part,Integer> {

    @Query(value = "SELECT * FROM tb_part WHERE company_id=?1 AND resale_id=?2",nativeQuery = true)
    List<Part> listParts(Integer companyId, Integer resaleId);
}
