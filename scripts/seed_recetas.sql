INSERT INTO "tiposReceta" ("idTipo", "descripcion") VALUES
('b1f6e890-aaaa-4b1a-8888-000000000001', 'Postre'),
('b1f6e890-aaaa-4b1a-8888-000000000002', 'Entrada'),
('b1f6e890-aaaa-4b1a-8888-000000000003', 'Plato Principal');

INSERT INTO "unidades" ("idUnidad", "descripcion") VALUES
('36bdc417-bd60-4c3b-9a25-79f103b1367a', 'Gramo'),
('7d293802-17cb-4483-81aa-d81895648966', 'Mililitro'),
('442df04e-4952-407c-9d11-846ceaa00c7e', 'Unidad'),
('8ad8456e-f5c0-4959-be0b-b773bb571ef2', 'Cucharada');

INSERT INTO "ingredientes" ("idIngrediente", "nombre") VALUES
('886aa11b-b742-4ece-9fff-b2bb68692876', 'Harina'),
('f7aa3f4a-ecc4-42f1-bde1-0aa4a75d81f6', 'Leche'),
('93d15755-7995-4bad-97ea-cd658007a48b', 'Huevo'),
('92b98796-7eff-44bd-82b9-0b611ffb831c', 'Azúcar'),
('2ff088c2-b873-43fd-875c-e79faf1de590', 'Sal');

INSERT INTO "recetas" ("idReceta", "nombreReceta", "descripcionReceta", "porciones", "cantidadPersonas", "fechaCreacion", "fechaModificacion", "usuarioIdUsuario", "tipoRecetaIdTipo", "promedioCalificacion", "estado") VALUES
('98b1bf61-b993-4e66-a7c6-d300f391d236', 'Tortilla de papas', 'Plato típico argentino', 4, 2, '2025-06-30', '2025-06-30', 1, 'b1f6e890-aaaa-4b1a-8888-000000000003', 4.5, 'aprobada'),
('85be8e17-26be-43f6-bb3d-67dbb68a341c', 'Panqueques con dulce', 'Ideal para la merienda', 3, 1, '2025-06-30', '2025-06-30', 10, 'b1f6e890-aaaa-4b1a-8888-000000000001', 4.8, 'aprobada'),
('f31c86b7-579c-4d61-8834-9885e51e8fc8', 'Ensalada César', 'Refrescante y sabrosa', 2, 2, '2025-06-30', '2025-06-30', 5, 'b1f6e890-aaaa-4b1a-8888-000000000002', 4.0, 'aprobada'),
('c9ccece3-362a-43c4-9db7-c2239c7bd639', 'Budín de pan', 'Clásico postre de aprovechamiento', 5, 4, '2025-06-30', '2025-06-30', 5, 'b1f6e890-aaaa-4b1a-8888-000000000001', 0.0, 'pendiente'),
('8b07d0b3-7b62-4f8a-a8df-fa43ef20775a', 'Sopa crema de calabaza', 'Ideal para el invierno', 3, 2, '2025-06-30', '2025-06-30', 5, 'b1f6e890-aaaa-4b1a-8888-000000000002', 0.0, 'pendiente');

INSERT INTO "pasos" ("idPaso", "recetaIdReceta", "nroPaso", "texto") VALUES
('f110135c-23be-433a-9ced-d17c22c71b3f', '98b1bf61-b993-4e66-a7c6-d300f391d236', 1, 'Paso 1 de Tortilla de papas'),
('c6c04567-f895-45ed-9dc6-4cabba306c30', '98b1bf61-b993-4e66-a7c6-d300f391d236', 2, 'Paso 2 de Tortilla de papas'),
('78539995-5e01-4027-a29a-3d7a596e6908', '85be8e17-26be-43f6-bb3d-67dbb68a341c', 1, 'Paso 1 de Panqueques con dulce'),
('5acba18d-b010-46b0-8dec-089b57f1544f', '85be8e17-26be-43f6-bb3d-67dbb68a341c', 2, 'Paso 2 de Panqueques con dulce'),
('e082591f-3ebe-4818-97e7-31cc22dbfa72', 'f31c86b7-579c-4d61-8834-9885e51e8fc8', 1, 'Paso 1 de Ensalada César'),
('1887c978-c360-49ec-b699-a4501f34eecf', 'f31c86b7-579c-4d61-8834-9885e51e8fc8', 2, 'Paso 2 de Ensalada César'),
('8f2afa44-b6d0-4e78-b274-e260ec2bd4f5', 'c9ccece3-362a-43c4-9db7-c2239c7bd639', 1, 'Paso 1 de Budín de pan'),
('2a09e8ca-bc2e-4cb1-b0c6-e79291ed3330', 'c9ccece3-362a-43c4-9db7-c2239c7bd639', 2, 'Paso 2 de Budín de pan'),
('9bb879c3-0311-47f2-ae0f-8279d93de667', '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a', 1, 'Paso 1 de Sopa crema de calabaza'),
('ef3b48dd-6e89-493a-a071-504334f69e78', '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a', 2, 'Paso 2 de Sopa crema de calabaza');

