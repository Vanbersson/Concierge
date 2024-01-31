create table tb_address(
id int not null auto_increment,
cep varchar(50) not null,
address varchar(255) not null,
city varchar(255) not null,
primary key(id)
);