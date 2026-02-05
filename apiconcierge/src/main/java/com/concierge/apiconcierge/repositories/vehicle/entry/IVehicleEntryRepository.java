package com.concierge.apiconcierge.repositories.vehicle.entry;

import com.concierge.apiconcierge.controllers.dashboard.interfaces.IDashCountVehiclePenAuthBud;
import com.concierge.apiconcierge.controllers.dashboard.interfaces.IDashValueTotalBudget;
import com.concierge.apiconcierge.models.enums.YesNot;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVehicleEntryRepository extends JpaRepository<VehicleEntry, Integer> {
    @Query(value = "SELECT * FROM `tb_vehicle_entry` WHERE company_id=?1 AND resale_id=?2 AND id=?3",
            nativeQuery = true)
    VehicleEntry filterId(Integer companyId, Integer resaleId, Integer id);

    @Query(value = "SELECT * FROM `tb_vehicle_entry` WHERE company_id=?1 AND resale_id=?2 AND vehicle_plate=?3",
            nativeQuery = true)
    VehicleEntry filterPlate(Integer companyId, Integer resaleId, String plate);

    @Query(value = "select * from tb_vehicle_entry where company_id=?1 AND resale_id=?2 AND auth_exit_status=2 AND step_entry!=4;",
            nativeQuery = true)
    List<VehicleEntry> allAuthorized(Integer companyId, Integer resaleId);

    @Query(value = "select * from tb_vehicle_entry where company_id=?1 and resale_id=?2 and step_entry!=4",
            nativeQuery = true)
    List<VehicleEntry> allPendingAuthorization(Integer companyId, Integer resaleId);

    //Dashboard
    @Query(value = "SELECT \n" +
            "COUNT(*) AS Pending,\n" +
            "COALESCE(COUNT(CASE WHEN status_auth_exit = 2 THEN 1 END), 0) AS Authorized,\n" +
            "COALESCE(COUNT(CASE WHEN budget_status != 0 THEN 1 END), 0) AS Budget\n" +
            "FROM tb_vehicle_entry \n" +
            "WHERE company_id = ?1 \n" +
            "AND resale_id = ?2 \n" +
            "AND status = 0;", nativeQuery = true)
    IDashCountVehiclePenAuthBud countVehiclePenAuthBud(Integer companyId, Integer resaleId);

    @Query(value = "SELECT  \n" +
            "(SELECT COALESCE(SUM((hour_service * price)-discount) ,0) AS sevicos FROM tb_budget_service WHERE budget_id=tbu.id) AS Service,\n" +
            "(SELECT COALESCE(SUM((quantity * price)-discount) ,0)  AS item FROM tb_budget_item WHERE budget_id=tbu.id) AS Part\n" +
            "FROM tb_vehicle_entry AS tbe\n" +
            "INNER JOIN tb_budget AS tbu ON(tbe.company_id=tbu.company_id) AND tbe.resale_id = tbu.resale_id AND tbe.id=tbu.vehicle_entry_id\n" +
            "WHERE tbe.company_id = ?1 \n" +
            "AND tbe.resale_id = ?2 \n" +
            "AND tbe.status = 0;",nativeQuery = true)
    List<IDashValueTotalBudget> valueTotalBudget(Integer companyId, Integer resaleId);

    @Query(value = "SELECT\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 1  THEN 1 END), 0) AS january,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 2  THEN 1 END), 0) AS february,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 3  THEN 1 END), 0) AS march,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 4  THEN 1 END), 0) AS april,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 5  THEN 1 END), 0) AS may,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 6  THEN 1 END), 0) AS june,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 7  THEN 1 END), 0) AS july,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 8  THEN 1 END), 0) AS august,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 9  THEN 1 END), 0) AS september,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 10 THEN 1 END), 0) AS october,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 11 THEN 1 END), 0) AS november,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 12 THEN 1 END), 0) AS december\n" +
            "FROM tb_vehicle_entry\n" +
            "WHERE company_id=?1\n" +
            "AND resale_id=?2\n" +
            "AND status = 1\n" +
            "AND service_order = ?3\n" +
            "AND YEAR(date_exit) = ?4;", nativeQuery = true)
    Object countServiceMonth(Integer companyId, Integer resaleId, YesNot serviceOrder, Integer year);

    @Query(value = "SELECT\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 1  THEN 1 END), 0) AS january,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 2  THEN 1 END), 0) AS february,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 3  THEN 1 END), 0) AS march,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 4  THEN 1 END), 0) AS april,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 5  THEN 1 END), 0) AS may,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 6  THEN 1 END), 0) AS june,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 7  THEN 1 END), 0) AS july,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 8  THEN 1 END), 0) AS august,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 9  THEN 1 END), 0) AS september,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 10 THEN 1 END), 0) AS october,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 11 THEN 1 END), 0) AS november,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 12 THEN 1 END), 0) AS december\n" +
            "FROM tb_vehicle_entry\n" +
            "WHERE company_id=?1\n" +
            "AND resale_id=?2\n" +
            "AND status = 1\n" +
            "AND service_order = ?3\n" +
            "AND YEAR(date_exit) = ?4\n" +
            "AND client_company_id = ?5;", nativeQuery = true)
    Object countServiceMonthClient(Integer companyId, Integer resaleId, YesNot serviceOrder, Integer year, Integer client);

    @Query(value = "SELECT\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 1  THEN 1 END), 0) AS january,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 2  THEN 1 END), 0) AS february,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 3  THEN 1 END), 0) AS march,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 4  THEN 1 END), 0) AS april,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 5  THEN 1 END), 0) AS may,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 6  THEN 1 END), 0) AS june,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 7  THEN 1 END), 0) AS july,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 8  THEN 1 END), 0) AS august,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 9  THEN 1 END), 0) AS september,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 10 THEN 1 END), 0) AS october,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 11 THEN 1 END), 0) AS november,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 12 THEN 1 END), 0) AS december\n" +
            "FROM tb_vehicle_entry\n" +
            "WHERE company_id=?1\n" +
            "AND resale_id=?2\n" +
            "AND YEAR(date_exit) = ?3;", nativeQuery = true)
    Object countVehicleMonth(Integer companyId, Integer resaleId, Integer year);

    @Query(value = "SELECT\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 1  THEN 1 END), 0) AS january,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 2  THEN 1 END), 0) AS february,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 3  THEN 1 END), 0) AS march,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 4  THEN 1 END), 0) AS april,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 5  THEN 1 END), 0) AS may,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 6  THEN 1 END), 0) AS june,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 7  THEN 1 END), 0) AS july,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 8  THEN 1 END), 0) AS august,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 9  THEN 1 END), 0) AS september,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 10 THEN 1 END), 0) AS october,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 11 THEN 1 END), 0) AS november,\n" +
            " COALESCE(COUNT(CASE WHEN MONTH(date_exit) = 12 THEN 1 END), 0) AS december\n" +
            "FROM tb_vehicle_entry\n" +
            "WHERE company_id=?1\n" +
            "AND resale_id=?2\n" +
            "AND YEAR(date_exit)=?3\n" +
            "AND client_company_id=?4;", nativeQuery = true)
    Object countVehicleClientMonth(Integer companyId, Integer resaleId, Integer year, Integer client);

}
