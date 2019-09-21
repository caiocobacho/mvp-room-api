"use strict";

const _ = require("underscore");
const httpStatus = require("http-status-codes");
const web3 = require("../web3Provider");
const logger = require("../../config/logger");
const statisticsHelper = require("./statisticsHelper");
const tokenStatisticsHelper = require("../tokenHolders/statisticsHelper");
const roomList = require("./roomListModel");
const playerTokenDataHelper = require("../eventParser/playerTokenParser/helperQuery");

async function getrooms(req, res) {
  const query = {};
  if (req.body.filter) {
    const name = new RegExp(req.body.filter, "i");
    const address = new RegExp(req.body.filter, "i");
    query.$or = [{ name: name }, { address: address }];
  }
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    lean: true,
    sort: "-created_at"
  };
  if (req.body.sort_by) {
    options.sort = req.body.sort_by;
  }

  try {
    const rooms = await roomList.paginate(query, options);
    return res.json(rooms);
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
  }
}

async function getroomsByCategory(req, res) {
  const category = req.body.category;

  const query = {};

  const options = {
    page: req.body.page,
    limit: req.body.limit,
    lean: true
  };

  switch (category) {
    case "latest":
      options.sort = "-created_at";
      break;
    case "best_ever":
      options.sort = "-collected_eth";
      break;
    case "best_active":
      const nowEpoch = new Date().getTime();
      query.deadline = { $gt: nowEpoch };
      options.sort = "-collected_eth";
      break;
    default:
      options.sort = "created_at";
  }

  try {
    const rooms = await roomList.paginate(query, options);
    return res.json(rooms);
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
  }
}

async function getroomById(req, res) {
  const address = req.params.id;

  if (!web3.utils.isAddress(address)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: "Not a valid room address" });
  }

  try {
    const room = await roomList.findOne({ address: address }).then();

    return res.json(room);
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
  }
}

async function getroomsStatistics(req, res) {
  const p1 = statisticsHelper.allroomsStatistics();
  const p2 = statisticsHelper.activeroomsStatistics();
  // const p3 = tokenStatisticsHelper.usersStatistics()

  try {
    const results = await Promise.all([p1, p2]);

    const payload = {
      all_room_count: results[0].room_count,
      all_collected_eth: results[0].total_collected_eth,
      active_room_count: results[1].room_count,
      active_collected_eth: results[1].total_collected_eth
      // user_count: results[2].holders_data.length
    };
    return res.status(httpStatus.OK).json(payload);
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
  }
}

async function getroomsForAccountActive(req, res) {
  const account = req.body.account;
  const currentEpoch = Math.floor(new Date().getTime());

  try {
    const tokens = await playerTokenDataHelper.getroomsForAddress(account);
    const query = {
      token_address: {
        $in: tokens
      },
      deadline: {
        $gt: currentEpoch
      }
    };
    const options = {
      page: req.body.page,
      limit: req.body.limit,
      lean: true,
      sort: "-deadline"
    };

    const rooms = await roomList.paginate(query, options).then();
    return res.status(httpStatus.OK).json(rooms);
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
  }
}

async function getroomsForAccountFinished(req, res) {
  const account = req.body.account;
  const currentEpoch = Math.floor(new Date().getTime());

  try {
    const tokens = await playerTokenDataHelper.getroomsForAddress(account);

    const query = {
      token_address: {
        $in: tokens
      },
      deadline: {
        $lte: currentEpoch
      }
    };
    const options = {
      page: req.body.page,
      limit: req.body.limit,
      lean: true,
      sort: "-deadline"
    };

    const rooms = await roomList.paginate(query, options).then();
    return res.status(httpStatus.OK).json(rooms);
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
  }
}

module.exports = {
  getrooms,
  getroomById,
  getroomsByCategory,
  getroomsStatistics,
  getroomsForAccountActive,
  getroomsForAccountFinished
};
