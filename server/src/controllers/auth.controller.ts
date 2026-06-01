import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      company: role === "EMPLOYER" ? company : undefined,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