INSERT INTO "multimedia" ("idElemento", "tipo_contenido", "extension", "urlContenido", "idPaso") VALUES
('f873b740-16a0-4e1a-8c82-94b789e70db2', 'imagen', 'jpg', 'https://media.com/tortilla_de_papas.jpg', 'f110135c-23be-433a-9ced-d17c22c71b3f'),
('93bb8616-5b35-4fe2-b1d8-c3e03b1c99ec', 'imagen', 'jpg', 'https://media.com/panqueques_con_dulce.jpg', '78539995-5e01-4027-a29a-3d7a596e6908'),
('ce362a50-dfde-4c2d-99b2-e15495bba5bd', 'imagen', 'jpg', 'https://media.com/ensalada_césar.jpg', 'e082591f-3ebe-4818-97e7-31cc22dbfa72'),
('7edb7c4e-3f83-403c-b750-2e34f9c9277d', 'imagen', 'jpg', 'https://media.com/budín_de_pan.jpg', '8f2afa44-b6d0-4e78-b274-e260ec2bd4f5'),
('672dba42-8ff3-4b3f-8f15-c7852ea8cd2f', 'imagen', 'jpg', 'https://media.com/sopa_crema_de_calabaza.jpg', '9bb879c3-0311-47f2-ae0f-8279d93de667');



INSERT INTO "fotos" ("idFoto", "extension", "url", "recetaIdReceta") VALUES
('4cbdcb59-64c6-4b66-a4ae-4dd71ff7dd40', 'jpg', 'https://imagen.com/tortilla_de_papas.jpg', '98b1bf61-b993-4e66-a7c6-d300f391d236'),
('f09f7b92-2a45-4e79-8e32-64767ab48a5a', 'jpg', 'https://imagen.com/panqueques_con_dulce.jpg', '85be8e17-26be-43f6-bb3d-67dbb68a341c'),
('dcb37357-6fdf-4d26-b81e-b993f68a0581', 'jpg', 'https://imagen.com/ensalada_césar.jpg', 'f31c86b7-579c-4d61-8834-9885e51e8fc8'),
('4b92d457-803c-4f4b-b65b-37de7bbab03d', 'jpg', 'https://imagen.com/budín_de_pan.jpg', 'c9ccece3-362a-43c4-9db7-c2239c7bd639'),
('7cdb13d1-5b93-4a2c-8ccf-54f7b3a1dabe', 'jpg', 'https://imagen.com/sopa_crema_de_calabaza.jpg', '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a');

-- Tortilla de papas
INSERT INTO "utilizados" ("idUtilizado", "cantidad", "observaciones", "recetaIdReceta", "ingredienteIdIngrediente", "unidadIdUnidad") VALUES
('11111111-aaaa-4ccc-9aaa-111111111111', 200, NULL, '98b1bf61-b993-4e66-a7c6-d300f391d236', '886aa11b-b742-4ece-9fff-b2bb68692876', '36bdc417-bd60-4c3b-9a25-79f103b1367a'),
('11111111-bbbb-4ccc-9bbb-111111111111', 2, NULL, '98b1bf61-b993-4e66-a7c6-d300f391d236', '93d15755-7995-4bad-97ea-cd658007a48b', '442df04e-4952-407c-9d11-846ceaa00c7e'),
('11111111-cccc-4ccc-9ccc-111111111111', 1, NULL, '98b1bf61-b993-4e66-a7c6-d300f391d236', '2ff088c2-b873-43fd-875c-e79faf1de590', '8ad8456e-f5c0-4959-be0b-b773bb571ef2'),
('11111111-dddd-4ccc-9ddd-111111111111', 100, NULL, '98b1bf61-b993-4e66-a7c6-d300f391d236', 'f7aa3f4a-ecc4-42f1-bde1-0aa4a75d81f6', '7d293802-17cb-4483-81aa-d81895648966');

