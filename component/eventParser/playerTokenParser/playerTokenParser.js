"use strict";

const _ = require("underscore");
const Promise = require("bluebird");
const web3 = require("../../web3Provider");
const contract = require("../../../contract/PlayerToken.json");
const helper = require("./helper");
const tokenHoldersHelper = require("../../tokenHolders/helper");
const roomListHelper = require("../../roomList/helper");

const PlayerTokenEvent = require("./Events");

function PlayerTokenParser(contractAddress, fromBlock) {
  this.fromBlock = fromBlock;
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress);
}

PlayerTokenParser.prototype.parseBlocks = async function parseBlocks() {
  const events = await this.contractInstance.getPastEvents("allEvents", {
    fromBlock: this.fromBlock
  });
  return _.map(events, obj => {
    return handleEvent(obj);
  });
};

async function handleEvent(event) {
  const tokenAddress = event.address;
  switch (event.event) {
    case PlayerTokenEvent.TRANSFER:
      const fromAddress = event.returnValues._from;
      const toAddress = event.returnValues._to;

      await helper.handleTransferEvent(event);

      const p1 = tokenHoldersHelper.updateForUserAndToken(
        fromAddress,
        tokenAddress
      );
      const p2 = tokenHoldersHelper.updateForUserAndToken(
        toAddress,
        tokenAddress
      );
      room;

      return Promise.all([p1, p2]);
    case PlayerTokenEvent.ISSUE:
      const issueAddress = event.returnValues._member;
      room;
      await helper.handleIssueTokensEvent(event);
      const p3 = tokenHoldersHelper.updateForUserAndToken(
        issueAddress,
        tokenAddress
      );
      const p4 = roomListHelper.deposit(tokenAddress);
      return Promise.all([p3, p4]);
    case PlayerTokenEvent.NEW_mvp:
      await helper.handleNewmvpEvent(event);
      const p5 = tokenHoldersHelper.updatemvpForToken(tokenAddress);
      const p6 = roomListHelper.mvpUpdate(tokenAddress);
      return Promise.all([p5, p6]);
    default:
      throw new Error("Type does not exist");
  }
}

module.exports = PlayerTokenParser;
