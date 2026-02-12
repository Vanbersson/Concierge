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

 CREATE TABLE IF NOT EXISTS tb_payment_type(
   company_id int not null,
   resale_id int not null,
   id int not null AUTO_INCREMENT,
   status tinyint not null,
   description varchar(100),
   primary key(id)
  );

 CREATE TABLE IF NOT EXISTS tb_permission(
     id int not null,
     description varchar(255) not null,
     menu varchar(100) not null,
     PRIMARY KEY(id)
 );

 CREATE TABLE IF NOT EXISTS tb_menu(
      id varchar(10) not null,
      description varchar(100) not null,
      PRIMARY KEY(id)
  );

 CREATE TABLE IF NOT EXISTS tb_company(
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    name varchar(255) not null,
    fantasia varchar(255),
    logo_url varchar(255),
    cnpj varchar(14) unique not null,
    ie varchar(20),
    im varchar(20),
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
    fantasia varchar(255),
    logo_url varchar(255),
    cnpj varchar(14) unique not null,
    ie varchar(20),
    im varchar(20),
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
     photo_url varchar(255),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     FOREIGN KEY(role_id) REFERENCES tb_user_role(id),
     PRIMARY KEY(id)
 );

 CREATE TABLE IF NOT EXISTS tb_user_permission(
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

 CREATE TABLE IF NOT EXISTS tb_user_menu(
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

 CREATE TABLE IF NOT EXISTS tb_client_category(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(100) not null,
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     PRIMARY KEY(id)
 );

 CREATE TABLE IF NOT EXISTS tb_client_company (
     company_id int not null,
     resale_id int not null,
     date_register datetime not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     name varchar(255) not null,
     fantasia varchar(255),
     category_id int not null,
     clifor tinyint not null,
     fisjur tinyint not null,
     cnpj varchar(14),
     ie varchar(20),
     im varchar(20),
     cpf varchar(11),
     rg varchar(11),
     rg_expedidor varchar(11),
     date_birth datetime,
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
     FOREIGN KEY(category_id) REFERENCES tb_client_category(id),
     primary KEY(id)
 );

 CREATE TABLE IF NOT EXISTS tb_vehicle_model(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(100) not null,
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
    photo_url varchar(255),
    primary key(id)
 );

 CREATE TABLE IF NOT EXISTS tb_budget(
       company_id int not null,
       resale_id int not null,
       id int not null AUTO_INCREMENT,
       status tinyint not null,
       date_generation datetime not null,
       date_validation datetime,
       date_authorization datetime,
       name_responsible varchar(100),
       payment_type_id int,
       payment_type_desc varchar(100),
       attendant_user_id int not null,
       attendant_user_name varchar(100),
       client_company_id int not null,
       client_company_name varchar(100),
       client_send_date datetime,
       client_approved_date datetime,
       information varchar(255),
       FOREIGN KEY(company_id) REFERENCES tb_company(id),
       FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
       FOREIGN KEY(payment_type_id) REFERENCES tb_payment_type(id),
       FOREIGN KEY(attendant_user_id) REFERENCES tb_user(id),
       FOREIGN KEY(client_company_id) REFERENCES tb_client_company(id),
       primary key(id)
   );

 CREATE TABLE IF NOT EXISTS tb_budget_requisition(
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

 CREATE TABLE IF NOT EXISTS tb_budget_service(
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

 CREATE TABLE IF NOT EXISTS tb_driver(
       company_id int not null,
       resale_id int not null,
       date_register datetime not null,
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
       photo_driver_url varchar(255),
       photo_doc1_url varchar(255),
       photo_doc2_url varchar(255),
       FOREIGN KEY(company_id) REFERENCES tb_company(id),
       FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
       PRIMARY KEY(id)
   );

 CREATE TABLE IF NOT EXISTS tb_vehicle_entry(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     step_entry tinyint not null,

     budget_id int,

     entry_user_id int not null,
     entry_user_name varchar(100) not null,
     entry_date datetime not null,
     entry_photo1_url varchar(255),
     entry_photo2_url varchar(255),
     entry_photo3_url varchar(255),
     entry_photo4_url varchar(255),
     entry_information varchar(255),

     exit_date_prevision datetime,

     exit_user_id int,
     exit_user_name varchar(100),
     exit_date datetime,
     exit_photo1_url varchar(255),
     exit_photo2_url varchar(255),
     exit_photo3_url varchar(255),
     exit_photo4_url varchar(255),
     exit_information varchar(255),

     attendant_user_id int,
     attendant_user_name varchar(100),
     attendant_photo1_url varchar(255),
     attendant_photo2_url varchar(255),
     attendant_photo3_url varchar(255),
     attendant_photo4_url varchar(255),
     attendant_information varchar(255),

     auth_exit_status tinyint not null,

     auth1_exit_user_id int,
     auth1_exit_user_name varchar(100),
     auth1_exit_date datetime,

     auth2_exit_user_id int,
     auth2_exit_user_name varchar(100),
     auth2_exit_date datetime,

     model_id int,
     model_description varchar(100),

     client_company_id int,
     client_company_name varchar(255),

     driver_entry_id int,
     driver_entry_name varchar(255) not null,

     driver_exit_id int,
     driver_exit_name varchar(255),

     vehicle_plate varchar(7),
     vehicle_plate_together varchar(255),
     vehicle_fleet varchar(10),
     vehicle_color tinyint,
     vehicle_km_entry varchar(10),
     vehicle_km_exit varchar(10),
     vehicle_new tinyint not null,
     vehicle_service_order tinyint not null,

     num_service_order varchar(20),
     num_nfe varchar(20),
     num_nfse varchar(20),

     check_item1 varchar(100),
     check_item2 varchar(100),
     check_item3 varchar(100),
     check_item4 varchar(100),
     check_item5 varchar(100),
     check_item6 varchar(100),
     check_item7 varchar(100),
     check_item8 varchar(100),
     check_item9 varchar(100),
     check_item10 varchar(100),
     check_item11 varchar(100),
     check_item12 varchar(100),
     check_item13 varchar(100),
     check_item14 varchar(100),
     check_item15 varchar(100),
     check_item16 varchar(100),
     check_item17 varchar(100),
     check_item18 varchar(100),
     check_item19 varchar(100),
     check_item20 varchar(100),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
     FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
     FOREIGN KEY(entry_user_id) REFERENCES tb_user(id),
     FOREIGN KEY(exit_user_id) REFERENCES tb_user(id),
     FOREIGN KEY(attendant_user_id) REFERENCES tb_user(id),
     FOREIGN KEY(auth1_exit_user_id) REFERENCES tb_user(id),
     FOREIGN KEY(auth2_exit_user_id) REFERENCES tb_user(id),
     FOREIGN KEY(model_id) REFERENCES tb_vehicle_model(id),
     FOREIGN KEY(client_company_id) REFERENCES tb_client_company(id),
     FOREIGN KEY(driver_entry_id) REFERENCES tb_driver(id),
     FOREIGN KEY(driver_exit_id) REFERENCES tb_driver(id),
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

 CREATE TABLE IF NOT EXISTS tb_mechanic_role(
     company_id int not null,
     resale_id int not null,
     id int not null AUTO_INCREMENT,
     status tinyint not null,
     description varchar(100) not null,
     PRIMARY KEY(id),
     FOREIGN KEY(company_id) REFERENCES tb_company(id),
     FOREIGN KEY(resale_id) REFERENCES tb_resale(id)
 );

 CREATE TABLE IF NOT EXISTS tb_mechanic(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    name varchar(100) not null,
    code_password int not null,
    role_id int not null,
    photo_url varchar(255),
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(role_id) REFERENCES tb_mechanic_role(id),
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
    photo_url varchar(255),
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
    id binary(16) unique not null,
    request_id int not null,
    delivery_user_id int,
    delivery_user_name varchar(100),
    delivery_date datetime not null,
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

CREATE TABLE IF NOT EXISTS tb_notification(
    company_id int not null,
    resale_id int not null,
    id binary(16) unique,
    orig_user_id int not null,
    orig_user_name varchar(100) not null,
    orig_date datetime not null,
    orig_role_id int not null,
    orig_role_desc varchar(100) not null,
    orig_notification_menu tinyint not null,
    dest_user_id int,
    dest_user_role_id int,
    dest_user_all tinyint not null,
    vehicle_id int,
    budget_id int,
    purchase_order_id int,
    tool_control_request_id int,
    header varchar(100) not null,
    message1 varchar(100) not null,
    message2 varchar(100),
    message3 varchar(100),
    share_message tinyint not null,
    delete_message tinyint not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(orig_user_id) REFERENCES tb_user(id),
    FOREIGN KEY(orig_role_id) REFERENCES tb_user_role(id),
    FOREIGN KEY(dest_user_id) REFERENCES tb_user(id),
    FOREIGN KEY(dest_user_role_id) REFERENCES tb_user_role(id),
    FOREIGN KEY(vehicle_id) REFERENCES tb_vehicle_entry(id),
    FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
    FOREIGN KEY(purchase_order_id) REFERENCES tb_purchase_order(id),
    FOREIGN KEY(tool_control_request_id) REFERENCES tb_tool_control_request(id),
    PRIMARY KEY(id)
);

 CREATE TABLE IF NOT EXISTS tb_notification_user(
    company_id int not null,
    resale_id int not null,
    id binary(16) unique,
    notification_id binary(16),
    user_id int,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(notification_id) REFERENCES tb_notification(id),
    FOREIGN KEY(user_id) REFERENCES tb_user(id),
    PRIMARY KEY(id)
);