-- Panqueques con dulce
INSERT INTO "utilizados" ("idUtilizado", "cantidad", "observaciones", "recetaIdReceta", "ingredienteIdIngrediente", "unidadIdUnidad") VALUES
('22222222-aaaa-4ccc-9aaa-222222222222', 150, NULL, '85be8e17-26be-43f6-bb3d-67dbb68a341c', '886aa11b-b742-4ece-9fff-b2bb68692876', '36bdc417-bd60-4c3b-9a25-79f103b1367a'),
('22222222-bbbb-4ccc-9bbb-222222222222', 1, NULL, '85be8e17-26be-43f6-bb3d-67dbb68a341c', '93d15755-7995-4bad-97ea-cd658007a48b', '442df04e-4952-407c-9d11-846ceaa00c7e'),
('22222222-cccc-4ccc-9ccc-222222222222', 200, NULL, '85be8e17-26be-43f6-bb3d-67dbb68a341c', 'f7aa3f4a-ecc4-42f1-bde1-0aa4a75d81f6', '7d293802-17cb-4483-81aa-d81895648966'),
('22222222-dddd-4ccc-9ddd-222222222222', 2, NULL, '85be8e17-26be-43f6-bb3d-67dbb68a341c', '92b98796-7eff-44bd-82b9-0b611ffb831c', '8ad8456e-f5c0-4959-be0b-b773bb571ef2'),
('22222222-eeee-4ccc-9eee-222222222222', 1, NULL, '85be8e17-26be-43f6-bb3d-67dbb68a341c', '2ff088c2-b873-43fd-875c-e79faf1de590', '8ad8456e-f5c0-4959-be0b-b773bb571ef2');

-- Ensalada César
INSERT INTO "utilizados" ("idUtilizado", "cantidad", "observaciones", "recetaIdReceta", "ingredienteIdIngrediente", "unidadIdUnidad") VALUES
('33333333-aaaa-4ccc-9aaa-333333333333', 1, NULL, 'f31c86b7-579c-4d61-8834-9885e51e8fc8', '93d15755-7995-4bad-97ea-cd658007a48b', '442df04e-4952-407c-9d11-846ceaa00c7e'),
('33333333-bbbb-4ccc-9bbb-333333333333', 1, NULL, 'f31c86b7-579c-4d61-8834-9885e51e8fc8', '2ff088c2-b873-43fd-875c-e79faf1de590', '8ad8456e-f5c0-4959-be0b-b773bb571ef2'),
('33333333-cccc-4ccc-9ccc-333333333333', 50, NULL, 'f31c86b7-579c-4d61-8834-9885e51e8fc8', 'f7aa3f4a-ecc4-42f1-bde1-0aa4a75d81f6', '7d293802-17cb-4483-81aa-d81895648966');

-- Budín de pan
INSERT INTO "utilizados" ("idUtilizado", "cantidad", "observaciones", "recetaIdReceta", "ingredienteIdIngrediente", "unidadIdUnidad") VALUES
('44444444-aaaa-4ccc-9aaa-444444444444', 500, NULL, 'c9ccece3-362a-43c4-9db7-c2239c7bd639', 'f7aa3f4a-ecc4-42f1-bde1-0aa4a75d81f6', '7d293802-17cb-4483-81aa-d81895648966'),
('44444444-bbbb-4ccc-9bbb-444444444444', 2, NULL, 'c9ccece3-362a-43c4-9db7-c2239c7bd639', '93d15755-7995-4bad-97ea-cd658007a48b', '442df04e-4952-407c-9d11-846ceaa00c7e'),
('44444444-cccc-4ccc-9ccc-444444444444', 100, NULL, 'c9ccece3-362a-43c4-9db7-c2239c7bd639', '92b98796-7eff-44bd-82b9-0b611ffb831c', '36bdc417-bd60-4c3b-9a25-79f103b1367a'),
('44444444-dddd-4ccc-9ddd-444444444444', 100, NULL, 'c9ccece3-362a-43c4-9db7-c2239c7bd639', '886aa11b-b742-4ece-9fff-b2bb68692876', '36bdc417-bd60-4c3b-9a25-79f103b1367a'),
('44444444-eeee-4ccc-9eee-444444444444', 1, NULL, 'c9ccece3-362a-43c4-9db7-c2239c7bd639', '2ff088c2-b873-43fd-875c-e79faf1de590', '8ad8456e-f5c0-4959-be0b-b773bb571ef2');

-- Sopa crema de calabaza
INSERT INTO "utilizados" ("idUtilizado", "cantidad", "observaciones", "recetaIdReceta", "ingredienteIdIngrediente", "unidadIdUnidad") VALUES
('55555555-aaaa-4ccc-9aaa-555555555555', 300, NULL, '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a', 'f7aa3f4a-ecc4-42f1-bde1-0aa4a75d81f6', '7d293802-17cb-4483-81aa-d81895648966'),
('55555555-bbbb-4ccc-9bbb-555555555555', 1, NULL, '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a', '2ff088c2-b873-43fd-875c-e79faf1de590', '8ad8456e-f5c0-4959-be0b-b773bb571ef2'),
('55555555-cccc-4ccc-9ccc-555555555555', 1, NULL, '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a', '92b98796-7eff-44bd-82b9-0b611ffb831c', '8ad8456e-f5c0-4959-be0b-b773bb571ef2'),
('55555555-dddd-4ccc-9ddd-555555555555', 30, NULL, '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a', '886aa11b-b742-4ece-9fff-b2bb68692876', '36bdc417-bd60-4c3b-9a25-79f103b1367a');



