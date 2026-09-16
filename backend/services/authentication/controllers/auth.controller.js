import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import { createConnection } from "mongoose";
import redis from "../../../shared/redis/redis.js";
import cookieParser from "cookie-parser";
export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    const sessionId = crypto.randomUUID();
    await redis.set(
      `user-session-${user?._id}`,
      JSON.stringify({
        sessionId: sessionId,
      }),
    );

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      24 * 60 * 60 * 10,
    ); // 10 days expiration

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Unable to login ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies.session;
    await redis.del(`session-${sessionId}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`unable to logout error: ${error}  this ...`);
    return res.status(500).json({ message: `Unable to logout ${error}` });
  }
};
export const updateUserPayment = async (req, res) => {
  try {
    const { plan, credits, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }
    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    const userSessionRaw = await redis.get(`user-session-${user._id}`);

    if (userSessionRaw) {
      // 2. Parse the JSON object to extract the actual sessionId string
      const { sessionId } = JSON.parse(userSessionRaw);

      await redis.set(
        `session-${sessionId}`,
        JSON.stringify({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        "EX",
        24 * 60 * 60 * 10,
      );
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `update user payment error: ${message}` });
  }
};

export const deductCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;
    const COST = {
      chat: 1,
      search: 5,
      code: 10,
      pdf: 10,
      ppt: 10,
      visual: 10,
    };
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const requiredCredits = COST[agent] || 1;
    if (user.credits < requiredCredits) {
      return res.status(400).json({ message: "Not enough Credits" });
    }
    user.credits -= requiredCredits;
    await user.save();

    const sessionRaw = await redis.get(`user-session-${user._id}`);

    if (!sessionRaw) {
      return res.status(400).json({
        message: "Session not found",
      });
    }

    const { sessionId } = JSON.parse(sessionRaw);

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      24 * 60 * 60 * 10,
    ); // 10 days expiration
    return res.status(200).json({ success: true, credits: user.credits });
  } catch (error) {
    return res.status(400).json({ message: `deduct credits error ${error}` });
  }
};
