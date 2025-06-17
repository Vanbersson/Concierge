DELETE FROM tb_user_menu WHERE menu_id="2_2";
DELETE FROM `tb_menu` WHERE id="2_2";

DELETE FROM tb_user_menu WHERE menu_id="2_2_0";
DELETE FROM `tb_menu` WHERE id="2_2_0";

DELETE FROM tb_user_menu WHERE menu_id="2_2_1";
DELETE FROM `tb_menu` WHERE id="2_2_1";

DELETE FROM tb_user_menu WHERE menu_id="3_1";
DELETE FROM `tb_menu` WHERE id="3_1";

DELETE FROM tb_user_menu WHERE menu_id="3_1_0";
DELETE FROM `tb_menu` WHERE id="3_1_0";

DELETE FROM tb_user_menu WHERE menu_id="3_1_1";
DELETE FROM `tb_menu` WHERE id="3_1_1";

DELETE FROM tb_user_menu WHERE menu_id="3_2";
DELETE FROM `tb_menu` WHERE id="3_2";

INSERT INTO `tb_menu`
(`id`, `description`)
VALUES
('2_2','Pedidos de compras'),
('2_2_0','Pedidos'),
('2_99','Cadastro');

INSERT INTO `tb_menu`
(`id`, `description`)
VALUES
('3_1','Orçamentos'),
('3_2','Controle de equipamentos'),
('3_2_0','Pegar/Devolver'),
('3_2_1','Cadastro'),
('3_2_1_0','Categoria'),
('3_2_1_1','Material'),
('3_99','Cadastro');





