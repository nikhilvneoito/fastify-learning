import Fastify from "fastify";
import {
  GET_EMPLOYEES_QUERY,
  GET_EMPLOYEE_BY_ID_QUERY,
  CREATETODOQUERY,
  GETTODOSQUERY,
  INSERT_EMPLOYEE_QUERY,
  schema,
} from "./db.js";

const fastify = Fastify({
  logger: true,
});

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
  // fastify.log(err);
  console.log("error ", err);
  process.exit(1);
}
