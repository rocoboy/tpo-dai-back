
-- ROLLBACK SCRIPT
-- Elimina clases, cronogramas, cursos y sedes agregadas por seed_cursos_completo.sql

DELETE FROM clases
WHERE "cronogramaIdCronograma" IN (
  SELECT "idCronograma" FROM "cronogramaCursos"
);

DELETE FROM cronogramaCursos
WHERE "cursoIdCurso" IN (
  SELECT "idCurso" FROM "cursos"
);

DELETE FROM cursos
WHERE "idCurso" IN (
  '1b7f5736-86b0-4c9b-9313-e0e8fa3208cf',
  'fa0e1c8f-9264-49ee-bc71-d8f30fd188be',
  'c930b6b2-02c6-4f63-b9df-9dc1e4b2ce33',
  '4c52946b-3684-4f95-b8ef-b05ed827030f',
  '13a9a8f7-7ed0-464a-a2be-d4ebfdb7b8f1'
);

DELETE FROM sedes
WHERE "idSede" IN (
  'c981b4a8-eb9e-4ccf-91e1-42aeaf561c84',
  '1a6503ea-ec26-4443-8134-fe806ec31f86',
  '24bad112-5b9f-4242-a619-f45d6016db14',
  '7ea60994-620d-4773-925e-7ee40c4f9e6b',
  '00000000-0000-0000-0000-000000000001'
);
