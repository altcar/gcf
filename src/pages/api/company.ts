import type { APIRoute } from 'astro';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from './register.ts';

export const prerender = false;

const companyColumnByKey: Record<string, string> = {
	bedesign: 'company1',
	enactus: 'company2',
	laing: 'company3',
	mm: 'company4',
	placement: 'company5',
	res: 'company6',
	rps: 'company7',
	company1: 'company1',
	company2: 'company2',
	company3: 'company3',
	company4: 'company4',
	company5: 'company5',
	company6: 'company6',
	company7: 'company7',
};

const companySlugByColumn: Record<string, string> = {
	company1: 'bedesign',
	company2: 'enactus',
	company3: 'laing',
	company4: 'mm',
	company5: 'placement',
	company6: 'res',
	company7: 'rps',
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json().catch(() => null);
		if (!body || typeof body !== 'object' || !('data' in body)) {
			return jsonResponse(
				{ error: "Request body must be a JSON object with a 'data' key" },
				400,
			);
		}
		const { data, companyname } = body as { data: unknown; companyname?: unknown };
		const companyKey = typeof companyname === 'string' ? companyname.trim().toLowerCase() : '';
		const companyColumn = companyColumnByKey[companyKey];
		if (!companyColumn) {
			const allowedCompanies = Object.keys(companyColumnByKey).filter(
				(key) => !key.startsWith('company'),
			);
			return jsonResponse(
				{
					error: 'Unknown company identifier.',
					allowedCompanies,
				},
				400,
			);
		}

		if ((typeof data !== 'string' && typeof data !== 'number') || data === '') {
			return jsonResponse(
				{ error: "Invalid 'data' value: expected a non-empty string or number identifying the user" },
				400,
			);
		}

		const id = Number(data);
		if (!Number.isFinite(id)) {
			return jsonResponse({ error: "Invalid 'data' value: must be a numeric id" }, 400);
		}

		const pool = getPool();
		const [updateResult] = await pool.execute<ResultSetHeader>(
			`UPDATE chocolate SET ${companyColumn} = 1 WHERE id = ?`,
			[id],
		);
		if (!updateResult.affectedRows) {
			return jsonResponse({ success: false, message: 'No record found for that id.' }, 404);
		}

		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT ${companyColumn} AS visited, already FROM chocolate WHERE id = ? LIMIT 1`,
			[id],
		);
		const row = rows[0];
		if (!row) {
			return jsonResponse({ success: false, message: 'No record found for that id.' }, 404);
		}

		const visited = Number(row.visited) === 1;
		return jsonResponse(
			{
				success: visited,
				message: visited ? 'Visit recorded.' : 'Update failed.',
				data: {
					id,
					company: companySlugByColumn[companyColumn] ?? companyKey,
					column: companyColumn,
					visited,
					already: Number(row.already) === 1,
				},
			},
			200,
		);
	} catch (err) {
		console.error(err);
		return jsonResponse({ error: 'Internal Server Error' }, 500);
	}
};

function jsonResponse(payload: unknown, status = 200, allowMethod?: string) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (allowMethod) headers['Allow'] = allowMethod;
	return new Response(JSON.stringify(payload), { status, headers });
}
