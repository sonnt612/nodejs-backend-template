const mongoConnections = require("../connections/mongo")
const Schema = mongoose.Schema
const UserSchema = new mongoose.Schema(
 {
  username: {
   type: String,
   required: true,
   unique: true
  },
  password: {
   type: String,
   required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
   type: String,
   required: true
  },
  phone: {
   type: String
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  status: {
    type: Number,
    default: 1 // 1: active, 0: inactive
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
 },
 { id: false, versionKey: false },
)

module.exports = mongoConnections("master").model("User", UserSchema)
