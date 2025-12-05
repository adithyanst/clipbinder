import { createClip, togglePinClip, deleteClip } from "../services/clips.service.js";
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

export async function togglePin(req, res, next) {
  try {
    const user = req.user;
    const { clipId } = req.body;

    if (!clipId) {
      return res.status(400).json({ message: "clipId is required" });
    }

    const updatedClip = await togglePinClip({ clipId, userId: user.userId });
    res.json(updatedClip);
  } catch (err) {
    next(err);
  }
}

export async function deleteClipHandler(req, res, next) {
  try {
    const user = req.user;
    const { clipId } = req.body;

    if (!clipId) {
      return res.status(400).json({ message: "clipId is required" });
    }

    const result = await deleteClip({ clipId, userId: user.userId });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
