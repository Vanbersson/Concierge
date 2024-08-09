 CREATE TABLE tb_address(
 id int not null auto_increment,
 state varchar(2) not null,
 city varchar(100) not null,
 zip_code varchar(20) not null,
 address varchar(100) not null,
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
    cnpj varchar(14) not null,
    email varchar(100),
    cellphone varchar(11),
    phone varchar(10),
    state varchar(2) not null,
    city varchar(100) not null,
    zip_code varchar(20) not null,
    address varchar(100) not null,
    address_number varchar(10) not null,
    PRIMARY KEY(id)
 );

 CREATE TABLE tb_resale(
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    name varchar(255) not null,
    cnpj varchar(14) not null,
    email varchar(100),
    cellphone varchar(11),
    phone varchar(10),
    state varchar(2) not null,
    city varchar(100) not null,
    zip_code varchar(20) not null,
    address varchar(100) not null,
    address_number varchar(10) not null,
    company_id int not null,
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
     email varchar(100) not null,
     password varchar(8) not null,
     cellphone varchar(11),
     role_id int not null,
     photo longblob,
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
     type tinyint not null,
     description varchar(50) not null,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     PRIMARY KEY(id)
 );

 CREATE TABLE tb_client_company (
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     name varchar(255) not null,
     cnpj varchar(14),
     cpf varchar(11),
     rg varchar(11),
     email varchar(100),
     cellphone varchar(11),
     phone varchar(10),
     type_id int not null,
     type tinyint not null,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     FOREIGN KEY(type_id) REFERENCES tb_client_company_type(id),
     primary KEY(id)
 );

 CREATE TABLE tb_vehicle_model(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(100) not null,
     image longblob,
     PRIMARY KEY(id),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id)
 );

 CREATE TABLE tb_budget(
      company_id int not null,
      resale_id int not null,
      id int not null AUTO_INCREMENT,
      status tinyint not null,
      date_geration datetime not null,
      date_auth datetime,
      FOREIGN KEY(company_id) REFERENCES tb_company(id),
      FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
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
      id int not null AUTO_INCREMENT,
      budget_id int not null,
      status tinyint not null,
      code_item varchar(20) not null,
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
        id int not null AUTO_INCREMENT,
        budget_id int not null,
        status tinyint not null,
        description varchar(100) not null,
        hour_service float not null,
        price float not null,
        discount float not null,
        FOREIGN KEY(company_id) REFERENCES tb_company(id),
        FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
        FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
        primary key(id)
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


 CREATE TABLE tb_vehicle_entry(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     step_entry tinyint not null,
     budget_id int,
     budget_status tinyint not null,

     id_user_entry int not null,
     name_user_entry varchar(100) not null,
     date_entry datetime not null,
     date_prevision_exit datetime,

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

     client_company_id int not null,
     client_company_name varchar(255) not null,
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
     FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
     FOREIGN KEY(id_user_entry) REFERENCES tb_user(id),
     FOREIGN KEY(id_user_attendant) REFERENCES tb_user(id),
     FOREIGN KEY(id_user_exit_auth1) REFERENCES tb_user(id),
     FOREIGN KEY(id_user_exit_auth2) REFERENCES tb_user(id),
     FOREIGN KEY(model_id) REFERENCES tb_vehicle_model(id),
     PRIMARY KEY(id)

 );

