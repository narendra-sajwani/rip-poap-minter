import { CONTRACT_ERRORS } from './constants';

export const parseContractError = (error) => {
  const errorString = error?.message || error?.toString() || '';
  
  // Handle custom errors from your contract
  if (errorString.includes('InvalidEventId')) {
    return CONTRACT_ERRORS.InvalidEventId;
  }
  if (errorString.includes('EventNotActive')) {
    return CONTRACT_ERRORS.EventNotActive;
  }
  if (errorString.includes('AlreadyMinted')) {
    return CONTRACT_ERRORS.AlreadyMinted;
  }
  if (errorString.includes('TokenTransferFailed')) {
    return CONTRACT_ERRORS.TokenTransferFailed;
  }
  if (errorString.includes('TokenDoesNotExist')) {
    return CONTRACT_ERRORS.TokenDoesNotExist;
  }
  
  // Handle common MetaMask/Web3 errors
  if (errorString.includes('user rejected')) {
    return 'Transaction was cancelled by user';
  }
  if (errorString.includes('insufficient funds')) {
    return 'Insufficient funds for gas fee';
  }
  if (errorString.includes('execution reverted')) {
    return 'Transaction failed - please check your inputs';
  }
  
  // Default error message
  return 'Transaction failed. Please try again.';
};

export const isUserRejectedError = (error) => {
  const errorString = error?.message || error?.toString() || '';
  return errorString.includes('user rejected') || errorString.includes('User denied');
};
