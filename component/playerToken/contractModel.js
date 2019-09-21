"use strict";

const mongoose = require("../../config/dbConnection");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const playerTokenContractSchema = new Schema(
  {
    address: {
      required: true,
      type: String
    },
    room_address: {
      required: true,
      type: String
    },
    deadline: {
      required: true,
      type: Number
    },
    block_created: {
      type: Number
    },
    removed: {
      required: true,
      type: Boolean
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

playerTokenContractSchema.plugin(mongoosePaginate);
module.exports = mongoose.db.model(
  "PlayerTokenContract",
  playerTokenContractSchema
);
