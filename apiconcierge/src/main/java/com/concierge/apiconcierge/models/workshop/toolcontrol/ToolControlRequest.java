package com.concierge.apiconcierge.models.workshop.toolcontrol;

import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;
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

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "user_id_req")
    private Integer userIdReq;

    @Column(name = "date_req")
    private Date dateReq;

    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "user_id_dev")
    private Integer userIdDev;

    @Column(name = "date_dev")
    private Date dateDev;

    @JoinColumn(table = "tb_mechanic", referencedColumnName = "id")
    @Column(name = "mechanic_id")
    private Integer mechanicId;

}
