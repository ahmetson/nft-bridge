"use strict";

window.initContracts = async function() {
    let chainId = await web3.eth.getChainId();
    if (undefined === blockchainConfig[chainId]) {
        // Load chain information over an HTTP API
        const chainData = window.evmChains.getChain(chainId);

        printErrorMessage(`${chainData.name} not supported. Please switch your blockchain network!`);
        return;
    }
    console.log(`Chain id: ${chainId}, Source: ${SOURCE_NETWORK_ID}, Target: ${TARGET_NETWORK_ID}`);
    if (chainId == SOURCE_NETWORK_ID) {
        try {
            window.source       = await getContract("source");
            window.wrapped      = await getContract("wrapped");
        } catch (e) {
            printErrorMessage(e);
            return;
        }
    } else if (chainId == TARGET_NETWORK_ID) {
        console.log("Changed to Target");
        try {
            window.bridged      = await getContract("bridged");

            // Connecting to target blockchain also means that ready to mint the token
            document.querySelector("#tx-status").textContent = "Mint the token";

            let btnBlockConfirm = document.querySelector("#btn-block-confirm");
            let btnChangeNetwork = document.querySelector("#btn-change-network");
            let btnMint = document.querySelector("#btn-mint");
        
            // Show only confirmation waiting button
            btnBlockConfirm.setAttribute("style", "display: none;");
            btnChangeNetwork.setAttribute("style", "display: none;");
            btnMint.removeAttribute("style");
            btnMint.removeAttribute("disabled");
        } catch (e) {
            printErrorMessage(e);
            return;
        }
    }
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
    document.querySelector("#btn-fetch").addEventListener("click", onFetch);
    document.querySelector("#btn-approve").addEventListener("click", onApprove);
    document.querySelector("#btn-wrap").addEventListener("click", onWrap);
    document.querySelector("#btn-mint").addEventListener("click", onMint);

    let toastEl = document.querySelector("#toast");
    window.toast = new bootstrap.Toast(toastEl);
});


async function showMeta(tokenId, owner, src, name) {
    document.querySelector("#nft-id").textContent = tokenId.toString();
    document.querySelector("#nft-owner").textContent = owner;
    document.querySelector("#nft-name").textContent = name;

    document.querySelector("#nft-src").setAttribute("src", src);
}

async function showWrapped() {
    document.querySelector("#tx-status").textContent = "Wrapped, mint on target chain if it wasn't minted";
    document.querySelector("#nft-status").textContent = "Wrapped Bridged Token";

    document.querySelector(".source-btns").setAttribute("style", "display: none;");
    document.querySelector('.target-btns').removeAttribute("style");

    let btnBlockConfirm = document.querySelector("#btn-block-confirm");
    let btnChangeNetwork = document.querySelector("#btn-change-network");
    let btnMint = document.querySelector("#btn-mint");

    // Show only confirmation waiting button
    btnBlockConfirm.setAttribute("style", "display: none;");
    btnChangeNetwork.removeAttribute("style");
    btnMint.setAttribute("style", "display: none;");
}

async function showUnwrapped() {
    document.querySelector("#tx-status").textContent = "First mint the wrapped token";
    document.querySelector("#nft-status").textContent = "Unbridged Token";

    document.querySelector(".source-btns").removeAttribute("style");
    document.querySelector('.target-btns').removeAttribute("style");

    let approved = await source.methods.isApprovedForAll(selectedAccount, wrapped._address).call();
    if (approved) {
        document.querySelector("#btn-approve").setAttribute("style", "display: none;");
        document.querySelector("#btn-wrap").removeAttribute("style");
    } else {
        document.querySelector("#btn-approve").removeAttribute("style");
        document.querySelector("#btn-wrap").setAttribute("style", "display: none;");
    }
}

