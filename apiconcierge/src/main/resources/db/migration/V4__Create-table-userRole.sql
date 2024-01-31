create table tb_user_role(
company_id int not null,
resale_id int not null,
id int not null auto_increment,
status enum('S','N') not null default('S'),
description varchar(255) not null,
role varchar(5) not null,
primary key(id),
foreign key(company_id) references tb_company(id),
foreign key(resale_id) references tb_resale(id)
);