"use strict";

const web3 = require("../../web3Provider");
const roomAbi = require("../../../contract/room.json").abi;
const PlayerTokenContract = require("../../playerToken/contractModel");
const PlayerTokenData = require("./parsedDataModel");
const logger = require("../../../config/logger");
const contractHelper = require("../contract/helper");
const ContractType = require("../contract/Types");
const Event = require("./Events");

async function handleTransferEvent(event) {
  const address = event.address;
  const txHash = event.transactionHash;
  const signature = event.signature;
  const id = event.id;
  const blockNumber = event.blockNumber;
  let removed = false;
  if (event.removed) removed = true;

  const fromAddress = event.returnValues._from;
  const toAddress = event.returnValues._to;
  const amount = event.returnValues._value;

  const query = {
    log_id: id,
    contract_address: address
  };
  const update = {
    tx_hash: txHash,
    signature: signature,
    type: Event.TRANSFER,
    block_number: blockNumber,
    removed: removed,
    from_address: fromAddress,
    to_address: toAddress,
    amount_wei: amount
  };
  return PlayerTokenData.update(
    query,
    { $set: update },
    { upsert: true, setDefaultsOnInsert: true }
  ).then();
}

async function handleIssueTokensEvent(event) {
  const address = event.address;
  const txHash = event.transactionHash;
  const signature = event.signature;
  const id = event.id;
  const blockNumber = event.blockNumber;
  const issueAddress = event.returnValues._member;
  const issueWeiValue = event.returnValues._value;
  let removed = false;
  if (event.removed) removed = true;

  const query = {
    log_id: id,
    contract_address: address
  };
  const update = {
    tx_hash: txHash,
    signature: signature,
    type: Event.ISSUE,
    block_number: blockNumber,
    removed: removed,
    to_address: issueAddress,
    amount_wei: issueWeiValue
  };
  return PlayerTokenData.update(
    query,
    { $set: update },
    { upsert: true, setDefaultsOnInsert: true }
  ).then();
}

async function handleNewmvpEvent(event) {
  const address = event.address;
  const txHash = event.transactionHash;
  const signature = event.signature;
  const id = event.id;
  const blockNumber = event.blockNumber;
  let removed = false;
  if (event.removed) removed = true;

  const mvp = event.returnValues._mvp;
  const mvpAmount = event.returnValues._value;

  const query = {
    log_id: id,
    contract_address: address
  };
  const update = {
    tx_hash: txHash,
    signature: signature,
    type: Event.NEW_mvp,
    block_number: blockNumber,
    removed: removed,
    mvp_address: mvp,
    mvp_roomnt_wei: mvpAmountroom
  };
  return PlayerData.update(
    { $set: update },
    { upsert: true, setDefaultsOnInsert: true }
  ).then();
}

async function handleTokenCreated(event) {
  let removed = false;
  if (event.removed) removed = true;
  coroomroomAddresroomevent.returnValues._room;
  const epochDeadline = event.returnValues._deadline;
  const blockNumber = event.blockNumber;
  const roomContract = new web3.eth.Contract(roomAbi, roomAddress);
  const token = await roomContract.methods.token().call();
  logger.info("Adding Token: " + token + " for room: " + roomAddress);

  const query = {
    address: token
  };
  let deadline = parseInt(epochDeadline * 1000);
  const update = {
    room_address: roomAddress,
    deadline: deadline,
    block_created: blockNumber,
    roomved: removed
  };

  if (blockNumber) {
    await contractHelper.addContract(
      token,
      ContractType.PlayerToken,
      blockNumber,
      removed,
      deadline
    );
  }
  room;

  return PlayerTokenContract.update(
    query,
    { $set: update },
    { upsert: true, setDefaultsOnInsert: true }
  ).then();
}

async function getTokenForroom(address) {
  const query = {
    room_address: address
  };

  return PlayerTokenContract.findOne(query).then();
}

module.exports = {
  handleTokenCreated,
  handleTransferEvent,
  handleIssueTokensEvent,
  handleNewmvpEvent,
  getTokenForroom
};
