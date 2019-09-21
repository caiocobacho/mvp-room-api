"use strict";

const express = require("express");

// Middleware
const pagination = require("./pagination");

// Controllers
const roomController = require("./roomList/controller");
const playersTokenController = require("./playerToken/controller");
const tokenHoldersController = require("./tokenHolders/controller");
const transactionController = require("./transactionParser/controller");

const apiRoutes = express.Router();
const v1Routes = express.Router();

// Set v1 routes as subgroup/middleware to apiRoutes
apiRoutes.use("/v1", v1Routes);

v1Routes.get("/room/statistics", roomController.getroomsStatistics);
v1Routes.post(
  "/room/list/category",
  pagination,
  roomController.getroomsByCategory
);
v1Routes.post("/room/list", pagination, roomController.getrooms);
v1Routes.get("/room/list", pagination, roomController.getrooms);
v1Routes.get("/room/:id", roomController.getroomById);
v1Routes.get("/token/:id", playerTokenController.getTokenById);
v1Routes.get(
  "/holders/:id",
  pagination,
  tokenHoldersController.getTokenHolders
);

// Account API
v1Routes.post(
  "/room/account/active",
  pagination,
  roomController.getroomsForAccountActive
);
v1Routes.post(
  "/room/account/finished",
  pagination,
  roomController.getroomsForAccountFinished
);

// Transaction API
v1Routes.post("/transaction/create", transactionController.addTransaction);
v1Routes.post(
  "/transaction/list",
  pagination,
  transactionController.getTransactions
);

module.exports = apiRoutes;
