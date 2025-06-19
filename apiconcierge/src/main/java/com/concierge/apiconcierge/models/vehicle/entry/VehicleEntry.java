package com.concierge.apiconcierge.models.vehicle.entry;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
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

    @Column(name = "budget_status")
    private StatusBudgetEnum budgetStatus;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "id_user_entry")
    private Integer idUserEntry;

    @Column(name = "name_user_entry")
    private String nameUserEntry;

    @Column(name = "date_entry")
    private Date dateEntry;

    @Column(name = "date_prevision_exit")
    private Date datePrevisionExit;

    @Column(name = "user_id_exit")
    private Integer userIdExit;

    @Column(name = "user_name_exit")
    private String userNameExit;

    @Column(name = "date_exit")
    private Date dateExit;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "id_user_attendant")
    private Integer idUserAttendant;

    @Column(name = "name_user_attendant")
    private String nameUserAttendant;


    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "id_user_exit_auth1")
    private Integer idUserExitAuth1;

    @Column(name = "name_user_exit_auth1")
    private String nameUserExitAuth1;

    @Column(name = "date_exit_auth1")
    private Date dateExitAuth1;


    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "id_user_exit_auth2")
    private Integer idUserExitAuth2;

    @Column(name = "name_user_exit_auth2")
    private String nameUserExitAuth2;

    @Column(name = "date_exit_auth2")
    private Date dateExitAuth2;

    @Column(name = "status_auth_exit")
    private StatusAuthExitEnum statusAuthExit;


    @JoinColumn(table = "tb_vehicle_model", referencedColumnName = "id")
    @Column(name = "model_id")
    private Integer modelId;

    @Column(name = "model_description")
    private String modelDescription;

    //Empresa
    @JoinColumn(table = "tb_client_company", referencedColumnName = "id")
    @Column(name = "client_company_id")
    private Integer clientCompanyId;

    @Column(name = "client_company_name")
    private String clientCompanyName;

    @Column(name = "client_company_cnpj")
    private String clientCompanyCnpj;

    @Column(name = "client_company_cpf")
    private String clientCompanyCpf;

    @Column(name = "client_company_rg")
    private String clientCompanyRg;

    //Motorista entrada
    @Column(name = "driver_entry_name")
    private String driverEntryName;

    @Column(name = "driver_entry_cpf")
    private String driverEntryCpf;

    @Column(name = "driver_entry_rg")
    private String driverEntryRg;

    @Lob
    @Column(name = "driver_entry_photo")
    private byte[] driverEntryPhoto;

    @Lob
    @Column(name = "driver_entry_signature")
    private byte[] driverEntrySignature;

    @Lob
    @Column(name = "driver_entry_photo_doc1")
    private byte[] driverEntryPhotoDoc1;

    @Lob
    @Column(name = "driver_entry_photo_doc2")
    private byte[] driverEntryPhotoDoc2;

    //Motorista saída
    @Column(name = "driver_exit_name")
    private String driverExitName;

    @Column(name = "driver_exit_cpf")
    private String driverExitCpf;

    @Column(name = "driver_exit_rg")
    private String driverExitRg;

    @Lob
    @Column(name = "driver_exit_photo")
    private byte[] driverExitPhoto;

    @Lob
    @Column(name = "driver_exit_signature")
    private byte[] driverExitSignature;

    @Lob
    @Column(name = "driver_exit_photo_doc1")
    private byte[] driverExitPhotoDoc1;

    @Lob
    @Column(name = "driver_exit_photo_doc2")
    private byte[] driverExitPhotoDoc2;

    private ColorVehicleEnum color;

    private String placa;

    @Column(name = "placas_junto")
    private String placasJunto;

    private String frota;

    @Column(name = "vehicle_new")
    private VehicleYesNotEnum vehicleNew;

    @Column(name = "km_entry")
    private String kmEntry;

    @Column(name = "km_exit")
    private String kmExit;

    @Lob
    private byte[] photo1;

    @Lob
    private byte[] photo2;

    @Lob
    private byte[] photo3;

    @Lob
    private byte[] photo4;

    @Column(name = "quantity_extinguisher")
    private Integer quantityExtinguisher;

    @Column(name = "quantity_traffic_cone")
    private Integer quantityTrafficCone;

    @Column(name = "quantity_tire")
    private Integer quantityTire;

    @Column(name = "quantity_tire_complete")
    private Integer quantityTireComplete;

    @Column(name = "quantity_tool_box")
    private Integer quantityToolBox;

    @Column(name = "service_order")
    private VehicleYesNotEnum serviceOrder;

    @Column(name = "num_service_order")
    private String numServiceOrder;

    @Column(name = "num_nfe")
    private String numNfe;

    @Column(name = "num_nfse")
    private String numNfse;

    private String information;

    @Column(name = "information_concierge")
    private String informationConcierge;

}
