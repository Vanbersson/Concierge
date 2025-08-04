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
