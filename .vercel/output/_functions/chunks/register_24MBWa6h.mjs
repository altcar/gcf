import mysql from 'mysql2/promise';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const prerender = false;
let pool = null;
const getPool = () => {
  if (!pool) {
    const {
      //mysql://root::
      DB_HOST = "dbprovider.eu-central-1.clawcloudrun.com",
      DB_PORT = "47765",
      DB_USER = "u2",
      DB_PASSWORD = "8fz9sw4j@",
      DB_NAME = "virtual_venus"
    } = process.env;
    console.log("DB Connection Info:", {
      DB_HOST,
      DB_PORT,
      DB_USER,
      DB_NAME
    });
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 5
    });
  }
  return pool;
};
const POST = async ({ request }) => {
  let body = null;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, message: "Invalid JSON payload." }, 400);
  }
  const name = trimOrEmpty(body?.name);
  const email = trimOrEmpty(body?.email).toLowerCase();
  const course = trimOrEmpty(body?.course);
  const gradYearInput = trimOrEmpty(body?.gradYear);
  const errors = [];
  if (!name) errors.push("name");
  if (!emailPattern.test(email)) errors.push("email");
  if (!course) errors.push("course");
  const gradYear = Number.parseInt(gradYearInput, 10);
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  if (!Number.isFinite(gradYear) || gradYear < currentYear || gradYear > currentYear + 10) {
    errors.push("gradYear");
  }
  if (errors.length > 0) {
    return jsonResponse(
      {
        success: false,
        message: "Please correct the highlighted fields.",
        invalidFields: errors
      },
      400
    );
  }
  try {
    const conn = getPool();
    const [result] = await conn.execute(
      "INSERT INTO registrations (name, email, course, grad_year) VALUES (?, ?, ?, ?)",
      [name, email, course, gradYear]
    );
    if (!result.insertId) {
      return jsonResponse(
        { success: false, message: "Registration stored but no identifier was returned." },
        500
      );
    }
    const [rows] = await conn.query(
      "SELECT id FROM registrations WHERE id = ? LIMIT 1",
      [result.insertId]
    );
    const id = rows[0]?.id ?? result.insertId;
    await conn.execute(
      "INSERT INTO chocolate (id) VALUES (?)",
      [id]
    );
    return jsonResponse(
      {
        success: true,
        message: "Registration received. We will reach out soon.",
        data: { id, name, email, course, gradYear }
      },
      201
    );
  } catch (error) {
    console.error("Registration insert failed", error);
    return jsonResponse(
      { success: false, message: "Could not store registration. Please try again later." },
      500
    );
  }
};
const GET = () => jsonResponse({ success: false, message: "Method not allowed. Use POST." }, 405, "POST");
function trimOrEmpty(value) {
  return typeof value === "string" ? value.trim() : "";
}
function jsonResponse(payload, status = 200, allowMethod) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (allowMethod) headers["Allow"] = allowMethod;
  return new Response(JSON.stringify(payload), { status, headers });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	getPool,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, getPool as g };
