const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userRoles } = require("../helper/constant");

class UserService {
  static async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  static async updateUser(id, updates) {
    try {
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  static async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { user, token };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  static async getAllUsers(filters = {}) {
    try {
      return await User.find(filters);
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async getUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  static async getDoctors() {
    try {
      return await User.find({ role: userRoles.DOCTOR });
    } catch (error) {
      throw new Error(`Error fetching doctors: ${error.message}`);
    }
  }
}

module.exports = UserService;
