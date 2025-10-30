CREATE TABLE IF NOT EXISTS tb_notification(
company_id int not null,
resale_id int not null,
id binary(16) unique,

orig_user_id int not null,
orig_user_name varchar(100) not null,
orig_date datetime not null,
orig_role_id int not null,
orig_role_desc varchar(100) not null,
orig_notification_menu tinyint not null,

dest_user_id int,
dest_user_role_id int,
dest_user_all tinyint not null,

vehicle_id int,
budget_id int,
purchase_order_id int,
tool_control_request_id int,

header varchar(100) not null,
message1 varchar(100) not null,
message2 varchar(100),
message3 varchar(100),
share_message tinyint not null,
delete_message tinyint not null,

FOREIGN KEY(company_id) REFERENCES tb_company(id),
FOREIGN KEY(resale_id) REFERENCES tb_resale(id),
FOREIGN KEY(orig_user_id) REFERENCES tb_user(id),
FOREIGN KEY(orig_role_id) REFERENCES tb_user_role(id),
FOREIGN KEY(dest_user_id) REFERENCES tb_user(id),
FOREIGN KEY(dest_user_role_id) REFERENCES tb_user_role(id),
FOREIGN KEY(vehicle_id) REFERENCES tb_vehicle_entry(id),
FOREIGN KEY(budget_id) REFERENCES tb_budget(id),
FOREIGN KEY(purchase_order_id) REFERENCES tb_purchase_order(id),
FOREIGN KEY(tool_control_request_id) REFERENCES tb_tool_control_request(id),
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
FOREIGN KEY(user_id) REFERENCES tb_user(id),
PRIMARY KEY(id)
);

