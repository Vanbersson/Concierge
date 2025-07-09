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

    @Query(value = "SELECT mec.company_id AS 'companyId',mec.resale_id AS 'resaleId',mec.id AS 'MecId',mec.name AS 'MecName',mec.photo AS 'MecPhoto',\n" +
            "req.id AS 'RequestId',req.date_req AS 'RequestDateReq',cat.id AS 'CategoryId',cat.description AS 'CategoryDesc',\n" +
            "matmec.id AS 'MatMecId', mat.id AS 'MaterialId',mat.description AS 'MaterialDesc',mat.photo AS 'MaterialPhoto',matmec.quantity_req AS 'MaterialQuantReq',matmec.information_req AS 'MaterialInfReq' FROM tb_mechanic AS mec\n" +
            "INNER JOIN tb_tool_control_request AS req ON mec.company_id=?1 AND mec.resale_id=?2 AND mec.id=?3 AND mec.id=req.mechanic_id AND mec.status = 0\n" +
            "INNER JOIN tb_tool_control_mat_mec AS matmec ON req.id = matmec.request_id\n" +
            "INNER JOIN tb_tool_control_material AS mat ON matmec.material_id = mat.id\n" +
            "INNER JOIN tb_tool_control_category AS cat ON mat.category_id = cat.id ", nativeQuery = true)
    List<IToolControlReport> filterMechanic(Integer companyId, Integer resaleId, Integer mechanicId);


    @Query(value = "SELECT mec.name,mec.photo FROM tb_tool_control_request AS req\n" +
            "INNER JOIN tb_mechanic AS mec  ON req.mechanic_id = mec.id AND req.company_id=?1 AND req.resale_id=?2 AND req.id=?3",nativeQuery = true)
   Map<String , Object> filterRequest(Integer companyId, Integer resaleId, Integer requestId);
}
