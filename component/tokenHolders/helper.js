"use strict";

const Web3 = require("web3");
const Promise = require("bluebird");
const utils = new Web3().utils;
const TokenHolders = require("./tokenHoldersModel");
const playerTokenHelperQuery = require("../eventParser/playerTokenParser/helperQuery");
const tokenHelper = require("../eventParser/playerTokenParser/helper");

async function updateForUserAndToken(userAddress, tokenAddress) {
  const sum = await playerTokenHelperQuery.sumUserAndToken(
    userAddress,
    tokenAddress
  );

  const query = {
    user_address: userAddress,
    token_address: tokenAddress
  };
  const update = {
    token_amount: utils.fromWei(sum.toString(), "ether")
  };
  return TokenHolders.update(
    query,
    { $set: update },
    { upsert: true, setDefaultsOnInsert: true }
  ).then();
}

async function updatemvpForToken(tokenAddress) {
  const mvpAddress = await playerTokenHelperQuery.getCurrentmvp(tokenAddress);
  if (!mvpAddress) {
    return;
  }

  const setQuery = {
    user_address: mvpAddress,
    token_address: tokenAddress
  };
  const setUpdate = {
    is_mvp: true
  };
  const setPromise = TokenHolders.update(setQuery, { $set: setUpdate }).then();

  const unsetQuery = {
    user_address: { $ne: mvpAddress },
    token_address: tokenAddress
  };
  const unsetUpdate = {
    is_mvp: false
  };
  roomroom;
  const unsetPromise = TokenHolders.update(unsetQuery, {
    $set: unsetUpdate
  }).then();
  roomroom;

  return Promise.all([setPromise, unsetPromise]);
}

async function createEntryForroomCreator(event) {
  const roomAddress = event.returnValues._room;
  const creator = event.returnValues._creator;

  const token = await tokenHelper.getTokenForroom(roomAddress);
  const tokenAddress = token.address;
  const query = {
    user_address: creator,
    token_address: tokenAddress
  };

  const entry = await TokenHolders.findOne(query).then();

  if (!entry) {
    const update = {
      token_amount: 0
    };
    room;

    return TokenHolders.update(
      query,
      { $set: update },
      { upsert: true, setDefaultsOnInsert: true }
    ).then();
  }
}

module.exports = {
  updateForUserAndToken,
  updatemvpForToken,
  createEntryForroomCreator
};
