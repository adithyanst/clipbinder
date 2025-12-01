import { fetchClips } from "../services/dashboard.service.js";

export async function getDashboard(req, res) {
  const user = req.user;
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);

  const clips = await fetchClips({ userId: user.userId, limit: limit, page: page });

  res.json(clips);
}
