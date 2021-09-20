const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

// Custom modules
const WrappedNft            = require('./abi/wrapped');
const ScapeNFT              = require('./abi/source');
const { parse } = require("ipaddr.js");

// Ethereum Node endpoints
const TESTNET_URL = "wss://eth-rinkeby.alchemyapi.io/v2/"
// const MAINNET_URL = "wss://eth-mainnet.ws.alchemyapi.io/v2/";

const web3 = createAlchemyWeb3(
  TESTNET_URL + process.env.ALCHEMY_V2_KEY,
);

// Validation of Block confirmation
let getLatestBlock = async function(web3) {
  return await web3.eth.getBlockNumber();
}

let getMintedBlock = async function(wrapped, tokenID) {
  return await wrapped.methods.blockNumbers(tokenID).call();
}

// Validating owner
let getOwner = async function(wrapped, tokenID) {
  return await wrapped.methods.ownerOf(tokenID).call();
}

/**
 * 
 * @param {Express POST req.params} input JSONRPC body parameters
 * @param {Return the result} callback 
 */
let verifyWrappedNFT = async function(input, callback) {
  let tokenID = parseInt(input.data.tokenID);
  let wrapped = input.data.wrapped;
  let minter = input.data.minter;

  if (input.id == undefined || tokenID == undefined || wrapped == undefined || minter == undefined) {
    let errorData = {
      jobRunID: input.id,
      status: "errored",
      error: "Invalid input parameter!"
    };
    callback(500, errorData);
    return;
  }

  let wrappedContract;
  try {
    wrappedContract = new web3.eth.Contract(WrappedNft.formatted, wrapped);
  } catch (error) {
    let errorData = {
      jobRunID: input.id,
      status: "errored",
      error: "Failed to load Wrapped Smartcontract!"
    };
    callback(500, errorData);
    return;
  }

  /// Verifying that Block Height passed
  let latestBlock = await getLatestBlock(web3);
  let mintedBlock = await getMintedBlock(wrappedContract, tokenID);
  let confirmation = parseInt(process.env.CONFIRMATION);
  if (latestBlock - mintedBlock < confirmation) {
    let errorData = {
      jobRunID: input.id,
      status: "errored",
      error: "Block Confirmation didn't pass!"
    };
    callback(500, errorData);
    return;
  }

  /// Verifying the Minter
  let wrappedOwner = await getOwner(wrappedContract, tokenID);
  
  if (minter.toLowerCase() != wrappedOwner.toLowerCase()) {
    let errorData = {
      jobRunID: input.id,
      status: "errored",
      error: "Minter on Target doesn't match the owner on Source!"
    };
    callback(500, errorData);
    return;
  }

  /// Fetching required data
  let source;
  try {
    source = await wrappedContract.methods.source().call();
  } catch (error) {
    let errorData = {
      jobRunID: input.id,
      status: "errored",
      error: "Failed to detect Wrapped NFT address!"
    };
    callback(500, errorData);
    return;
  }

  let sourceContract;
  try {
    sourceContract = new web3.eth.Contract(ScapeNFT.formatted, source);
  } catch (error) {
    let errorData = {
      jobRunID: input.id,
      status: "errored",
      error: "Failed to load Source Smartcontract!"
    };
    callback(500, errorData);
    return;
  }

  let tokenURI;
  // ERC721 Non-standard parameters.
  // In our case its Scape NFT parameters.
  let params;
  try {
    tokenURI = await sourceContract.methods.tokenURI(tokenID).call();

    // For other NFTs the parameters might be fetched in a different way
    let scapeParams = await sourceContract.methods.paramsOf(tokenID).call();
    params = {
      quality: parseInt(scapeParams.quality),
      generation: parseInt(scapeParams.generation)
    };

  } catch (error) {
    let errorData = {
      jobRunID: input.id,
      status: "errored",
      error: "Failed to fetch Source contract parameters!"
    };
    callback(500, errorData);
    return;
  }

  /// Concatinating. If Token URI is too big, shorten it.
  let result = web3.utils.bytesToHex([params.quality]) + web3.utils.bytesToHex([params.generation]).substr(2) + tokenURI;

  /// Returning data
  let returnData = {
    jobRunID: input.id,
    data: {
      result: result        // Fast data result is returned in `result` property according to ChainLink.
    }
  };

  callback(200, returnData);
};

module.exports.verifyWrappedNFT = verifyWrappedNFT;