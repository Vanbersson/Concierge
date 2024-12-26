 CREATE TABLE tb_address(
 id int not null auto_increment,
 zip_code varchar(8) not null,
 state varchar(2) not null,
 city varchar(100) not null,
 neighborhood varchar(100) not null,
 address varchar(100) not null,
 address_complement varchar(100),
 primary key(id)
 );

 CREATE TABLE tb_permission(
     id int not null,
     description varchar(255) not null,
     PRIMARY KEY(id)
 );

 CREATE TABLE tb_company(
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    name varchar(255) not null,
    cnpj varchar(14) unique not null,
    email varchar(100),
    cellphone varchar(11),
    phone varchar(10),
    zip_code varchar(8) not null,
    state varchar(2) not null,
    city varchar(100) not null,
    neighborhood varchar(100) not null,
    address varchar(100) not null,
    address_number varchar(10) not null,
    address_complement varchar(100),
    PRIMARY KEY(id)
 );

 CREATE TABLE tb_resale(
    company_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    name varchar(255) not null,
    cnpj varchar(14) unique not null,
    email varchar(100),
    cellphone varchar(11),
    phone varchar(10),
    zip_code varchar(8) not null,
    state varchar(2) not null,
    city varchar(100) not null,
    neighborhood varchar(100) not null,
    address varchar(100) not null,
    address_number varchar(10) not null,
    address_complement varchar(100),
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    PRIMARY KEY(id)
 );

 CREATE TABLE tb_user_role(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(100) not null,
     PRIMARY KEY(id),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id)
 );

 CREATE TABLE tb_user(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     name varchar(100) not null,
     email varchar(100) not null unique,
     password varchar(255) not null,
     cellphone varchar(11),
     limit_discount int,
     role_id int not null,
     role_desc varchar(100) not null,
     role_func tinyint not null,
     photo longblob,
     last_session datetime,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     FOREIGN KEY(role_id) REFERENCES tb_user_role(id),
     PRIMARY KEY(id)
 );

 create table tb_user_permission(
     company_id int not null,
     resale_id int not null,
     id binary(16) unique,
     user_id int not null,
     permission_id int not null,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     FOREIGN KEY(user_id) REFERENCES tb_user(id),
     FOREIGN KEY(permission_id) REFERENCES tb_permission(id),
     PRIMARY KEY(id)
 );

 CREATE TABLE tb_client_company_type(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(50) not null,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     PRIMARY KEY(id)
 );

 CREATE TABLE tb_client_company (
     company_id int not null,
     resale_id int not null,
     id int not null,
     status tinyint not null,
     name varchar(255) not null,
     fantasia varchar(255),
     clifor tinyint not null,
     fisjur tinyint not null,
     cnpj varchar(14),
     cpf varchar(11),
     rg varchar(11),
     email_home varchar(100),
     email_work varchar(100),
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
     contact_name varchar(100),
     contact_email varchar(100),
     contact_ddd_phone varchar(2),
     contact_phone varchar(8),
     contact_ddd_cellphone varchar(2),
     contact_cellphone varchar(9),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     primary KEY(id)
 );

 CREATE TABLE tb_vehicle_model(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(100) not null,
     photo longblob,
     PRIMARY KEY(id),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id)
 );

 create table tb_vehicle(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     placa varchar(7) not null,
     chassi varchar(17),
     frota varchar(20),
     year_manufacture varchar(4) not null,
     year_model varchar(4) not null,
     km_current varchar(20),
     km_last varchar(20),
     color tinyint not null,
     model_id int not null,
     owner_id int not null,
     attendant_id int not null,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     FOREIGN KEY(model_id) REFERENCES tb_vehicle_model(id),
     FOREIGN KEY(owner_id) REFERENCES tb_client_company(id),
     FOREIGN KEY(attendant_id) REFERENCES tb_user(id),
     PRIMARY KEY(id)

 );

 CREATE TABLE tb_parts(
    company_id int not null,
    resale_id int not null,
    id int not null,
    status tinyint not null,
    code varchar(20) not null,
    description varchar(100),
    qtd_available float,
    qtd_accounting float,
    unit_measure varchar(2) not null,
    location_street varchar(2),
    location_bookcase varchar(2),
    location_shelf varchar(2),
    date_last_entry datetime,
    primary key(id)
 );

 CREATE TABLE tb_vehicle_entry(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     step_entry tinyint not null,

     budget_status tinyint not null,

     id_user_entry int not null,
     name_user_entry varchar(100) not null,
     date_entry datetime not null,
     date_prevision_exit datetime,

     user_id_exit int,
     user_name_exit varchar(100),
     date_exit datetime,

     id_user_attendant int,
     name_user_attendant varchar(100),

     id_user_exit_auth1 int,
     name_user_exit_auth1 varchar(100),
     date_exit_auth1 datetime,

     id_user_exit_auth2 int,
     name_user_exit_auth2 varchar(100),
     date_exit_auth2 datetime,
     status_auth_exit tinyint not null,

     model_id int,
     model_description varchar(100),

     client_company_id int,
     client_company_name varchar(255),
     client_company_cnpj varchar(14),
     client_company_cpf varchar(11),
     client_company_rg varchar(11),

     driver_entry_name varchar(255) not null,
     driver_entry_cpf varchar(11),
     driver_entry_rg varchar(11),
     driver_entry_photo longblob,
     driver_entry_signature longblob,
     driver_entry_photo_doc1 longblob,
     driver_entry_photo_doc2 longblob,

     driver_exit_name varchar(255),
     driver_exit_cpf varchar(11),
     driver_exit_rg varchar(11),
     driver_exit_photo longblob,
     driver_exit_signature longblob,
     driver_exit_photo_doc1 longblob,
     driver_exit_photo_doc2 longblob,

     color tinyint,
     placa varchar(7),
     placas_junto varchar(255),
     frota varchar(10),
     vehicle_new tinyint not null,
     km_entry varchar(10),
     km_exit varchar(10),
     photo1 longblob,
     photo2 longblob,
     photo3 longblob,
     photo4 longblob,

     quantity_extinguisher int,
     quantity_traffic_cone int,
     quantity_tire int,
     quantity_tire_complete int,
     quantity_tool_box int,
     service_order tinyint not null,
     num_service_order varchar(20),
     num_nfe varchar(20),
     num_nfse varchar(20),
     information varchar(255),
     information_concierge varchar(255),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     FOREIGN KEY(id_user_entry) REFERENCES tb_user(id),
     FOREIGN KEY(id_user_attendant) REFERENCES tb_user(id),
     FOREIGN KEY(id_user_exit_auth1) REFERENCES tb_user(id),
     FOREIGN KEY(id_user_exit_auth2) REFERENCES tb_user(id),
     FOREIGN KEY(model_id) REFERENCES tb_vehicle_model(id),
     FOREIGN KEY(client_company_id) REFERENCES tb_client_company(id),
     PRIMARY KEY(id)

 );

 CREATE TABLE tb_type_payment(
      company_id int not null,
      resale_id int not null,
      id int not null AUTO_INCREMENT,
      status tinyint not null,
      description varchar(100),
      primary key(id)
 );

 CREATE TABLE tb_budget(
      company_id int not null,
      resale_id int not null,
      id int not null AUTO_INCREMENT,
      vehicle_entry_id int not null,
      status tinyint not null,
      date_generation datetime not null,
      date_validation datetime,
      date_authorization datetime,
      name_responsible varchar(100),
      type_payment varchar(100),
      id_user_attendant int not null,
      client_company_id int not null,
      information varchar(255),
      FOREIGN KEY(company_id) REFERENCES tb_company(id),
      FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
      FOREIGN KEY(vehicle_entry_id) REFERENCES tb_vehicle_entry(id),
      FOREIGN KEY(id_user_attendant) REFERENCES tb_user(id),
      FOREIGN KEY(client_company_id) REFERENCES tb_client_company(id),
      primary key(id)
  );

 CREATE TABLE tb_budget_requisition(
    company_id int not null,
    resale_id int not null,
    id binary(16) unique,
    budget_id int not null,
    ordem int not null,
    description varchar(100) not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
    primary key(id)
  );

 CREATE TABLE tb_budget_item(
      company_id int not null,
      resale_id int not null,
      id int not null,
      budget_id int not null,
      status tinyint not null,
      ordem int not null,
      code varchar(20) not null,
      description varchar(100) not null,
      quantity int not null,
      discount float not null,
      price float not null,
      FOREIGN KEY(company_id) REFERENCES tb_company(id),
      FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
      FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
      primary key(id)
  );

 CREATE TABLE tb_budget_service(
        company_id int not null,
        resale_id int not null,
        id binary(16) unique,
        budget_id int not null,
        status tinyint not null,
        ordem int not null,
        description varchar(100) not null,
        hour_service float not null,
        price float not null,
        discount float not null,
        FOREIGN KEY(company_id) REFERENCES tb_company(id),
        FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
        FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
        primary key(id)
    );

