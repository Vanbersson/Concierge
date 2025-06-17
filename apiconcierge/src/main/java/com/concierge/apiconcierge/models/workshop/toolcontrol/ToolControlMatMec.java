package com.concierge.apiconcierge.models.workshop.toolcontrol;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_tool_control_material", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_mechanic", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_tool_control_mat_mec")
public class ToolControlMatMec {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "user_id_req")
    private Integer userIdReq;

    @Column(name = "quantity_req")
    private Integer quantityReq;

    @Column(name = "date_req")
    private Date dateReq;

    @Column(name = "information_req")
    private String informationReq;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "user_id_dev")
    private Integer userIdDev;

    @Column(name = "quantity_dev")
    private Integer quantityDev;

    @Column(name = "date_dev")
    private Date dateDev;

    @Column(name = "information_dev")
    private String informationDev;

    @JoinColumn(table = "tb_mechanic", referencedColumnName = "id")
    @Column(name = "mechanic_id")
    private Integer mechanicId;

    @JoinColumn(table = "tb_tool_control_material", referencedColumnName = "id")
    @Column(name = "material_id")
    private Integer materialId;

}
