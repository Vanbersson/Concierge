package com.concierge.apiconcierge.models.vehicle;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SecondaryTable(name = "tb_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_resale", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_user", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
@SecondaryTable(name = "tb_client_company", pkJoinColumns = @PrimaryKeyJoinColumn(name = "id"))
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

    private String status;

    @Column(name = "step_entry")
    private Integer stepEntry;


    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "id_user_entry")
    private Integer idUserEntry;

    @Column(name = "name_user_entry")
    private String nameUserEntry;

    @Column(name = "date_entry")
    private Date dateEntry;


    @JoinColumn(table = "tb_user", referencedColumnName = "id")
    @Column(name = "id_user_exit_auth1")
    private Integer idUserExitAuth1;

    @Column(name = "name_user_exit_auth1")
    private String nameUserExitAuth1;

    @Column(name = "date_exit_auth1")
    private Date dateExitAuth1;






}
