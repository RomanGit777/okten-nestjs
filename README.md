L3:
1. create token.entity
   add changes to user.entity
   Create a one-to-many relationship that we could have two new tables in db : user and tokens, and tokens will have 
   userId as a foreign key

2. create refresh-token.dto
   Define shape of data

3. add changes to auth.service
   inject config & refreshRepo
   add jti to payload that we can find the token in db later by jti (unique identifier inside a JWT token)

4. .env : add access token exp, refresh exp,
   add it to have exp time for tokens.

5. create interface for tokens & add changes to auth.service : 
We do it to create method to create tokens and save them to db, this method we'll add to login method.
We also add method for refresh tokens, and for logout.

6. add changes to auth module : add Token to typeorm that tables will be created, delete line where jwt expires takes 
   (we do it manually).

7. add new methods in controller
   That controller knows what to do when request comes

8. add changes to jwt.strategy
   That method will check token existence in db, that it's valid token of an valid user 

Flow of logout:
1. Server get request, takes refresh token from req.body, check if token is valid in db, then block it and save 
   changes to db, that user can't refresh any more by that token.

Flow of refresh: 
1. Server get request, takes refresh token from req.body, verify it by jwtService, check token existence in db,
that it's valid token of an valid user, if it is, block the token and take from it payload, using payload create new 
   tokens, save them in db and return new tokens to user

Also changed a bit login, that it will sign a pair of new tokens,save them, and return them.

Full Flow of All Files Working Together:

AppModule
├── TypeOrmModule → connects to DB
└── TablesModule
    ├── loads Table entity
    ├── creates Table repository
    ├── registers TablesService
    └── registers TablesController
