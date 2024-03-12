import Fastify from "fastify";
import Database from "better-sqlite3";
import bodySchema from "./schema.json" assert { type: "json" };

const fastify = Fastify({
  logger: true,
});

const db = new Database("./todos.db");
const CREATETABLEQUERY = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );
`;
const CREATE_EMPLOYEE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS employees (
  uuid INTEGER PRIMARY KEY,
  employeeId TEXT NOT NULL,
  name TEXT NOT NULL,
  career_start_date TEXT,
  neoito_start_date TEXT,
  total_years TEXT,
  neoito_years TEXT,
  ctc_exclude_gratuity TEXT,
  effective_gratuity TEXT,
  qualification TEXT NOT NULL,
  bonus TEXT,
  front_end_skills TEXT,
  back_end_skills TEXT,
  db_skills TEXT,
  cloud_skills TEXT,
  designation TEXT,
  department TEXT,
  pm TEXT,
  reporting TEXT,
  additional_reporting TEXT,
  permanent_address TEXT NOT NULL,
  city TEXT NOT NULL,
  present_address TEXT,
  dob TEXT NOT NULL,
  age TEXT NOT NULL,
  contact TEXT NOT NULL,
  emergency_contact TEXT,
  company_mailid TEXT NOT NULL,
  personal_mailid TEXT NOT NULL,
  blood_group TEXT,
  office_location TEXT,
  office_status TEXT,
  gender TEXT,
  project_name TEXT
);`;
db.exec(CREATETABLEQUERY);
db.exec(CREATE_EMPLOYEE_TABLE_QUERY);
const CREATETODOQUERY = db.prepare(
  "INSERT OR REPLACE INTO todos (id, name) VALUES (?, ?)"
);
const GETTODOSQUERY = db.prepare("SELECT * FROM todos");
const INSERT_EMPLOYEE_QUERY = db.prepare(`
  INSERT INTO employees (
    employeeId,
    name, 
    career_start_date, 
    neoito_start_date, 
    total_years, 
    neoito_years, 
    ctc_exclude_gratuity, 
    effective_gratuity, 
    qualification, 
    bonus, 
    front_end_skills, 
    back_end_skills, 
    db_skills, 
    cloud_skills, 
    designation, 
    department, 
    pm, 
    reporting, 
    additional_reporting, 
    permanent_address, 
    city, 
    present_address, 
    dob, 
    age, 
    contact, 
    emergency_contact, 
    company_mailid, 
    personal_mailid, 
    blood_group, 
    office_location, 
    office_status, 
    gender, 
    project_name
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const GET_EMPLOYEES_QUERY = db.prepare("SELECT * FROM employees");
const GET_EMPLOYEE_BY_ID_QUERY = db.prepare(
  "SELECT * FROM employees WHERE employeeId = ?"
);

const schema = {
  body: bodySchema,
};

fastify.get("/", async (request, reply) => {
  return { hello: "World" };
});

fastify.post("/create", { schema }, async (request, reply) => {
  reply.code(200).send({ message: "Employee details successfully entered" });
});

fastify.post("/createtodo", async (request, reply) => {
  const { items } = request.body;
  console.log(items);

  try {
    db.transaction(() => {
      for (const todo of items) {
        const { id, item } = todo;
        console.log(todo);
        CREATETODOQUERY.run(id, item);
      }
    })();

    return {
      success: true,
      message: "Todos successfully added to the database",
    };
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

fastify.get("/gettodos", async (request, reply) => {
  try {
    const todos = GETTODOSQUERY.all();
    return { todos };
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

fastify.post("/addemployee", { schema }, async (request, reply) => {
  console.log(request.body);
  try {
    const {
      employeeId,
      name,
      career_start_date,
      neoito_start_date,
      total_years,
      neoito_years,
      ctc_exclude_gratuity,
      effective_gratuity,
      qualification,
      bonus,
      front_end_skills,
      back_end_skills,
      db_skills,
      cloud_skills,
      designation,
      department,
      pm,
      reporting,
      additional_reporting,
      permanent_address,
      city,
      present_address,
      dob,
      age,
      contact,
      emergency_contact,
      company_mailid,
      personal_mailid,
      blood_group,
      office_location,
      office_status,
      gender,
      project_name,
    } = request.body;

    // Execute the prepared statement to insert employee data
    const result = INSERT_EMPLOYEE_QUERY.run(
      employeeId,
      name,
      career_start_date,
      neoito_start_date,
      total_years,
      neoito_years,
      ctc_exclude_gratuity,
      effective_gratuity,
      qualification,
      bonus,
      front_end_skills,
      back_end_skills,
      db_skills,
      cloud_skills,
      designation,
      department,
      pm,
      reporting,
      additional_reporting,
      permanent_address,
      city,
      present_address,
      dob,
      age,
      contact,
      emergency_contact,
      company_mailid,
      personal_mailid,
      blood_group,
      office_location,
      office_status,
      gender,
      project_name
    );

    return {
      success: true,
      message: "Employee data successfully added to the database",
      insertedEmployeeId: result.lastInsertRowid,
    };
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

fastify.get("/getemployees", async (request, reply) => {
  try {
    const employees = GET_EMPLOYEES_QUERY.all();
    return { employees, total_count: employees?.length };
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

fastify.get("/getemployee/:employeeId", async (request, reply) => {
  try {
    const { employeeId } = request.params;
    const employee = GET_EMPLOYEE_BY_ID_QUERY.get(employeeId);
    if (!employee) {
      reply.status(404).send({ error: "Employee not found" });
      return;
    }
    return { employee };
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log(err);
  process.exit(1);
}