function waitBlockConfirmation(startBlock) {
    let btnBlockConfirm = document.querySelector("#btn-block-confirm");
    let btnChangeNetwork = document.querySelector("#btn-change-network");
    let btnMint = document.querySelector("#btn-mint");

    // Show only confirmation waiting button
    btnBlockConfirm.removeAttribute("style");
    btnChangeNetwork.setAttribute("style", "display: none;");
    btnMint.setAttribute("style", "display: none;");

    let confirm = document.querySelector("#confirm-status");
    confirm.textContent = `0/${CONFIRMATION}`;

    let interval = setInterval(async () => {
        let latestBlock = await web3.eth.getBlockNumber();
        let passed = latestBlock - startBlock;

        confirm.textContent = `${passed}/${CONFIRMATION}`;

        if (passed >= CONFIRMATION) {
            clearInterval(interval);

            btnBlockConfirm.setAttribute("style", "display: none;");
            btnChangeNetwork.removeAttribute("style");

            document.querySelector("#tx-status").textContent = "Switch to BSC Testnet on your wallet...";
        }
    }, 2000);
}
  
/**
 * On minting wrapped token on target blockchain.
 */
 async function onMint() {
    if (!web3) {
        printErrorMessage("No web3 library. Please check your internet connection");
        return;
    }

    if (!web3.eth) {
        printErrorMessage("Please connect your wallet!");
        return;
    }

    if (!window.bridged) {
        printErrorMessage("NFT contracts were not setup. Please enable bridged nft instance");
        return;
    }

    
    if (parseInt(tokenId) == NaN) {
        printErrorMessage(`Token ID not found. Please fetch token info`);
        return;
    }

    if (window.wrappedOwner == undefined || window.wrappedOwner.length == 0 ||
        window.sourceOwner == undefined || window.sourceOwner.length == 0 ||
        selectedAccount.toLowerCase() != window.wrappedOwner.toLowerCase()) {
            printErrorMessage(`Invalid wrapped or source owner. Or they don't match`);
            return;
        }

    /// First look at wrapped token.
    /// Then look at source token.
    /// if wrapped token exists, then show wrapped token data.
    /// Otherwise show unwrapped token data.

    // Getting owner information.
    window.bridgedOwner = "";

    try {
        bridgedOwner = await bridged.methods.ownerOf(tokenId).call();
    } catch (error) {
        console.warn(`Token ${tokenId} wasn't bridged yet. You can call "mint" function.`);
    }

    if (bridgedOwner.length > 0) {
        printErrorMessage(`Token ${tokenId} already bridged on Target blockchain!`);
        showWrapped();
        return;
    }

    window.bridged.methods.mint(window.tokenId)
        .send({from: window.selectedAccount})
        .on('transactionHash', function(hash) {
          document.querySelector("#toast-title").textContent = "Wait Bridging...";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://testnet.bscscan.com/tx/${hash}" target="_blank">explorer</a>
          `;

          toast.show();

          document.querySelector("#btn-mint").setAttribute("disabled", "");
        })
        .on('receipt', async function(receipt){
          toast.hide();

          document.querySelector("#toast-title").textContent = "Token bridged successfully!";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://testnet.bscscan.com/tx/${receipt.transactionHash}" target="_blank">explorer</a><br>
          `;

          toast.show();

          showWrapped();
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          printErrorMessage(error.message);
          console.error(error.message);

          document.querySelector("#btn-mint").removeAttribute("disabled", "");
        });
}



/**
 * On fetching Token info.
 */
