CREATE TABLE IF NOT EXISTS tb_notification(
company_id int not null,
resale_id int not null,
id binary(16) unique,
orig_user_id int not null,
orig_date datetime not null,
orig_role int not null,
dest_user_role_id int,
dest_user_id int,
dest_use_all tinyint not null,
vehicle_id int,
message varchar(255) not null,
FOREIGN KEY(company_id) REFERENCES tb_company(id),
FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
FOREIGN KEY(orig_user_id) REFERENCES tb_user(id),
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
PRIMARY KEY(id)
);