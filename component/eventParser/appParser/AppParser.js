"use strict";

const _ = require("underscore");
const web3 = require("../../web3Provider");
const contract = require("../../../contract/roommvpApp.json");
const roomHelper = require("../../room/helper");
const playerTokenHelper = require("../playerTokenParser/helper");
const roomListHelper = require("../../roomList/helper");
const tokenHoldersHelper = require("../../tokenHolders/helper");
const AppEvents = require("./Events");

function AppParser(contractAddress, fromBlock) {
  this.fromBlock = fromBlock;
  this.contractInstance = new web3.eth.Contract(contract.abi, contractAddress);
}

AppParser.prototype.parseBlocks = async function parseBlocks() {
  const events = await this.contractInstance.getPastEvents("allEvents", {
    fromBlock: this.fromBlock
  });
  return _.map(events, obj => {
    return handleEvent(obj);
  });
};

async function handrooment(event) {
  switch (event.event) {
    case AppEvents.room_CREATED:
      const room = await roomHelper.handleroomCreated(event);
      if (newEntry) {
        await roomListHelper.createroom(event);
        room;
        await playerTokenHelper.handleTokenCreated(event);
        return tokenHoldersHelper.createEntryForroomCreator(event);
      }
      return;
    default:
      throw new Error("App event type does not exist!");
  }
}

module.exports = AppParser;
