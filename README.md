# User Registration NestJS demo

## Installation

```bash
$ npm install
```

## Create .env file by cloning .env.pipelines file and add your credentials in that

```bash
cp .env.pipelines .env
```

## Run the migrations

```bash
npx sequelize-cli db:migrate
```

## Running the app

```bash
# development
$ npm run start

# watch mode, (for development use this)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Command to Create a migration 

```bash
npm sequelize-cli migration:generate --name module-name
```

### Command to Revert the last migration 

```bash
npx sequelize-cli db:migrate:undo
```

### Postman collection
https://www.getpostman.com/collections/ec346e9fbf2da4521c9a
