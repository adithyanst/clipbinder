import { loginService, signUpService } from "../services/user.service.js";

export async function signUp(req, res) {
  try {
    const { jwt } = await signUpService(req.body);
    res.json({ jwt });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { jwt } = await loginService(req.body);
    res.json({ jwt });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