async function onFetch() {
    if (!web3) {
        printErrorMessage("No web3 library. Please check your internet connection");
        return;
    }

    if (!web3.eth) {
        printErrorMessage("Please connect your wallet!");
        return;
    }

    if (!window.source || !window.wrapped) {
        printErrorMessage("NFT contracts were not setup");
        return;
    }

    
    // Token ID
    let token = document.querySelector("#input-fetch").value;
    window.tokenId = parseInt(token);
    if (isNaN(tokenId) || tokenId == 0) {
        printErrorMessage(`Invalid Token ID: ${token}. Use only positive number`);
        return;
    }

    /// First look at wrapped token.
    /// Then look at source token.
    /// if wrapped token exists, then show wrapped token data.
    /// Otherwise show unwrapped token data.

    // Getting owner information.
    window.wrappedOwner = "";
    window.sourceOwner = "";
    
    try {
        wrappedOwner = await wrapped.methods.ownerOf(tokenId).call();
    } catch (error) {
        console.warn(`Token ${tokenId} wasn't bridged yet`);
    }

    try {
        sourceOwner = await source.methods.ownerOf(tokenId).call();
    } catch (error) {
        printErrorMessage(`Token ${tokenId}: Owner query for nonexistent token`);
        return;
    }

    // Token meta data such as name, image
    let metaURL = "";
    try {
        metaURL = await source.methods.tokenURI(tokenId).call();
    } catch (error) {
        printErrorMessage(`Failed to get token URI for Token ${tokenId}`);
        return;
    }

    let stream;
    try {
        stream = await fetch(metaURL);
    } catch (error) {
        console.error(error);
        printErrorMessage(`Failed to fetch metadata for Token ${tokenId}. Used URL: ${metaURL}`);
        return;
    }

    let json;
    try {
        json = await stream.json();
    } catch (error) {
        console.error(error);
        printErrorMessage(`Meta data is not in JSON format. Please fix it.`);
        return;
    }

    let imageURL = json.image;
    let name = json.name;


    if (wrappedOwner.length > 0) {
        await showMeta(tokenId, wrappedOwner, imageURL, name);
        showWrapped();
    } else {
        await showMeta(tokenId, sourceOwner, imageURL, name);
        showUnwrapped();
    }
}


  
/**
 * When calling on approve
 * We assume that web3, web3.eth, source contract interfaces are loaded
 */
 async function onApprove() {
    window.source.methods.setApprovalForAll(window.wrapped._address, true)
        .send({from: window.selectedAccount})
        .on('transactionHash', function(hash) {
          document.querySelector("#toast-title").textContent = "Wait Approving...";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://rinkeby.etherscan.io/tx/${hash}" target="_blank">explorer</a>
          `;

          toast.show();

          document.querySelector("#btn-approve").setAttribute("disabled", "");
        })
        .on('receipt', async function(receipt){
          toast.hide();

          document.querySelector("#toast-title").textContent = "Token wrapping was approved!";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://rinkeby.etherscan.io/tx/${receipt.transactionHash}" target="_blank">explorer</a><br>
          `;

          toast.show();

          document.querySelector("#btn-approve").removeAttribute("disabled");
          document.querySelector("#btn-approve").setAttribute("style", "display: none;");
          document.querySelector("#btn-wrap").removeAttribute("style");
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          printErrorMessage(error.message);
          console.error(error.message);

          document.querySelector("#btn-approve").removeAttribute("disabled", "");
        });
}

/**
 * When wrapping the token
 */
async function onWrap() {
    // Check that owner of token is the same as selected account.
    if (sourceOwner.toLowerCase() != selectedAccount.toLowerCase()) {
        printErrorMessage(`Connected account ${selectedAccount} is not the owner. Owner is ${sourceOwner}`);
        return;
    }

    // Wrap token.
    window.wrapped.methods.mint(tokenId)
        .send({from: window.selectedAccount})
        .on('transactionHash', function(hash) {
          document.querySelector("#toast-title").textContent = "Wait wrapped token minting...";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://rinkeby.etherscan.io/tx/${hash}" target="_blank">explorer</a>
          `;

          toast.show();

          document.querySelector("#btn-wrap").setAttribute("disabled", "");
        })
        .on('receipt', async function(receipt){
          toast.hide();

          document.querySelector("#toast-title").textContent = "Token wrapped!";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://rinkeby.etherscan.io/tx/${receipt.transactionHash}" target="_blank">explorer</a><br>
          `;

          toast.show();

          document.querySelector("#btn-wrap").removeAttribute("disabled");
          document.querySelector("#btn-wrap").setAttribute("style", "display: none;");

          document.querySelector("#tx-status").textContent = "Wait for block confirmation! Please don't refresh the page";

          try {
            wrappedOwner = await wrapped.methods.ownerOf(tokenId).call();
          } catch (error) {
            console.warn(`Token ${tokenId} wasn't bridged yet`);
          }

          // Show block confirmation
          waitBlockConfirmation(receipt.blockNumber);
        })
        .on('error', function(error, _receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          printErrorMessage(error.message);
          console.error(error.message);

          document.querySelector("#btn-wrap").removeAttribute("disabled", "");
        });
}
