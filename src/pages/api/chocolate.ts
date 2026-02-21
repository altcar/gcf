import type { APIRoute } from 'astro';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from './register.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json().catch(() => null);
		if (!body || typeof body !== 'object' || !('data' in body)) {
			return jsonResponse(
				{ error: "Request body must be a JSON object with a 'data' key" },
				400,
			);
		}
		const { data } = body as { data: unknown };

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
		const [rows] = await pool.query<RowDataPacket[]>(
			' SELECT company1, company2, company3, company4, company5, company6, company7, already FROM chocolate WHERE id = ? LIMIT 1',
			[id],
		);
		const row = rows[0];
		if (!row) {
			return jsonResponse({ success: false, message: 'No record found for that id.' }, 404);
		}

		const visited = [
			Number(row.company1),
			Number(row.company2),
			Number(row.company3),
			Number(row.company4),
			Number(row.company5),
			Number(row.company6),
			Number(row.company7),
		];
		const completed = visited.every((flag) => flag === 1);
		const already = Number(row.already) === 1;
		const shouldMark = completed && !already;
		let markUpdated = false;

		if (shouldMark) {
			const [updateResult] = await pool.execute<ResultSetHeader>(
				'UPDATE chocolate SET already = 1 WHERE id = ? AND already = 0',
				[id],
			);
			markUpdated = updateResult.affectedRows > 0;
		}

		return jsonResponse(
			{
				success: completed,
				completed,
				message: completed
					? already
						? 'Already redeemed.'
						: 'Completed all visits. Marked as redeemed.'
					: 'Not all company visits are complete.',
				data: {
					id,
					visited,
					already: already || markUpdated,
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
