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
@SecondaryTable(name = "tb_tool_control_request", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_tool_control_material", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
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

    @JoinColumn(table = "tb_tool_control_request", referencedColumnName = "id")
    @Column(name = "request_id")
    private Integer requestId;

    @Column(name = "quantity_req")
    private float quantityReq;

    @Column(name = "information_req")
    private String informationReq;

    @Column(name = "quantity_dev")
    private float quantityDev;

    @Column(name = "information_dev")
    private String informationDev;

    @JoinColumn(table = "tb_tool_control_material", referencedColumnName = "id")
    @Column(name = "material_id")
    private Integer materialId;

}
