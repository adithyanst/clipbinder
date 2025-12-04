import { createClip } from "../services/clips.service.js";
import { uploadSignedUrl } from "../services/imageUpload.service.js";
import randomIdGenerator from "../utils/randomIdGenerator.js";

export async function addClip(req, res) {
  const body = req.body;

  const user = req.user;

  console.log(req.user);

  console.log(user.userId);

  const clipPost = createClip({ data: body.data, type: body.type, usersId: user.userId });

  res.json(clipPost);
}

export async function uploadImage(req, res) {
  try {
    const uploadUrl = await uploadSignedUrl(randomIdGenerator(), "png");
    res.json({ uploadUrl });
  } catch (err) {
    res.json({ error: err });
  }
}
