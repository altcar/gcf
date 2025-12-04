import { g as getPool } from '../../chunks/register_CV4jLPda.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || !("data" in body)) {
      return jsonResponse(
        { error: "Request body must be a JSON object with a 'data' key" },
        400
      );
    }
    const { data, companyname } = body;
    console.log("Received data:", data, companyname);
    if (typeof data !== "string" && typeof data !== "number" || data === "") {
      return jsonResponse(
        { error: "Invalid 'data' value: expected a non-empty string or number identifying the user" },
        400
      );
    }
    const id = Number(data);
    if (!Number.isFinite(id)) {
      return jsonResponse({ error: "Invalid 'data' value: must be a numeric id" }, 400);
    }
    const pool = getPool();
    await pool.execute(`UPDATE chocolate SET ${companyname} = 1 WHERE id = ?`, [id]);
    const [rows] = await pool.query(
      `SELECT ${companyname} FROM chocolate WHERE id = ? LIMIT 1`,
      [id]
    );
    console.log("Database query result:", rows);
    if (rows.length === 0) {
      return jsonResponse({ success: false, message: "No record found for that id." }, 404);
    }
    const safeJson = JSON.parse(
      JSON.stringify(rows, (_key, value) => typeof value === "bigint" ? value.toString() : value)
    );
    console.log("Safe JSON result:", safeJson);
    if (safeJson[0][companyname] !== 1) {
      return jsonResponse({ success: false, message: "Update failed." }, 200);
    } else {
      return jsonResponse({ success: true, message: "Update succeeded." }, 200);
    }
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Internal Server Error" }, 500);
  }
};
function jsonResponse(payload, status = 200, allowMethod) {
  const headers = {
    "Content-Type": "application/json"
  };
  return new Response(JSON.stringify(payload), { status, headers });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
