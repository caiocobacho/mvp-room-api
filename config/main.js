module.exports = {
  environments: {
    test: "test",
    ropsten: "ropsten",
    mainnet: "mainnet"
  },
  rpc_endpoint: {
    test: "http://localhost:8545",
    ropsten: process.env.RPC_ENDPOINT || "< enter eth node >",
    mainnet: process.env.RPC_ENDPOINT || "< enter eth node >"
  },
  contract_included_block: 3121672,
  parsing_active: true,
  db_connection: {
    test: "mongodb://localhost:27017/mvp_data_test_db",
    ropsten:
      process.env.DB_CONNECTION || "mongodb://localhost:27017/mvp_data_test_db",
    mainnet:
      process.env.DB_CONNECTION || "mongodb://localhost:27017/mvp_data_test_db"
  },
  app_contract_address:
    process.env.CONTRACT || "0x70e5044cE689132d8ECf6EE3433AF796F8E46575",
  domain: process.env.API_DOMAIN || "http://localhost:3030",
  last_endpoint_version: "0.0.1",
  version: "v1",
  port: process.env.PORT || 3030
};
