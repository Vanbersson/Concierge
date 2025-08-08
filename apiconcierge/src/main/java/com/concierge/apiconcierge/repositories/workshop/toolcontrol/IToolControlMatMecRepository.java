package com.concierge.apiconcierge.repositories.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IToolControlMatMecRepository extends JpaRepository<ToolControlMatMec, UUID> {
    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND id=?3 ", nativeQuery = true)
    ToolControlMatMec filterId(Integer companyId, Integer resaleId, UUID id);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 ", nativeQuery = true)
    List<ToolControlMatMec> listAll(Integer companyId, Integer resaleId);

    @Query(value = "SELECT matmec.* FROM tb_tool_control_request as req \n" +
            "INNER JOIN tb_tool_control_mat_mec AS matmec ON req.id=matmec.request_id AND req.company_id=?1 \n" +
            "AND req.resale_id=?2 AND matmec.material_id=4 AND req.status!=2 AND matmec.return_quantity=0 AND matmec.return_user_id IS NULL AND matmec.return_date IS NULL;", nativeQuery = true)
    List<ToolControlMatMec> filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId);


}
