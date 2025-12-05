import { fetchClips, searchClips } from "../services/dashboard.service.js";

export async function getDashboard(req, res, next) {
  try {
    const user = req.user;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const sortBy = req.query.sortBy || "date";
    const sortOrder = req.query.sortOrder || "desc";
    const filterType = req.query.filterType || null;

    const clips = await fetchClips({
      userId: user.userId,
      limit: limit,
      page: page,
      sortBy,
      sortOrder,
      filterType,
    });

    res.json(clips);
  } catch (err) {
    next(err);
  }
}

export async function search(req, res, next) {
  try {
    const user = req.user;
    const { query } = req.query;
    const sortBy = req.query.sortBy || "date";
    const sortOrder = req.query.sortOrder || "desc";
    const filterType = req.query.filterType || null;

    if (!query || query.trim() === "") {
      return res.json([]);
    }

    const results = await searchClips({
      userId: user.userId,
      query: query.trim(),
      sortBy,
      sortOrder,
      filterType,
    });

    res.json(results);
  } catch (err) {
    next(err);
  }
}
