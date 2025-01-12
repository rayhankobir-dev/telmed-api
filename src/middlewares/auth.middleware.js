const AuthService = require("../services/auth.service");
const UserService = require("../services/user.service");
const expressAsyncHandler = require("express-async-handler");

const auth = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization || req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const formatedToken = token.replace("Bearer ", "");

  try {
    const decodedUser = await AuthService.verifyToken(formatedToken);
    const user = await UserService.getUserById(decodedUser.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
});

module.exports = auth;
