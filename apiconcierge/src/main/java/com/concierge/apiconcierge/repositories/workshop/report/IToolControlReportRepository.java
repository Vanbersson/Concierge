package com.concierge.apiconcierge.repositories.workshop.report;

import com.concierge.apiconcierge.dtos.workshop.report.ToolControlReportDto;
import com.concierge.apiconcierge.models.workshop.mechanic.Mechanic;
import com.concierge.apiconcierge.models.workshop.toolcontrol.report.IToolControlReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface IToolControlReportRepository extends JpaRepository<Mechanic, Integer> {

    @Query(value = "SELECT mec.company_id AS 'CompanyId', mec.resale_id AS 'ResaleId',\n" +
            "req.id AS 'RequestId', req.status AS 'RequestStatus', req.type_material AS 'RequestTypeMaterial',req.user_id_req AS 'RequestUserId',req.date_req AS 'RequestDate',req.information_req AS 'RequestInformation', \n" +
            "cat.id AS 'CategoryId', cat.description AS 'CategoryDesc',\n" +
            "matmec.id AS 'MatMecId', matmec.quantity_req AS 'MatMecQuantityReq',matmec.quantity_ret AS 'MatMecQuantityRet',matmec.user_id_ret AS 'MatMecUserRet',\n" +
            "matmec.date_ret AS 'MatMecDateRet',matmec.information_ret AS 'MatMecInformationRet',matmec.material_id AS 'MatMecMaterialId', \n" +
            "mat.description AS 'MaterialDesc' FROM tb_mechanic AS mec \n" +
            "INNER JOIN tb_tool_control_request AS req ON mec.company_id=?1 AND mec.resale_id=?2 AND mec.id=req.mechanic_id AND mec.id=?3 AND mec.status=0 AND req.status=0 \n" +
            "INNER JOIN tb_tool_control_mat_mec AS matmec ON req.id = matmec.request_id AND matmec.date_ret IS NULL AND matmec.quantity_ret=0 AND matmec.user_id_ret IS NULL \n" +
            "INNER JOIN tb_tool_control_material AS mat ON matmec.material_id=mat.id \n" +
            "INNER JOIN tb_tool_control_category AS cat ON mat.category_id = cat.id;", nativeQuery = true)
    List<IToolControlReport> filterMechanic(Integer companyId, Integer resaleId, Integer mechanicId);


}
