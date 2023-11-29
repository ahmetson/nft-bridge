// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
    contract SampleNft is LinkedNft {
        constructor() ERC721("", "") LinkedNft("factory_in_this_chain", "factory_on_other_chain", chain_id) {}

        // if you are rewriting the mint, transfer or approval
        // then call the modifier linkMint, linkTransfer, linkApproval

        // The supported chains are
        // Support("chain_id", "factory")

        // Whenever a mint is called, the function calls the factory on other chains.
        //  then it will mint in this blockchain.

        // Whenever a transfer or approve goes, the function calls the factory.
        // The smartcontract checks is there a minted contract.
        // If not, then asks the factory to create it.
        // If created, then calls the function
    }
*/

/**
 * @notice WrappedNft is an NFT on the Source Blockchain, which locks the original NFT, and disables transferring it.
 * When an NFT is wrapped, the Listening oracles would mint the copy on target Blockchain.
 *
 * todo Unwrapping Wrapped NFTs is not possible in this version.
 */
contract LinkedNft {
    mapping(uint256 => address) public linkedNfts;
    mapping(uint256 => address) public factories;
    uint256[] public chains;

    event SupportChain(uint256 _chainId, address _factory);

    constructor(address _factory, uint256 _chainIdA, address _aFactory) {
        supportChain(block.chainid(), _factory);
        supportChain(_chainIdA, _aFactory);
    }

    // Adding a support to a new chain
    function supportChain(uint256 _chainId, address _factory) public {
        require(_factory != address(0), "no_factory");
        require(factories[_chainId] == address(0), "factory set");

        factories[_chainId] = _factory;
        chains.push(_chainId);

        emit SupportChain(_chainId, _factory);
    }

    modifier linkedTransfer() {
        // for every chain
        // require the linked nft.

        // for every chain
        // call transferBySource(from, tokenId, to) on target using CCIP;
        // upon successful launch, call transferSucceed().
        _;
    }

    // the function mint is available by the permission.
    // the permission is available in an access control.
    // a change in the access control also linked.

    // @dev call it from the extending contract
    function linkedMint(address to, uint256 tokenId, string memory uri) internal {
        if (chains.length <= 1) {
            onMintSuccess(to, tokenId, uri);
            return;
        }

        for (var i = 1; i < chains.length; i++) {
            if (linkedNfts[chains[i]] == address(0)) {
                // deploy contract using the factory
                // after the deploy, call the linked mint
                //
                // calling the Factory.DeployThenMint(chain, target chain)
                //
                // the factory will call DeployedNft on this chain.
                continue;
            }

            // call mintBy on the blockchain using CCIP
        }

        onMintSuccess(to, tokenId, uri);
    }



    // after call, gather the data call the onMintSuccess()
    function onMintSuccess(address _to, string memory _uri, uint256 tokenId) virtual internal {}

    function mintByFactory(uint256 id)
        public
        returns (uint256)
    {
    }

    /// @dev For development only.
    function withdraw(uint256 id) 
        public
        returns (uint256)
    {
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // DISALLOWED NFTs, to prevent to use in Marketplace's
    //
    ////////////////////////////////////////////////////////////////////////////

    function linkedApprove(address _to, uint256 _id) external {

    }

    function linkedSetApprovalForAll(address _operator, bool _approved) external {

    }

    function linkedSafeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        revert();
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function linkedSafeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public {
        revert();
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function linkedTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        revert();
    }

    /// @dev encrypt token data
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    )
        public
        returns (bytes4)
    {
        //only receive the _nft staff
        if (address(this) != operator) {
            //invalid from nft
            return 0;
        }

        //success
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}