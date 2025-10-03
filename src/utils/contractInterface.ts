import { CONTRACT_CONFIG } from '../config/contract';

// Get ABI function by name
const getABIFunction = (name: string) => {
  return CONTRACT_CONFIG.abi.find((item: any) => item.name === name && item.type === 'function');
};

// For VeChain Kit v2, we'll use the transaction clauses directly
// The encoding will be handled by VeChain Kit when sending transactions
export const getContractFunction = {
  createBounty: () => getABIFunction('createBounty'),
  donate: () => getABIFunction('donate'),
  submitProof: () => getABIFunction('submitProof'),
  releaseFunds: () => getABIFunction('releaseFunds'),
  getAllBounties: () => getABIFunction('getAllBounties'),
  getBounty: () => getABIFunction('getBounty'),
};
