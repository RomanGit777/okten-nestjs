L1:
1. create empty project
2. npm i -g @nestjs/cli
3. nest new nest-js-project --directory=.
4. dep: @nestjs/typeorm, typeorm, mysql2, @nestjs/mapped-types, class-validator, class-transformer, @nestjs/swagger, swagger-ui-express
5. nest-cli.json: generateOptions ..
   apply eslint rules + add nodejs
6. src : clear everything exc. module and main.ts
   add tables dir
   nest g mo tables / plugin nestjs
7. create dir's :  dto, entities, nest service tables + controller, all in tables.
8. entities: table.entity.ts
9. create in root : docker-compose.yml
   docker compose up, connect to db
10. src: nest module typeorm --flat
11. dto : create-table.dto.ts, update-table.dto.ts
12. tables.service : create class
13. tables.controller : describe controller
    dto : response-table.dto
14. add changes to main.ts, add swagger docs
    npm run start:dev

Flow: 
1. Create NestJS project: it gives main.ts: starts the app, app.module.ts: root module, basic folder structure.
2. Install TypeORM and configure it in a module. This does two things: connects NestJS to your database, tells TypeORM where to find entities.
3. Create an Entity. Entity represents database tables. TypeORM uses this to create the actual table.
4. Create DTOs. DTOs define the shape of incoming data. They work with ValidationPipe to validate requests.
5. Create a Module. Every feature in NestJS gets it's own module. This module registers the entity, registers the service, registers the controller.
6. Create a service. The service contains business logic and talks to the database. Service = business logic + repository access.
7. Create a controller. The controller handles HTTP requests and calls the service. Controller = request in > response out.
8. main.ts bootstraps everything. Starts server, enable validation, sets up Swagger.
9. Request flow in action : Clients sends data, controller receives the request, DTO validation runs (if invalid > 
   request is rejected), controller calls the service, service uses the repository, repository talks to MySQL 
   (TypeORM generates SQL and inserts the row), response goes back to the client.


Full Flow of All Files Working Together:

AppModule
├── TypeOrmModule → connects to DB
└── TablesModule
    ├── loads Table entity
    ├── creates Table repository
    ├── registers TablesService
    └── registers TablesController
