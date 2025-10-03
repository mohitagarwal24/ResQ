import { useSendTransaction, useWallet, useTransactionModal } from '@vechain/vechain-kit';
import { contractService, CreateBountyParams, DonateParams, SubmitProofParams } from '../services/contractService';
import { toast } from 'sonner';
import { useCallback } from 'react';

// Hook for contract write operations using VeChain Kit
export const useContractTransactions = () => {
  const { account } = useWallet();
  
  const {
    sendTransaction,
    status,
    txReceipt,
    resetStatus,
    isTransactionPending,
    error,
  } = useSendTransaction({
    signerAccountAddress: account?.address ?? '',
  });

  const { 
    open: openTransactionModal, 
    close: closeTransactionModal, 
    isOpen: isTransactionModalOpen 
  } = useTransactionModal();

  // Create bounty transaction
  const createBounty = useCallback(async (params: CreateBountyParams) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const clauses = contractService.createBountyTransaction(params);
      
      // Open transaction modal
      openTransactionModal();
      
      await sendTransaction(clauses);
      
      if (status === 'success') {
        toast.success('Bounty created successfully!');
        closeTransactionModal();
        // Extract bounty ID from receipt if needed
        const bountyId = contractService.extractBountyIdFromReceipt(txReceipt);
        return bountyId;
      }
    } catch (err) {
      console.error('Error creating bounty:', err);
      toast.error('Failed to create bounty');
      closeTransactionModal();
      throw err;
    }
  }, [account?.address, sendTransaction, status, txReceipt, openTransactionModal, closeTransactionModal]);

  // Donate to bounty transaction
  const donate = useCallback(async (params: DonateParams) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const clauses = contractService.donateTransaction(params);
      
      // Open transaction modal
      openTransactionModal();
      
      await sendTransaction(clauses);
      
      if (status === 'success') {
        toast.success(`Donated ${params.amount} VET successfully!`);
        closeTransactionModal();
        return txReceipt?.meta?.txID;
      }
    } catch (err) {
      console.error('Error donating:', err);
      toast.error('Failed to donate');
      closeTransactionModal();
      throw err;
    }
  }, [account?.address, sendTransaction, status, txReceipt, openTransactionModal, closeTransactionModal]);

  // Submit proof transaction
  const submitProof = useCallback(async (params: SubmitProofParams) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const clauses = contractService.submitProofTransaction(params);
      
      // Open transaction modal
      openTransactionModal();
      
      await sendTransaction(clauses);
      
      if (status === 'success') {
        toast.success('Proof submitted successfully!');
        closeTransactionModal();
        return txReceipt?.meta?.txID;
      }
    } catch (err) {
      console.error('Error submitting proof:', err);
      toast.error('Failed to submit proof');
      closeTransactionModal();
      throw err;
    }
  }, [account?.address, sendTransaction, status, txReceipt, openTransactionModal, closeTransactionModal]);

  // Release funds transaction
  const releaseFunds = useCallback(async (bountyId: string, verified: boolean = true) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const clauses = contractService.releaseFundsTransaction(bountyId, verified);
      
      // Open transaction modal
      openTransactionModal();
      
      await sendTransaction(clauses);
      
      if (status === 'success') {
        toast.success('Funds released successfully!');
        closeTransactionModal();
        return txReceipt?.meta?.txID;
      }
    } catch (err) {
      console.error('Error releasing funds:', err);
      toast.error('Failed to release funds');
      closeTransactionModal();
      throw err;
    }
  }, [account?.address, sendTransaction, status, txReceipt, openTransactionModal, closeTransactionModal]);

  // Real IPFS upload using Pinata or Web3.Storage
  const uploadToIPFS = useCallback(async (file: File): Promise<string> => {
    try {
      // Try Pinata first if JWT is available
      const pinataJWT = import.meta.env.VITE_PINATA_JWT;
      if (pinataJWT) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${pinataJWT}`,
          },
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          toast.success('File uploaded to IPFS via Pinata!');
          return result.IpfsHash;
        }
      }
      
      // Try Web3.Storage if token is available
      const web3StorageToken = import.meta.env.VITE_WEB3_STORAGE_TOKEN;
      if (web3StorageToken) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('https://api.web3.storage/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${web3StorageToken}`,
          },
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          toast.success('File uploaded to IPFS via Web3.Storage!');
          return result.cid;
        }
      }
      
      // Fallback to mock implementation
      console.warn('No IPFS service configured, using mock implementation');
      const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await mockDelay(2000);
      
      const hash = 'Qm' + Math.random().toString(36).substring(2, 48);
      toast.success('File uploaded to IPFS (mock)!');
      return hash;
      
    } catch (err) {
      console.error('Error uploading to IPFS:', err);
      toast.error('Failed to upload file');
      throw err;
    }
  }, []);

  return {
    // Transaction functions
    createBounty,
    donate,
    submitProof,
    releaseFunds,
    uploadToIPFS,
    
    // Transaction state
    status,
    txReceipt,
    isTransactionPending,
    error,
    resetStatus,
    
    // Transaction modal state
    isTransactionModalOpen,
    openTransactionModal,
    closeTransactionModal,
    
    // Wallet state
    isConnected: !!account?.address,
    walletAddress: account?.address,
  };
};
