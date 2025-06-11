create table tb_budget_token(
    company_id int not null,
    resale_id int not null,
  	id binary(16) unique,
    budget_id int not null,
    date_valid datetime not null,
    FOREIGN KEY(company_id) REFERENCES tb_company(id),
    FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
    PRIMARY KEY(id)
);