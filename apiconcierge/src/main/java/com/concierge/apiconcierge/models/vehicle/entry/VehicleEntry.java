package com.concierge.apiconcierge.models.vehicle.entry;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.enums.YesNot;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.vehicle.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_client_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_vehicle_model", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_driver", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_budget", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_vehicle_entry")
public class VehicleEntry implements Serializable {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusVehicleEnum status;
    @Column(name = "step_entry")
    private StepVehicleEnum stepEntry;

    @JoinColumn(table = "tb_budget", referencedColumnName = "id")
    @Column(name = "budget_id")
    private Integer budgetId;

    //User Entry
    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "entry_user_id")
    private Integer entryUserId;
    @Column(name = "entry_user_name")
    private String entryUserName;
    @Column(name = "entry_date")
    private Date entryDate;
    @Column(name = "entry_photo1_url")
    private String entryPhoto1Url;
    @Column(name = "entry_photo2_url")
    private String entryPhoto2Url;
    @Column(name = "entry_photo3_url")
    private String entryPhoto3Url;
    @Column(name = "entry_photo4_url")
    private String entryPhoto4Url;
    @Column(name = "entry_information")
    private String entryInformation;

    @Column(name = "exit_date_prevision")
    private Date exitDatePrevision;

    //User Exit
    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "exit_user_id")
    private Integer exitUserId;
    @Column(name = "exit_user_name")
    private String exitUserName;
    @Column(name = "exit_date")
    private Date exitDate;
    @Column(name = "exit_photo1_url")
    private String exitPhoto1Url;
    @Column(name = "exit_photo2_url")
    private String exitPhoto2Url;
    @Column(name = "exit_photo3_url")
    private String exitPhoto3Url;
    @Column(name = "exit_photo4_url")
    private String exitPhoto4Url;
    @Column(name = "exit_information")
    private String exitInformation;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "attendant_user_id")
    private Integer attendantUserId;
    @Column(name = "attendant_user_name")
    private String attendantUserName;
    @Column(name = "attendant_photo1_url")
    private String attendantPhoto1Url;
    @Column(name = "attendant_photo2_url")
    private String attendantPhoto2Url;
    @Column(name = "attendant_photo3_url")
    private String attendantPhoto3Url;
    @Column(name = "attendant_photo4_url")
    private String attendantPhoto4Url;

    @Column(name = "auth_exit_status")
    private StatusAuthExitEnum authExitStatus;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "auth1_exit_user_id")
    private Integer auth1ExitUserId;
    @Column(name = "auth1_exit_user_name")
    private String auth1ExitUserName;
    @Column(name = "auth1_exit_date")
    private Date auth1ExitDate;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "auth2_exit_user_id")
    private Integer auth2ExitUserId;
    @Column(name = "auth2_exit_user_name")
    private String auth2ExitUserName;
    @Column(name = "auth2_exit_date")
    private Date auth2ExitDate;

    @JoinColumn(table = "tb_vehicle_model", referencedColumnName = "id")
    @Column(name = "model_id")
    private Integer modelId;
    @Column(name = "model_description")
    private String modelDescription;

    @JoinColumn(table = "tb_client_company", referencedColumnName = "id")
    @Column(name = "client_company_id")
    private Integer clientCompanyId;
    @Column(name = "client_company_name")
    private String clientCompanyName;

    @JoinColumn(table = "tb_driver", referencedColumnName = "id")
    @Column(name = "driver_entry_id")
    private Integer driverEntryId;
    @Column(name = "driver_entry_name")
    private String driverEntryName;

    @JoinColumn(table = "tb_driver", referencedColumnName = "id")
    @Column(name = "driver_exit_id")
    private Integer driverExitId;
    @Column(name = "driver_exit_name")
    private String driverExitName;

    @Column(name = "vehicle_plate")
    private String vehiclePlate;
    @Column(name = "vehicle_plate_together")
    private String vehiclePlateTogether;
    @Column(name = "vehicle_fleet")
    private String vehicleFleet;
    @Column(name = "vehicle_color")
    private ColorVehicleEnum vehicleColor;
    @Column(name = "vehicle_km_entry")
    private String vehicleKmEntry;
    @Column(name = "vehicle_km_exit")
    private String vehicleKmExit;
    @Column(name = "vehicle_new")
    private YesNot vehicleNew;
    @Column(name = "vehicle_service_order")
    private YesNot vehicleServiceOrder;

    @Column(name = "num_service_order")
    private String numServiceOrder;
    @Column(name = "num_nfe")
    private String numNfe;
    @Column(name = "num_nfse")
    private String numNfse;

    @Column(name = "check_item1")
    private String checkItem1;
    @Column(name = "check_item2")
    private String checkItem2;
    @Column(name = "check_item3")
    private String checkItem3;
    @Column(name = "check_item4")
    private String checkItem4;
    @Column(name = "check_item5")
    private String checkItem5;
    @Column(name = "check_item6")
    private String checkItem6;
    @Column(name = "check_item7")
    private String checkItem7;
    @Column(name = "check_item8")
    private String checkItem8;
    @Column(name = "check_item9")
    private String checkItem9;
    @Column(name = "check_item10")
    private String checkItem10;
    @Column(name = "check_item11")
    private String checkItem11;
    @Column(name = "check_item12")
    private String checkItem12;
    @Column(name = "check_item13")
    private String checkItem13;
    @Column(name = "check_item14")
    private String checkItem14;
    @Column(name = "check_item15")
    private String checkItem15;
    @Column(name = "check_item16")
    private String checkItem16;
    @Column(name = "check_item17")
    private String checkItem17;
    @Column(name = "check_item18")
    private String checkItem18;
    @Column(name = "check_item19")
    private String checkItem19;
    @Column(name = "check_item20")
    private String checkItem20;

}
