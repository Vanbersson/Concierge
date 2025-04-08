DROP table tb_budget_item;
DROP table tb_parts;

 CREATE TABLE tb_part(
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

 CREATE TABLE tb_budget_item(
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