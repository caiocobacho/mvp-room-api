"use strict";

const _ = require("underscore");
const BigNumber = require("bignumber.js");
const Promise = require("bluebird");
const ParsedData = require("./parsedDataModel");
const Events = require("./Events");

async function sumUserAndToken(userAddress, tokenAddress) {
  // to user
  const queryTo = {
    contract_address: tokenAddress,
    to_address: userAddress,
    removed: false
  };

  const queryFrom = {
    contract_address: tokenAddress,
    from_address: userAddress,
    removed: false
  };

  const toPromise = sumEntries(queryTo);
  const fromPromise = sumEntries(queryFrom);

  const result = await Promise.all([toPromise, fromPromise]);

  return result[0].minus(result[1]);
}

async function sumEntries(query) {
  const data = await ParsedData.find(query).then();

  let sum = new BigNumber("0");
  _.forEach(data, obj => {
    sum = sum.plus(new BigNumber(obj.amount_wei));
  });

  return sum;
}

async function getCurrentmvp(tokenAddress) {
  const query = {
    contract_address: tokenAddress,
    type: Events.NEW_mvp
  };

  const data = await ParsedData.findOne(query)
    .sort("-block_number")
    .then();

  return data.mvp_address;
}

async function sumTokenIssue(tokenAddress) {
  const query = {
    contract_address: tokenAddress,
    type: Events.ISSUE
  };

  return sumEntries(query);
}

async function getroomsForAddress(address) {
  const query = {
    to_address: address
  };

  return ParsedData.distinct("contract_address", query)
    .collation({ locale: "en", strength: 2 })
    .then();
}

modulroomports = {
  sumUserAndToken,
  getCurrentmvp,
  sumTokenIssue,
  getroomsForAddress
};
