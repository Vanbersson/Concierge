create table tb_purchase_order(
    company_id int not null,
    resale_id int not null,
  	id int not null AUTO_INCREMENT,
    status tinyint not null,
    date_generation datetime not null,
    date_delivery datetime not null,
    responsible_id int not null,
    responsible_name varchar(100) not null,
    client_company_id int not null,
    client_company_name varchar(100) not null,
    attendant_name varchar(100) not null,
    attendant_email varchar(100),
    attendant_ddd_cellphone varchar(2),
    attendant_cellphone varchar(9),
    attendant_ddd_phone varchar(2),
    attendant_phone varchar(8),
    payment_type varchar(100) not null,
    nf_num int,
    nf_serie varchar(5),
    nf_date datetime,
    nf_key varchar(44),
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(responsible_id) REFERENCES tb_user(id),
    FOREIGN KEY(client_company_id) REFERENCES tb_client_company(id),
    PRIMARY KEY(id)
);

create table tb_purchase_order_item(
    company_id int not null,
    resale_id int not null,
  	id binary(16) unique,
    purchase_id int not null,
    part_id int not null,
    part_code varchar(20) not null,
    part_description varchar(100) not null,
    quantity float not null,
    discount float not null,
    price float not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(purchase_id) REFERENCES tb_purchase_order(id),
    FOREIGN KEY(part_id) REFERENCES tb_part(id),
    PRIMARY KEY(id)
);