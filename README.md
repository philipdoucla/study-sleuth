# Study Sleuth

Fall 2021 CS 35L group project by James Shiffer, Derek Lee, Philip Do, Vinh Nguyen, Dhaval Vora.

Study Sleuth is a web application that helps you find study groups at UCLA.

## Dependencies

We use the "PERN" stack:
Postgres, Express, React, Node.js

## Installation

Run the included migrations for your database.

Set up credentials in an `.env.local` file in this directory. It should have `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` and `SECRET` fields.

Run `npm install`. Start both backend + frontend in development mode using `npm start`. Hot reload is available.

The code is currently hard-coded to run on localhost, with ports 3000 and 5000 for frontend and backend, respectively.
