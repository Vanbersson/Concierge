
DELETE FROM `tb_user_permission`;
DELETE FROM `tb_permission`;
ALTER TABLE tb_permission ADD COLUMN menu varchar(100) not null;

INSERT INTO tb_permission
(id,description,menu)
VALUES
(100,'Editar entrada de veículo','Portaria'),
(101,'Autorizar saída de veículo','Portaria'),
(102,'Autorizar saída de veículo - 1ª','Portaria'),
(103,'Autorizar saída de veículo - 2ª','Portaria'),
(104,'Remover autorização de saída de veículo - 1ª','Portaria'),
(105,'Remover autorização de saída de veículo - 2ª','Portaria'),
(106,'Autorizar saída de veículo sem O.S.','Portaria'),
(107,'Remover autorização de saída de veículo sem O.S.','Portaria'),
(150,'Gerar orçamento','Portaria'),
(151,'Manutenção orçamento','Portaria'),
(152,'Visualizar orçamento','Portaria'),
(300,'Alterar quantidade material','Oficina');
