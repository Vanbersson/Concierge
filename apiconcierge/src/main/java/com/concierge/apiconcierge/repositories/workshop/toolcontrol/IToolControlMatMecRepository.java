package com.concierge.apiconcierge.repositories.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IToolControlMatMecRepository extends JpaRepository<ToolControlMatMec, UUID> {

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 ", nativeQuery = true)
    List<ToolControlMatMec> listAll(Integer companyId, Integer resaleId);

    @Query(value = "\n" +
            "select matmec.company_id,matmec.resale_id,matmec.id,matmec.request_id,\n" +
            "matmec.quantity_req,matmec.information_req,\n" +
            "matmec.quantity_dev, matmec.information_dev, \n" +
            "matmec.material_id  \n" +
            "from tb_tool_control_request as req\n" +
            "inner join tb_tool_control_mat_mec as matmec on req.id = matmec.request_id and  req.company_id=?1 and req.resale_id=?2 and req.status = 0 and matmec.material_id=?3  ", nativeQuery = true)
    List<ToolControlMatMec> filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND mechanic_id=?3 AND date_dev IS NULL ", nativeQuery = true)
    List<ToolControlMatMec> filterMecIdDevPend(Integer companyId, Integer resaleId, Integer mechanicId);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND date_dev IS NULL ", nativeQuery = true)
    List<ToolControlMatMec> listAllDevPend(Integer companyId, Integer resaleId);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND date_dev IS NOT NULL ", nativeQuery = true)
    List<ToolControlMatMec> listAllDevComp(Integer companyId, Integer resaleId);
}
