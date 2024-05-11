import { Schema, model, models } from "mongoose";

const UsersSchema = new Schema({
  name: String,
  email: String,
  password: String,
  limit: String,
  voices: Array(
    Object({
      voice_id: String,
      voiceName: String,
      voiceDescription: String,
    })
  ),
});

const Users = models.Users || model("Users", UsersSchema);
export default Users;
