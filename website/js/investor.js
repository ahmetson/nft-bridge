"use strict";

window.claimable = function(pool, grant) {
    let startTime = parseInt(pool.startTime);
    if (startTime == 0) {
        return 0;
    }

    let endTime = parseInt(pool.endTime);
    let currentTime = parseInt(new Date().getTime() / 1000);

    let cap = currentTime > endTime ? endTime : currentTime;
    let perSecond = web3.utils.fromWei(grant.perSecond, "ether");
    
    if (perSecond <= 0) {
        return 0;
    }

    let difference = parseInt(cap) - startTime;

    let claimed = web3.utils.fromWei(grant.totalClaimed, "ether");

    return (difference * perSecond) - claimed;
};

// Determine the pool that user should use.
let choosePool = async function(investor, privateSale, chainGuardian, trustPad) {
    let grant = await privateSale.methods.tokenGrants(investor).call();
    let amount = parseFloat(web3.utils.fromWei(grant.amount)) + parseFloat(web3.utils.fromWei(grant.totalClaimed));

    if (amount) {
        let blacklist = await privateSale.methods.blacklist(investor).call().catch(e => {
            throw 'Failed to check in Blacklist in Private Sale pool';
        });
        if (blacklist != "0x0000000000000000000000000000000000000000") {
            throw `Address ${investor} was blacklisted and replaced by ${blacklist}. Use the new address please.`;
        }

        window.grant = grant;
        window.vesting = privateSale;
        return "PrivateSale";
    }

    grant = await chainGuardian.methods.tokenGrants(investor).call();
    amount = parseFloat(web3.utils.fromWei(grant.amount)) + parseFloat(web3.utils.fromWei(grant.totalClaimed));
    
    if (amount) {
        let blacklist = await chainGuardian.methods.blacklist(investor).call().catch(e => {
            throw 'Failed to check in Blacklist in Chain Guardian pool';
        });
        if (blacklist != "0x0000000000000000000000000000000000000000") {
            throw `Address ${investor} was blacklisted and replaced by ${blacklist}. Use the new address please.`;
        }

        window.grant = grant;
        window.vesting = chainGuardian;
        return "ChainGuardian";
    }

    grant = await trustPad.methods.tokenGrants(investor).call();
    amount = parseFloat(web3.utils.fromWei(grant.amount)) + parseFloat(web3.utils.fromWei(grant.totalClaimed));
    
    if (amount) {
        let blacklist = await trustPad.methods.blacklist(investor).call().catch(e => {
            throw 'Failed to check in Blacklist in Trust Pad pool';
        });
        if (blacklist != "0x0000000000000000000000000000000000000000") {
            throw `Address ${investor} was blacklisted and replaced by ${blacklist}. Use the new address please.`;
        }

        window.vesting = trustPad;
        window.grant = grant;
        return "TrustPad";
    }

    throw `Could not find ${investor} in any pool!`;
};

window.showPoolInfo = async function() {
    try {
        window.privateSale      = await getContract("PrivateSale");
        window.chainGuardian    = await getContract("ChainGuardian");
        window.trustPad         = await getContract("TrustPad");
    } catch (e) {
        printErrorMessage(e);
        return;
    }

    let selectedPool;
    try {
        selectedPool = await choosePool(window.selectedAccount, window.privateSale, window.chainGuardian, window.trustPad);
    } catch (e) {
        printErrorMessage(e);
        return;
    }

    window.pool = await window.vesting.methods.pool().call();

    window.startTime = new Date(window.pool.startTime * 1000);
    window.endTime = new Date(window.pool.endTime * 1000);

    document.querySelector("#pool-info-name").textContent = selectedPool;
    document.querySelector("#pool-info-contract").textContent = window.vesting._address;
    
    document.querySelector("#pool-info-start-time").textContent = window.startTime;
    document.querySelector("#pool-info-end-time").textContent = window.endTime;
    update();
}

function changeProgresses(pool, grant) {
    let claimedProgressBar = document.querySelector("#progress-claimed");
    let claimableProgressBar = document.querySelector("#progress-claimable");
    let remainingProgressBar = document.querySelector("#progress-remaining");

    let locked = parseFloat(web3.utils.fromWei(window.grant.amount, "ether"));
    let percent = locked / 100;

    // claimed
    let claimed = parseFloat(web3.utils.fromWei(window.grant.totalClaimed, "ether"));
    let progressClaimed = claimed / percent;
    changeProgress(claimedProgressBar, progressClaimed, `Already Claimed XP:<br>${claimed.toFixed(FIXED_DIGITS)}`);

    // claimable
    if (window.claimables == undefined) {
        window.claimables = claimable(pool, grant);
    }
    let progressClaimable = window.claimables / percent;
    changeProgress(claimableProgressBar, progressClaimable, `Available Claimable XP:<br>${window.claimables.toFixed(FIXED_DIGITS)}`);

    // remaining = lock - (claimed + claimable)
    let remaining = locked - (claimed + window.claimables);
    let progressRemaining = remaining / percent;
    changeProgress(remainingProgressBar, progressRemaining, `Locked XP:<br>${remaining.toFixed(FIXED_DIGITS)}`);
}

