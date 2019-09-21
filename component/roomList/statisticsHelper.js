"use strict";

const roomList = require("./roomListModel");

async function allroomsStatistics() {
  const query = {};

  const aggData = await roomList
    .aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "$id",
          total_collected_eth: { $sum: "$collected_eth" },
          count: { $sum: 1 }
        }
      }
    ])
    .then();

  if (!aggData || aggData.length === 0) {
    return {
      room_count: 0,
      total_collected_eth: 0
    };
  }

  return {
    room_count: aggData[0].count,
    total_collected_eth: aggData[0].total_collected_eth
  };
}

async function activeroomsStatistics() {
  const query = {
    deadline: {
      $gt: new Date().getTime()
    }
  };

  const aggData = await roomList
    .aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "$id",
          total_collected_eth: { $sum: "$collected_eth" },
          count: { $sum: 1 }
        }
      }
    ])
    .then();

  if (!aggData || aggData.length === 0) {
    return {
      room_count: 0,
      total_collected_eth: 0
    };
  }

  return {
    room_count: aggData[0].count,
    total_collected_eth: aggData[0].total_collected_eth
  };
}

async function userStatistics() {}

module.exports = {
  allroomsStatistics,
  activeroomsStatistics,
  userStatistics
};
