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
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
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

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "delivery_user_id")
    private Integer deliveryUserId;

    @Column(name = "delivery_user_name")
    private String deliveryUserName;

    @Column(name = "delivery_date")
    private Date deliveryDate;

    @Column(name = "delivery_quantity")
    private float deliveryQuantity;

    @Column(name = "delivery_information")
    private String deliveryInformation;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "return_user_id")
    private Integer returnUserId;

    @Column(name = "return_user_name")
    private String returnUserName;

    @Column(name = "return_date")
    private Date returnDate;

    @Column(name = "return_quantity")
    private float returnQuantity;

    @Column(name = "return_information")
    private String returnInformation;

    @JoinColumn(table = "tb_tool_control_material", referencedColumnName = "id")
    @Column(name = "material_id")
    private Integer materialId;

    @Column(name = "material_description")
    private String materialDescription;

    @Column(name = "material_number_ca")
    private Integer materialNumberCA;
}
