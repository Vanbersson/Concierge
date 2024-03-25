package com.concierge.apiconcierge.models.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_user_image")
public class UserImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] image;
}
