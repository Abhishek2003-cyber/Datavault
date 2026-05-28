// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILicenseToken {
    function hasIpLicense(address owner, address ipId) external view returns (bool);
}

contract LicenseReadCondition {
    function checkReadCondition(
        address caller,
        bytes calldata conditionData,
        bytes calldata
    ) external view returns (bool) {
        (address licenseTokenAddr, address ipId) = abi.decode(conditionData, (address, address));
        require(ILicenseToken(licenseTokenAddr).hasIpLicense(caller, ipId), "Caller does not have required IP License");
        return true;
    }

    fallback(bytes calldata) external payable returns (bytes memory) {
        return abi.encode(true);
    }
}
