// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OwnerWriteCondition {
    function checkWriteCondition(
        address caller,
        bytes calldata conditionData,
        bytes calldata
    ) external pure returns (bool) {
        address owner = abi.decode(conditionData, (address));
        require(caller == owner, "Caller is not the vault owner");
        return true;
    }

    fallback(bytes calldata) external payable returns (bytes memory) {
        return abi.encode(true);
    }
}
