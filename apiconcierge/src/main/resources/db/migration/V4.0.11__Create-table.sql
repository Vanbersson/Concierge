CREATE TABLE tb_tool_control_category(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    description varchar(100) not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    PRIMARY KEY(id)
);

CREATE TABLE tb_tool_control_material(
    company_id int not null,
    resale_id int not null,
    id int not null AUTO_INCREMENT,
    status tinyint not null,
    description varchar(100) not null,
    category_id int not null,
    valid int,
    photo longblob,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(category_id) REFERENCES tb_tool_control_category(id),
    PRIMARY KEY(id)
);

CREATE TABLE tb_mechanic(
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

CREATE TABLE tb_tool_control_mat_mec(
    company_id int not null,
    resale_id int not null,
    id binary(16) unique,
    user_id_req int not null,
    quantity_req int not null,
    date_req datetime not null,
    information_req varchar(255),
    user_id_dev int,
    quantity_dev int,
    date_dev datetime,
    information_dev varchar(255),
    mechanic_id int not null,
    material_id int not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    FOREIGN KEY(user_id_req) REFERENCES tb_user(id),
    FOREIGN KEY(user_id_dev) REFERENCES tb_user(id),
    FOREIGN KEY(mechanic_id) REFERENCES tb_mechanic(id),
    FOREIGN KEY(material_id) REFERENCES tb_tool_control_material(id),
    PRIMARY KEY(id)
);