function changeProgress(progressBar, progress, label) {
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
    progressBar.innerHTML = label;
}

function update() {
    if (window.interTimeout == undefined) {
        clearInterval(window.interTimeout);
    }

    window.interTimeout = setInterval(() => {
        if (window.pool && window.grant) {
            let now = parseInt(new Date().getTime() / 1000);

            document.querySelector("#pool-info-remained-time").textContent = secondsToDhms(parseInt(window.pool.endTime) - now);

            let locked = parseFloat(web3.utils.fromWei(window.grant.amount, "ether"));
            let claimed = parseFloat(web3.utils.fromWei(window.grant.totalClaimed, "ether"));
            window.claimables = claimable(window.pool, window.grant);
            let accessible = window.claimables + parseFloat(claimed);
        
            document.querySelector("#pool-info-accessible").textContent = `${accessible.toFixed(FIXED_DIGITS)} XP`;
            
            document.querySelector("#label-claimable").textContent = window.claimables.toFixed(FIXED_DIGITS);
            document.querySelector("#label-locked").textContent = (locked - claimed - window.claimables).toFixed(FIXED_DIGITS);
        
            changeProgresses(window.pool, window.grant);
        }
    }, 1000);
}

function secondsToDhms(seconds) {
    if (seconds < 0) {
        return "Timeout";
    }
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
    document.querySelector("#btn-claim").addEventListener("click", onClaim);

    let toastEl = document.querySelector("#toast");
    window.toast = new bootstrap.Toast(toastEl);
});

/**
 * Calculate total amount of tokens that manager should add into contract
 */
function calculateTotalPool(data) {
    let totalPool = 0;

    for (var i = 0; i < data.length; i++ ) {
        let row = data[i];

        let amount = parseFloat(row.amount);

        if (!isNaN(amount)) {
            totalPool += amount;
        }
    }

    return totalPool;
}

function printTotalPool() {
    window.totalPool = calculateTotalPool(window.grid.getData());

    document.querySelector("#total-pool-amount").textContent = totalPool;
}

/**
 * Calculate total amount of tokens that manager should add into contract
 */
function calculateTotalPool(data) {
        let totalPool = 0;

        for (var i = 0; i < data.length; i++ ) {
          let row = data[i];

          let amount = parseFloat(row.amount);

          if (!isNaN(amount)) {
            totalPool += amount;
          }
        }

        return totalPool;
}

function printTotalPool() {
    window.totalPool = calculateTotalPool(window.grid.getData());

    document.querySelector("#total-pool-amount").textContent = totalPool;
}
 
/**
       * On add wallet button pressed.
       */
async function onClaim() {
        if (!web3) {
          printErrorMessage("No web3 library. Please check your internet connection");
          return;
        }

        if (!web3.eth) {
          printErrorMessage("Please connect your wallet!");
          return;
        }

        if (!window.vesting) {
          printErrorMessage("Please select a pool");
          return;
        }

        if (window.claimables === undefined) {
            printErrorMessage("Please select the pool");
            return;
        }

        if (window.claimables <= 0) {
            printErrorMessage("No claimable tokens. You either claimed all. Or you need to wait a bit more. Or invalid pool");
            return;
        }

        window.vesting.methods.claimVestedTokens(window.selectedAccount)
        .send({from: window.selectedAccount})
        .on('transactionHash', function(hash) {
          document.querySelector("#toast-title").textContent = "Wait Claiming...";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://rinkeby.etherscan.io/tx/${hash}" target="_blank">explorer</a>
          `;

          toast.show();

          document.querySelector("#btn-claim").setAttribute("disabled", "");
        })
        .on('receipt', async function(receipt){
          toast.hide();

          document.querySelector("#toast-title").textContent = "Tokens were claimed!";
          document.querySelector(".toast-body").innerHTML = `See TX on
            <a href="https://rinkeby.etherscan.io/tx/${receipt.transactionHash}" target="_blank">explorer</a><br>
          `;

          toast.show();

          document.querySelector("#btn-claim").removeAttribute("disabled");

          window.pool = await window.vesting.methods.pool().call();
          window.grant = await window.vesting.methods.tokenGrants(window.selectedAccount).call();
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          printErrorMessage(error.message);
          console.error(error.message);

          document.querySelector("#btn-claim").removeAttribute("disabled", "");
        });
}
