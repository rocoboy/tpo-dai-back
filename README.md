# Información útil

Este repositorio tiene tanto backend como frontend integrados. Para podes correr cada uno de ellos debemos realizar lo siguiente:

## Backend
Necesitamos utilizar postgreSQL, un consejo sería instalar docker y levantar postgre con el siguiente comando:

```bash
docker run --name postgreDB -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=tpo-backend -p 5432:5432 postgres:latest
```

Una vez instalado el container, podemos intentar levantarlo y dirigirnos a la carpeta del proyecto de backend y ejecutamos los siguientes comandos
```bash
cd .\back\ 
npm install
npm run start
```

Esto nos va a levantar localmente nuestra API en el puerto 3000 por lo que podremos hacer consultas mediante http://localhost:3000.
