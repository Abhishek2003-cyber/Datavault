// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockCondition {
    fallback(bytes calldata) external payable returns (bytes memory) {
        return abi.encode(true);
    }
}
