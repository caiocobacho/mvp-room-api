"use strict";

const Room = require("./RoomModel");
const contractHelper = require("../eventParser/contract/helper");
const ContractType = require("../eventParser/contract/Types");

async function handleRoomCreated(event) {
  const address = event.returnValues._Room;
  const creatorAddress = event.returnValues._creator;
  const name = event.returnValues._name;
  const rate = event.returnValues._rate;
  const epochDeadline = event.returnValues._deadline;
  const blockNumber = event.blockNumber;
  const id = event.id;
  let removed = false;
  if (event.removed) removed = true;

  const query = {
    address: address
  };

  let deadline = parseInt(epochDeadline * 1000);
  const update = {
    creator_address: creatorAddress,
    block_created: blockNumber,
    removed: removed,
    rate: rate,
    name: name,
    deadline: deadline,
    event_id: id
  };

  if (blockNumber) {
    await contractHelper.addContract(
      address,
      ContractType.Room,
      blockNumber,
      removed,
      deadline
    );
  }
  const created = await Room.update(
    query,
    { $set: update },
    { upsert: true, setDefaultsOnInsert: true }
  ).then();

  // Check if new entry
  return created.n && !created.nModified;
}

module.exports = {
  handleRoomCreated
};
