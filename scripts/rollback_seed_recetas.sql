
-- 🔄 Rollback de inserciones de recetas, pasos, multimedia, fotos, ingredientes, unidades y tipos

-- 1. Eliminar multimedia
DELETE FROM "multimedia" WHERE "idElemento" IN (
  'f873b740-16a0-4e1a-8c82-94b789e70db2',
  '93bb8616-5b35-4fe2-b1d8-c3e03b1c99ec',
  'ce362a50-dfde-4c2d-99b2-e15495bba5bd',
  '7edb7c4e-3f83-403c-b750-2e34f9c9277d',
  '672dba42-8ff3-4b3f-8f15-c7852ea8cd2f'
);

-- 2. Eliminar fotos
DELETE FROM "fotos" WHERE "idFoto" IN (
  '4cbdcb59-64c6-4b66-a4ae-4dd71ff7dd40',
  'f09f7b92-2a45-4e79-8e32-64767ab48a5a',
  'dcb37357-6fdf-4d26-b81e-b993f68a0581',
  '4b92d457-803c-4f4b-b65b-37de7bbab03d',
  '7cdb13d1-5b93-4a2c-8ccf-54f7b3a1dabe'
);

-- 3. Eliminar pasos
DELETE FROM "pasos" WHERE "idPaso" IN (
  'f110135c-23be-433a-9ced-d17c22c71b3f',
  'c6c04567-f895-45ed-9dc6-4cabba306c30',
  '78539995-5e01-4027-a29a-3d7a596e6908',
  '5acba18d-b010-46b0-8dec-089b57f1544f',
  'e082591f-3ebe-4818-97e7-31cc22dbfa72',
  '1887c978-c360-49ec-b699-a4501f34eecf',
  '8f2afa44-b6d0-4e78-b274-e260ec2bd4f5',
  '2a09e8ca-bc2e-4cb1-b0c6-e79291ed3330',
  '9bb879c3-0311-47f2-ae0f-8279d93de667',
  'ef3b48dd-6e89-493a-a071-504334f69e78'
);

-- 4. Eliminar recetas
DELETE FROM "recetas" WHERE "idReceta" IN (
  '98b1bf61-b993-4e66-a7c6-d300f391d236',
  '85be8e17-26be-43f6-bb3d-67dbb68a341c',
  'f31c86b7-579c-4d61-8834-9885e51e8fc8',
  'c9ccece3-362a-43c4-9db7-c2239c7bd639',
  '8b07d0b3-7b62-4f8a-a8df-fa43ef20775a'
);

-- 5. Eliminar ingredientes
DELETE FROM "ingredientes" WHERE "idIngrediente" IN (
  '886aa11b-b742-4ece-9fff-b2bb68692876',
  'f7aa3f4a-ecc4-42f1-bde1-0aa4a75d81f6',
  '93d15755-7995-4bad-97ea-cd658007a48b',
  '92b98796-7eff-44bd-82b9-0b611ffb831c',
  '2ff088c2-b873-43fd-875c-e79faf1de590'
);

-- 6. Eliminar unidades
DELETE FROM "unidades" WHERE "idUnidad" IN (
  '36bdc417-bd60-4c3b-9a25-79f103b1367a',
  '7d293802-17cb-4483-81aa-d81895648966',
  '442df04e-4952-407c-9d11-846ceaa00c7e',
  '8ad8456e-f5c0-4959-be0b-b773bb571ef2'
);

-- 7. Eliminar tipos de receta
DELETE FROM "tiposReceta" WHERE "idTipo" IN (
  'b1f6e890-aaaa-4b1a-8888-000000000001',
  'b1f6e890-aaaa-4b1a-8888-000000000002',
  'b1f6e890-aaaa-4b1a-8888-000000000003'
);
