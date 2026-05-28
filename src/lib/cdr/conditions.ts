import { encodeAbiParameters, parseAbiParameters } from "viem";
import { CONTRACTS } from "../utils/constants";

export function encodeOwnerWriteCondition(ownerAddress: `0x${string}`) {
  return {
    writeConditionAddr: CONTRACTS.OWNER_WRITE_CONDITION,
    writeConditionData: encodeAbiParameters(
      parseAbiParameters("address"),
      [ownerAddress]
    )
  };
}

export function encodeLicenseReadCondition(ipId: `0x${string}`) {
  return {
    readConditionAddr: CONTRACTS.LICENSE_READ_CONDITION,
    readConditionData: encodeAbiParameters(
      parseAbiParameters("address, address"),
      [CONTRACTS.LICENSE_TOKEN, ipId]
    )
  };
}

export function encodeAccessAuxData(licenseTokenIds: bigint[]) {
  return encodeAbiParameters(
    parseAbiParameters("uint256[]"),
    [licenseTokenIds]
  );
}
