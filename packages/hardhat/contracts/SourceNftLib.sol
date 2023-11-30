// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC721Metadata } from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

library SourceNftLib {
    function originalName(address source) public view returns (string memory) {
        // Over-write the name
        try IERC721Metadata(source).name() returns (string memory sourceName) {
            return sourceName;
        } catch Error(string memory reason) {
            revert(reason);
        } catch {
            revert();
        }
    }

    function originalSymbol(address source) public view returns (string memory) {
        // Over-write the name
        try IERC721Metadata(source).symbol() returns (string memory sourceSymbol) {
            return sourceSymbol;
        } catch Error(string memory reason) {
            revert(reason);
        } catch {
            revert();
        }
    }
}