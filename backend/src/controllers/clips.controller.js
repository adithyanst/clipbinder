import { createClip } from "../services/clip.service";

export async function addClip(req, res) {
  const body = req.body;

  console.log("damn");

  const user = req.user;

  const clipPost = createClip({ data: body.data, type: body.type, usersId: user.userId });

  res.json(clipPost);
}
