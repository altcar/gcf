import type { APIRoute } from 'astro';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import mysql from 'mysql2/promise';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const prerender = false;

let pool: Pool | null = null;

export const getPool = () => {
	if (!pool) {

		pool = mysql.createPool({
			host: import.meta.env.SECRET_DB_HOST,
			port: Number(import.meta.env.SECRET_DB_PORT),
			user: import.meta.env.SECRET_DB_USER,
			password: import.meta.env.SECRET_DB_PASSWORD,
			database: import.meta.env.SECRET_DB_NAME,
			waitForConnections: true,
			connectionLimit: 5,
		});
	}
	return pool;
};

export const POST: APIRoute = async ({ request }) => {
	let body: Record<string, unknown> | null = null;
	try {
		body = await request.json();
	} catch {
		return jsonResponse({ success: false, message: 'Invalid JSON payload.' }, 400);
	}

	const name = trimOrEmpty(body?.name);
	const email = trimOrEmpty(body?.email).toLowerCase();
	const course = trimOrEmpty(body?.course);
	const gradYearInput = trimOrEmpty(body?.gradYear);

	const errors: string[] = [];
	if (!name) errors.push('name');//|| !email.endsWith('.edu')
	if (!emailPattern.test(email) ) errors.push('email');
	if (!course) errors.push('course');

	const gradYear = Number.parseInt(gradYearInput, 10);
	const currentYear = new Date().getFullYear();
	// if (!Number.isFinite(gradYear) || gradYear < currentYear || gradYear > currentYear + 10) {
	// 	errors.push('gradYear');
	// }

	if (errors.length > 0) {
		return jsonResponse(
			{
				success: false,
				message: 'Please correct the highlighted fields.',
				invalidFields: errors,
			},
			400,
		);
	}

	try {
		const conn = getPool();
		
		const [result] = await conn.execute<ResultSetHeader>(
			'INSERT INTO registrations (name, email, course, grad_year) VALUES (?, ?, ?, ?)',
			[name, email, course, gradYear],
		);

		if (!result.insertId) {
			return jsonResponse(
				{ success: false, message: 'Registration stored but no identifier was returned.' },
				500,
			);
		}

		const [rows] = await conn.query<RowDataPacket[]>(
			'SELECT id FROM registrations WHERE id = ? LIMIT 1',
			[result.insertId],
		);

		const id = rows[0]?.id ?? result.insertId;




		 await conn.execute<ResultSetHeader>(
			'INSERT INTO chocolate (id) VALUES (?)',
			[id],
		);



		
		return jsonResponse(
			{
				success: true,
				message: 'Registration received. We will reach out soon.',
				data: { id, name, email, course, gradYear },
			},
			201,
		);
	} catch (error) {
		console.error('Registration insert failed', error);
		return jsonResponse(
			{ success: false, message: 'Could not store registration. Please try again later.' },
			500,
		);
	}
};

export const GET: APIRoute = () =>
	jsonResponse({ success: false, message: 'Method not allowed. Use POST.' }, 405, 'POST');

function trimOrEmpty(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function jsonResponse(payload: unknown, status = 200, allowMethod?: string) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (allowMethod) headers['Allow'] = allowMethod;
	return new Response(JSON.stringify(payload), { status, headers });
}
