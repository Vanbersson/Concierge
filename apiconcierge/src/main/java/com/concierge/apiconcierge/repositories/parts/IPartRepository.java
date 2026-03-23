package com.concierge.apiconcierge.repositories.parts;

import com.concierge.apiconcierge.models.part.Part;
import com.concierge.apiconcierge.services.parts.interfaces.IPartListAll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPartRepository extends JpaRepository<Part, Integer> {

    @Query(value = "SELECT p.id AS 'Id',p.status AS 'Status',p.description AS 'Description',p.code AS 'Code',\n" +
            "b.name AS 'Brand',\n" +
            "g.description AS 'Group',\n" +
            "c.description AS 'Category'\n" +
            "FROM tb_part AS p\n" +
            "INNER JOIN tb_brand AS b ON(p.brand_id = b.id)\n" +
            "INNER JOIN tb_part_group AS g ON(p.group_id = g.id)\n" +
            "INNER JOIN tb_part_category AS c ON(p.category_id = c.id)\n" +
            "WHERE P.company_id=?1 AND P.resale_id=?2\n" +
            "ORDER BY p.id ASC", nativeQuery = true)
    List<IPartListAll> listAll(Integer companyId, Integer resaleId);

    @Query(value = "SELECT * FROM tb_part WHERE company_id=?1 AND resale_id=?2 AND id=?3",nativeQuery = true)
    Part filterId(Integer companyId, Integer resaleId, Integer id);

    @Query(value = "SELECT * FROM tb_part WHERE company_id=?1 AND resale_id=?2 AND code=?3",nativeQuery = true)
    Part filterCode(Integer companyId, Integer resaleId, String code);
}
