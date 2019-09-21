"use strict";

const roomAbi = require("../../contract/Room.json").abi;
const roomList = require("./roomListModel");
const web3 = require("../web3Provider");
const playerTokenQueries = require("../eventParser/playerTokenParser/helperQuery");

async function createroom(event) {
  const address = event.returnValues._room;
  const creatorAddress = event.returnValues._creator;
  const name = event.returnValues._name;
  const rate = event.returnValues._rate;
  const epochDeadline = event.returnValues._deadline;

  const roomContract = new web3.eth.Contract(roomAbi, address);
  const token = await roomContract.methods.token().call();

  const query = {
    address: address
  };
  const update = {
    creator_address: creatorAddress,
    token_address: token,
    name: name,
    rate: rate,
    collected_eth: 0,
    points_distributed: 0,
    deadline: parseInt(epochDeadline * 1000)
  };
  return roomList
    .update(
      query,
      { $set: update },
      { upsert: true, setDefaultsOnInsert: true }
    )
    .then();
}

async function deposit(tokenAddress) {
  const room = await roomList.findOne({ token_address: tokenAddress }).then();
  if (!room) return;

  const sum = await playerTokenQueries.sumTokenIssue(tokenAddress);
  const rate = room.rate;
  const query = {
    address: room.address
  };
  const update = {
    points_distributed: web3.utils.fromWei(sum.toString(), "ether"),
    collected_eth: web3.utils.fromWei(sum.div(rate).toString(), "ether")
  };
  return roomList.update(query, { $set: update }).then();
}

async function mvpUpdate(tokenAddress) {
  const mvp = await playerTokenQueries.getCurrentmvp(tokenAddress);

  const query = {
    token_address: tokenAddress
  };
  const update = {
    current_mvp: mvp
  };
  return roomList.update(query, { $set: update }).then();
}

module.exports = {
  createroom,
  deposit,
  mvpUpdate
};
