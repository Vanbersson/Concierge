CREATE TABLE IF NOT EXISTS tb_driver(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    name varchar(100) not null,
    cpf varchar(11) not null,
    rg varchar(11) not null,
    date_birth datetime not null,
    male_female tinyint not null,
    cnh_register varchar(11) not null,
    cnh_category varchar(10) not null,
    cnh_validation datetime not null,
    email varchar(100),
    ddd_cellphone varchar(2),
    cellphone varchar(9),
    ddd_phone varchar(2),
    phone varchar(8),
    zip_code varchar(8) not null,
    state varchar(2) not null,
    city varchar(100) not null,
    neighborhood varchar(100) not null,
    address varchar(100) not null,
    address_number varchar(10) not null,
    address_complement varchar(100),
    photo_driver longblob,
    photo_doc1 longblob,
    photo_doc2 longblob,
    user_id int not null,
    user_name varchar(100) not null,
    date_register datetime not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(user_id) REFERENCES tb_user(id),
    PRIMARY KEY(id)
);

ALTER TABLE tb_vehicle_entry ADD COLUMN driver_entry_id int;
ALTER TABLE tb_vehicle_entry ADD FOREIGN KEY (driver_entry_id) REFERENCES tb_driver(id);
ALTER TABLE tb_vehicle_entry ADD COLUMN driver_exit_id int;
ALTER TABLE tb_vehicle_entry ADD FOREIGN KEY (driver_exit_id) REFERENCES tb_driver(id);




