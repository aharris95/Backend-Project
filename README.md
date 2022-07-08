# News - Backend Project

## A [hosted news article](https://nc-news-backendproject.herokuapp.com/api) API using Express and SQL

## Background

This is an API using PostgreSQL and node-postgres which shows news articles and comments for a news website.
## To get this repo onto your computer

- On the command line, navigate to the folder you want this repo to be in.
- Once you have forked your own version of this repo, clone the version to your local machine.
- To do this, on the command line type `git clone`, paste in the repo address, and press enter.

## Setup

### Install the project's dependencies:

```sh
npm install
```

### Ensure the tests run:

```sh
npm test
```

## Seeding

There is a file in the `db` folder for seeding both a dev and a test database. You can run these directly with `psql` and for the dev database we have provided the following script in your package.json: `npm run seed`

## Creating the connection to the separate `test` and `development` databases

Your first task is to create your connection to the database using `node-postgres`.

You will need to use `dotenv` files (`.env.test` & `.env.development`) to determine which database to connect to, based on whether you are running your `jest` tests, or running the server manually.

> _`dotenv` is a [module that loads environment variables from a `.env` file into the `process.env` global object](https://github.com/motdotla/dotenv#readme)_

## Files in your repository

- _node_modules_ hold all the dependencies / libraries that the project relies on (for example, jest, for testing).
- `.gitignore` contains the names of all the files that don't want to be committed to github. 
- `__tests__`is the folder for tests - `app.test.js` tests all endpoints.
- `package.json` contains information used by npm to organise the project.
- `package-lock.json` contains the information needed to link the node modules.


