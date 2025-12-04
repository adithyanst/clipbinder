import { createClip } from "../services/clips.service.js";
import { uploadSignedUrl } from "../services/imageUpload.service.js";
import randomIdGenerator from "../utils/randomIdGenerator.js";

export async function addClip(req, res, next) {
  try {
    const body = req.body;
    const user = req.user;

    const clipPost = await createClip({ data: body.data, type: body.type, usersId: user.userId });

    res.json(clipPost);
  } catch (err) {
    next(err);
  }
}

export async function uploadImage(req, res, next) {
  try {
    const uploadUrl = await uploadSignedUrl(randomIdGenerator(), "png");
    res.json({ uploadUrl });
  } catch (err) {
    next(err);
  }
}
