package com.concierge.apiconcierge.models.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeCategory;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeRequest;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_mechanic", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@Entity
@Table(name = "tb_tool_control_request")
public class ToolControlRequest {

    @JoinColumn(table = "tb_company", referencedColumnName = "id")
    @Column(name = "company_id")
    private Integer companyId;

    @JoinColumn(table = "tb_resale", referencedColumnName = "id")
    @Column(name = "resale_id")
    private Integer resaleId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private StatusRequest status;

    @Column(name = "request_type")
    private TypeRequest requestType;

    @Column(name = "request_date")
    private Date requestDate;

    @Column(name = "request_information")
    private String requestInformation;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "request_user_id")
    private Integer requestUserId;

    @Column(name = "request_user_name")
    private String requestUserName;

    @Column(name = "category_type")
    private TypeCategory categoryType;

    @JoinColumn(table = "tb_mechanic", referencedColumnName = "id")
    @Column(name = "mechanic_id")
    private Integer mechanicId;
}
