create table tb_resale(
company_id int not null,
id int not null auto_increment,
status enum('S','N') not null default('S'),
name varchar(255) not null,
cnpj varchar(14) not null,
address_id int not null,
primary key(id),
foreign key(company_id) references tb_company(id),
foreign key(address_id) references tb_address(id)
);