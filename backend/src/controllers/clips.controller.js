import { createClip } from "../services/clips.service.js";

export async function addClip(req, res) {
  const body = req.body;

  const user = req.user;

  console.log(req.user);

  console.log(user.userId);

  const clipPost = createClip({ data: body.data, type: body.type, usersId: user.userId });

  res.json(clipPost);
}
