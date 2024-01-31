create table tb_user(
company_id int not null,
resale_id int not null,
id int not null auto_increment,
status enum('S','N') not null default('S'),
name varchar(255) not null,
login varchar(255) not null,
password varchar(255) not null,
email varchar(255) not null,
cellphone varchar(11),
role_id int not null,
primary key(id),
foreign key(company_id) references tb_company(id),
foreign key(resale_id) references tb_resale(id),
foreign key(role_id) references tb_user_role(id)
);