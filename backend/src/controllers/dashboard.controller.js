import { fetchClips, searchClips } from "../services/dashboard.service.js";

export async function getDashboard(req, res, next) {
  try {
    const user = req.user;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);

    const clips = await fetchClips({ userId: user.userId, limit: limit, page: page });

    res.json(clips);
  } catch (err) {
    next(err);
  }
}

export async function search(req, res, next) {
  try {
    const user = req.user;
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.json([]);
    }

    const results = await searchClips({ userId: user.userId, query: query.trim() });

    res.json(results);
  } catch (err) {
    next(err);
  }
}
