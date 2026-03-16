package com.concierge.apiconcierge.repositories.parts.category;

import com.concierge.apiconcierge.models.enums.StatusEnableDisable;
import com.concierge.apiconcierge.models.part.category.PartCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPartCategoryRepository extends JpaRepository<PartCategory, Integer> {

    @Query(value = "SELECT * FROM `tb_part_category` WHERE company_id=?1 AND resale_id=?2 ", nativeQuery = true)
    List<PartCategory> listAll(Integer companyId, Integer resaleId);

    @Query(value = "SELECT * FROM `tb_part_category` WHERE company_id=?1 AND resale_id=?2 AND status=?3 ", nativeQuery = true)
    List<PartCategory> listAllEnabled(Integer companyId, Integer resaleId, StatusEnableDisable status);
}
