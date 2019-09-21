"use strict";

const mongoose = require("../../config/dbConnection");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const roomContractSchema = new Schema(
  {
    address: {
      required: true,
      type: String
    },
    creator_address: {
      required: true,
      type: String
    },
    rate: {
      required: true,
      type: Number
    },
    name: {
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
    },
    event_id: String
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

roomContractSchema.plugin(mongoosePaginate);
module.exports = mongoose.db.model("RoomContract", roomContractSchema);
