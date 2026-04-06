L4:

1. add more credential to .env,
   create shared module in src(add configModule to imports) + services dir: env.service.ts (add it to shared.module)
   We centralize all environment variables in one shared service so the whole application can access configuration safely, consistently, and with default values that prevent runtime errors.

2. typeorm.module : add changes
   We create a dedicated TypeORM module that loads configuration from EnvService. This centralizes all database settings, provides safe defaults, prevents runtime errors, and keeps the application architecture clean and maintainable.

3. create ormconfig.ts in root
   We need a standalone ormconfig/data-source file because TypeORM CLI runs outside NestJS and cannot use dependency injection. This file provides a plain DataSource instance so migrations and CLI commands can work.

4. devdep: cross-var, scripts: typeorm, migration:generate, migration:run, migration:revert
   (clean db) in console: npm run migration:generate --name=first


1. What all this steps are made finally?
   All these steps together give us a safer and more maintainable app: configuration is centralized and validated, database settings are consistent and environment‑driven, and schema changes are handled through explicit migrations instead of implicit sync.


Flow:
We centralized all env vars by creating a shared module, made access for the whole app safer, and prevented runtime errors because of default values.
We changed TypeORM to load async so it can use EnvService, and we disabled synchronize because automatic schema sync is only safe in early development. In real projects we rely on migrations instead, to control and track schema changes.
We created a ormconfig that TypeORM could get all configuration
We added some scripts and dependencies that we can use migration