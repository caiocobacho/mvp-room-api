"use strict";

const mongoose = require("../../../config/dbConnection");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;
const PlayerTokenEvents = require("./Events");

const playerTokenDataSchema = new Schema(
  {
    log_id: {
      required: true,
      type: String
    },
    tx_hash: {
      required: true,
      type: String
    },
    signature: {
      required: true,
      type: String
    },
    contract_address: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String,
      enum: [
        PlayerTokenEvents.ISSUE,
        PlayerTokenEvents.NEW_mvp,
        PlayerTokenEvents.TRANSFER
      ]
    },
    from_address: String,
    to_address: String,
    amount_wei: String,
    mvp_address: String,
    mvp_amount_wei: String,
    block_number: {
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

playerTokenDataSchema.index(
  { to_address: 1 },
  { collation: { locale: "en", strength: 2 } }
);

playerTokenDataSchema.plugin(mongoosePaginate);
module.exports = mongoose.db.model("PlayerTokenData", playerTokenDataSchema);
