 CREATE TABLE IF NOT EXISTS tb_address(
 id int not null auto_increment,
 zip_code varchar(8) not null,
 state varchar(2) not null,
 city varchar(100) not null,
 neighborhood varchar(100) not null,
 address varchar(100) not null,
 address_complement varchar(100),
 primary key(id)
 );

 CREATE TABLE IF NOT EXISTS tb_permission(
     id int not null,
     description varchar(255) not null,
     PRIMARY KEY(id)
 );

 CREATE TABLE tb_menu(
      id varchar(10) not null,
      description varchar(100) not null,
      PRIMARY KEY(id)
  );

 CREATE TABLE IF NOT EXISTS tb_company(
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

 CREATE TABLE IF NOT EXISTS tb_resale(
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

 CREATE TABLE IF NOT EXISTS tb_user_role(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(100) not null,
     PRIMARY KEY(id),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id)
 );

 CREATE TABLE IF NOT EXISTS tb_user(
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

 create table IF NOT EXISTS tb_user_permission(
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

 create table IF NOT EXISTS tb_user_menu(
      company_id int not null,
      resale_id int not null,
      id binary(16) unique,
      user_id int not null,
      menu_id varchar(10) not null,
      FOREIGN KEY(company_id) REFERENCES tb_company(id),
      FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
      FOREIGN KEY(user_id) REFERENCES tb_user(id),
      FOREIGN KEY(menu_id) REFERENCES tb_menu(id),
      PRIMARY KEY(id)
  );

 CREATE TABLE IF NOT EXISTS tb_client_company_type(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(50) not null,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     PRIMARY KEY(id)
 );

 CREATE TABLE IF NOT EXISTS tb_client_company (
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

 CREATE TABLE IF NOT EXISTS tb_vehicle_model(
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

 CREATE TABLE IF NOT EXISTS tb_vehicle(
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

 CREATE TABLE IF NOT EXISTS tb_part(
    company_id int not null,
    resale_id int not null,
    id int not null,
    status tinyint not null,
    code varchar(20) not null,
    description varchar(100),
    qtd_available float,
    qtd_accounting float,
    unit_measure varchar(2) not null,
    price float not null,
    location_street varchar(2),
    location_bookcase varchar(2),
    location_shelf varchar(2),
    date_last_entry datetime,
    primary key(id)
 );

 CREATE TABLE IF NOT EXISTS tb_vehicle_entry(
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
      client_send_date datetime,
      client_approved_date datetime,
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

 CREATE TABLE IF NOT EXISTS tb_budget_item(
      company_id int not null,
      resale_id int not null,
      id binary(16) unique,
      status tinyint not null,
      budget_id int not null,
      ordem int not null,
      part_id int not null,
      code varchar(20) not null,
      description varchar(100) not null,
      quantity float not null,
      discount float not null,
      price float not null,
      FOREIGN KEY(company_id) REFERENCES tb_company(id),
      FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
      FOREIGN KEY(part_id) REFERENCES tb_part(id),
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

 CREATE TABLE IF NOT EXISTS tb_budget_token(
        company_id int not null,
        resale_id int not null,
        id binary(16) unique,
        budget_id int not null,
        date_valid datetime not null,
        FOREIGN KEY(company_id) REFERENCES tb_company(id),
        FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
        PRIMARY KEY(id)
    );


 CREATE TABLE IF NOT EXISTS tb_purchase_order(
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
        date_received datetime,
        information varchar(255),
        FOREIGN KEY(company_id) REFERENCES tb_company(id),
        FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
        FOREIGN KEY(responsible_id) REFERENCES tb_user(id),
        FOREIGN KEY(client_company_id) REFERENCES tb_client_company(id),
        PRIMARY KEY(id)
    );

 CREATE TABLE IF NOT EXISTS tb_purchase_order_item(
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


 CREATE TABLE IF NOT EXISTS tb_mechanic(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    name varchar(100) not null,
    code_password int not null,
    photo longblob,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    PRIMARY KEY(id)
);


 CREATE TABLE IF NOT EXISTS tb_tool_control_category(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    type tinyint not null,
    quantity_req int not null,
    description varchar(100) not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    PRIMARY KEY(id)
);

 CREATE TABLE IF NOT EXISTS tb_tool_control_material(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    type tinyint not null,
    number_ca int,
    description varchar(100) not null,
    category_id int not null,
    quantity_accounting_loan float not null,
    quantity_available_loan float not null,
    quantity_accounting_kit float not null,
    quantity_available_kit float not null,
    validity_day int,
    photo longblob,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(category_id) REFERENCES tb_tool_control_category(id),
    PRIMARY KEY(id)
);

 CREATE TABLE IF NOT EXISTS tb_tool_control_request(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    request_type tinyint not null,
    request_date datetime not null,
    request_information varchar(255),
    request_user_id int not null,
    request_user_name varchar(100) not null,
    category_type tinyint not null,
    mechanic_id int not null,
    FOREIGN KEY(request_user_id) REFERENCES tb_user(id),
    FOREIGN KEY(mechanic_id) REFERENCES tb_mechanic(id),
    PRIMARY KEY(id)
);

 CREATE TABLE IF NOT EXISTS tb_tool_control_mat_mec(
    company_id int not null,
    resale_id int not null,
    id binary(16) unique,
    request_id int not null,
    delivery_user_id int,
    delivery_user_name varchar(100),
    delivery_date int not null,
    delivery_quantity float not null,
    delivery_information varchar(255),
    return_user_id int,
    return_user_name varchar(100),
    return_date datetime,
    return_quantity float,
    return_information varchar(255),
    material_id int not null,
    material_description varchar(100),
    material_number_ca int,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(request_id) REFERENCES tb_tool_control_request(id),
    FOREIGN KEY(delivery_user_id) REFERENCES tb_user(id),
    FOREIGN KEY(return_user_id) REFERENCES tb_user(id),
    FOREIGN KEY(material_id) REFERENCES tb_tool_control_material(id),
    PRIMARY KEY(id)
);

 CREATE TABLE IF NOT EXISTS tb_tool_control_kit_mec(
    company_id int not null,
    resale_id int not null,
    id binary(16) unique,
    request_id int not null,
    quantity_req float not null,
    quantity_ret float,
    user_id_ret int,
    date_ret datetime,
    information_ret varchar(255),
    material_id int not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(user_id_ret) REFERENCES tb_user(id),
    FOREIGN KEY(request_id) REFERENCES tb_tool_control_request(id),
    FOREIGN KEY(material_id) REFERENCES tb_tool_control_material(id),
    PRIMARY KEY(id)
);

