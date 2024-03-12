import Database from "better-sqlite3";
import bodySchema from "./schema.json" assert { type: "json" };

const db = new Database("./todos.db");
export const CREATETABLEQUERY = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );
`;
export const CREATE_EMPLOYEE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS employees (
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

export const CREATETODOQUERY = db.prepare(
  "INSERT OR REPLACE INTO todos (id, name) VALUES (?, ?)"
);
export const GETTODOSQUERY = db.prepare("SELECT * FROM todos");
export const INSERT_EMPLOYEE_QUERY = db.prepare(`
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
export const GET_EMPLOYEES_QUERY = db.prepare("SELECT * FROM employees");
export const GET_EMPLOYEE_BY_ID_QUERY = db.prepare(
  "SELECT * FROM employees WHERE employeeId = ?"
);
db.exec(CREATETABLEQUERY);
db.exec(CREATE_EMPLOYEE_TABLE_QUERY);

export const schema = {
  body: bodySchema,
};
