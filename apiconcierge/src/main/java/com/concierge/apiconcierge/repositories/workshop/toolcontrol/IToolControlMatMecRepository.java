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

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND request_id=?3 ", nativeQuery = true)
    List<ToolControlMatMec> filterRequestId(Integer companyId, Integer resaleId, Integer requestId);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 ", nativeQuery = true)
    List<ToolControlMatMec> listAll(Integer companyId, Integer resaleId);

    @Query(value = "SELECT matmec.company_id,matmec.resale_id,matmec.id,matmec.request_id,matmec.quantity_req,matmec.quantity_ret, matmec.user_id_ret,matmec.date_ret,matmec.information_ret,matmec.material_id,matmec.material_number_ca \n" +
            "FROM tb_tool_control_request as req\n" +
            "INNER JOIN tb_tool_control_mat_mec AS matmec ON req.id=matmec.request_id AND req.company_id=?1 AND req.resale_id=?2 AND req.status=0 AND matmec.material_id=?3 \n" +
            "AND matmec.quantity_ret=0 AND matmec.user_id_ret IS NULL AND matmec.date_ret IS NULL", nativeQuery = true)
    List<ToolControlMatMec> filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND mechanic_id=?3 AND date_dev IS NULL ", nativeQuery = true)
    List<ToolControlMatMec> filterMecIdDevPend(Integer companyId, Integer resaleId, Integer mechanicId);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND date_dev IS NULL ", nativeQuery = true)
    List<ToolControlMatMec> listAllDevPend(Integer companyId, Integer resaleId);

    @Query(value = "SELECT * FROM `tb_tool_control_mat_mec` WHERE company_id=?1 AND resale_id=?2 AND date_dev IS NOT NULL ", nativeQuery = true)
    List<ToolControlMatMec> listAllDevComp(Integer companyId, Integer resaleId);
}
