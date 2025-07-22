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
    type_material tinyint not null,
    user_id_req int not null,
    date_req datetime not null,
    information_req varchar(255),
    mechanic_id int not null,
    FOREIGN KEY(user_id_req) REFERENCES tb_user(id),
    FOREIGN KEY(mechanic_id) REFERENCES tb_mechanic(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tb_tool_control_mat_mec(
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
