// pages/api/posts.js

import Users from "../../../lib/models/Users";
import connectMongoDB from "../../../lib/mongodb";

export default async function handler(req, res) {
  await connectMongoDB();
  const { action, name, email, password, limit, voices } = req.body;

  if (req.method === "GET") {
    try {
      const users = await Users.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      switch (action) {
        case "create":
          const newUser = new Users({ name, email, password, limit, voices });
          await newUser.save();
          res.status(201).json(newUser);
          break;
        case "getUserByEmail":
          const user = await Users.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
          res.status(200).json(user);
          break;
        case "updateVoice":
          const existingUser = await Users.findOne({ email });
          if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
          }
          existingUser.voices.push(voices);
          await existingUser.save();
          res.status(200).json(existingUser);
          break;
        case "updateLimit":
          const existiingUser = await Users.findOneAndUpdate(
            { email },
            { limit }
          );
          if (!existiingUser) {
            return res.status(404).json({ error: "User not found" });
          }
          await existiingUser.save();
          res.status(200).json(existiingUser);
          break;
        case "removeVoice":
          const userToRemoveVoice = await Users.findOne({ email });
          if (!userToRemoveVoice) {
            return res.status(404).json({ error: "User not found" });
          }
          userToRemoveVoice.voices.pull(voices);
          await userToRemoveVoice.save();
          res.status(200).json(userToRemoveVoice);
          break;
        default:
          res.status(400).json({ error: "Invalid action" });
          break;
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
