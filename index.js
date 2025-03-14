/* import and initialize express app */
const express = require('express');
const pg = require('pg');
const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_hr_db',
)

const app = express();
const PORT = 3000;
/* this middleware deals with CORS errors and allows the client on port 5173 to access the server */
const cors = require('cors');
/* morgan is a logging library that allows us to see the requests being made to the server */
const morgan = require('morgan');

/* set up express middleware */
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* set up intial hello world route */

/* set up api route */
app.get('/employees', async (req, res) => {
  try {
    const SQL = /* sql */ `
      SELECT id, name, phone, isadmin AS "isAdmin" FROM employees;
      `
    const response = await client.query(SQL);
    console.log('response: ', response);
    res.send(response.rows);
  } catch (error) {

  }
  
});

app.post('/employees', async (req, res) => {
  try {
    const { name, phone, isAdmin } = req.body;
    const SQL = `
      INSERT INTO employees(name, phone, isAdmin)
      VALUES($1, $2, $3)
      RETURNING *;
    `;
    const response = await client.query(SQL, [name, phone, isAdmin]);
    // Return the newly inserted record
    res.send(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting employee');
  }
});

const init = async() => {
  await client.connect();
  console.log("database connected")
  const SQL = /*sql*/ `
    DROP TABLE IF EXISTS employees;
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(15),
      isAdmin BOOLEAN DEFAULT FALSE
    );
    INSERT INTO employees(name, phone, isAdmin) VALUES ('John Doe', '555-1234', 'false');
    INSERT INTO employees(name, phone, isAdmin) VALUES ('James Barnes', '555-4321', 'true');
  `
  await client.query(SQL);

  app.listen(PORT, 
    () => {
    console.log(`Server is listneing on ${PORT}`)
  });
}


/* our middleware won't capture 404 errors, so we're setting up a separate error handler for those*/
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});
/* initialize server (listen) */

init();
