L2:
1. create via schematic cli resource for auth.

2. dep: @nestjs/passport, bcrypt, passport-jwt, nestjs/jwt, passport, nestjs/config

3. create .env
   for jwt_sercet + exp.time

4. app.module : import ConfigModule
   ConfigModule loads .env file and makes all variables available across entire app.

5. create dir dto, login.dto, register.dto
   Create dtos to define, validate and safely control the shape of incoming data before it reaches your business logic

6. create dir entities, user.entity
   Entities represent your data model (it's describe stored database data)
   Create funcs hashPass & validatePass inside to ensure hashing always happens

7. create service for authetication
   register,login,validateUser

6.create dir interface, jwt-payload.interface

7. create jwt.strategy.ts in src
   validate method

8. add changes to auth.module

9. add changes to auth controller

Flow register: 
1. Server get request, takes info from body, create it in db, return saved new user.

Flow login:
1. Server get request, takes info from body, validate name+password, return user, from user we extract id + name, 
   and sign jwtToken.

Flow profile: 
1.  Server get request, takes payload from jwt in request, calls jwt strategy, validate and decode token, give back 
    info extracted from payload.


Full Flow of All Files Working Together:

AppModule
├── TypeOrmModule → connects to DB
└── TablesModule
    ├── loads Table entity
    ├── creates Table repository
    ├── registers TablesService
    └── registers TablesController
