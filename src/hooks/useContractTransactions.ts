import { useCallback } from 'react';
import { useWallet, useSendTransaction, useTransactionModal } from '@vechain/vechain-kit';
import { contractService } from '../services/contractService';
import { ipfsService } from '../services/ipfsService';
import { toast } from 'sonner';

export interface CreateBountyParams {
  title: string;
  description: string;
  goal: number;
  location: string;
  organizerName: string;
  imageUrl?: string;
}

export interface DonateParams {
  bountyId: string;
  amount: number;
}

export interface SubmitProofParams {
  bountyId: string;
  proofFile: File;
}

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
    onTxConfirmed: () => {
      // Only emit data refresh event, let components handle their own success messages
      console.log('Transaction confirmed, refreshing contract data...');
      window.dispatchEvent(new CustomEvent('contractDataChanged'));
    },
    onTxFailedOrCancelled: () => {
      console.log('Transaction failed or was cancelled');
      toast.error('Transaction failed or was cancelled');
    },
  });
  
  const {
    open: openTransactionModal,
    close: closeTransactionModal,
    isOpen: isTransactionModalOpen,
  } = useTransactionModal();

  // IPFS Upload Service
  const uploadToIPFS = useCallback(async (file: File): Promise<string> => {
    try {
      const result = await ipfsService.uploadFile(file);
      return result.hash;
    } catch (err) {
      console.error('Error uploading to IPFS:', err);
      toast.error('Failed to upload file');
      throw err;
    }
  }, []);

  const createBounty = useCallback(async (params: CreateBountyParams) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Upload image to IPFS if provided
      let imageUrl = params.imageUrl || '';
      if (params.imageUrl && params.imageUrl.startsWith('blob:')) {
        const response = await fetch(params.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: blob.type });
        imageUrl = await uploadToIPFS(file);
      }

      // Get transaction clauses from contract service
      const clauses = contractService.createBountyTransaction({
        ...params,
        imageUrl
      });
      
      // Open transaction modal and send transaction
      openTransactionModal();
      await sendTransaction(clauses);
      
      return true;
    } catch (error) {
      console.error('Failed to create bounty:', error);
      toast.error('Failed to create bounty');
      throw error;
    }
  }, [account?.address, sendTransaction, openTransactionModal, uploadToIPFS]);

  const donate = useCallback(async (params: DonateParams) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Get transaction clauses from contract service
      const clauses = contractService.donateTransaction(params);
      
      // Open transaction modal and send transaction
      openTransactionModal();
      await sendTransaction(clauses);
      
      return true;
    } catch (error) {
      console.error('Failed to donate:', error);
      toast.error('Failed to process donation');
      throw error;
    }
  }, [account?.address, sendTransaction, openTransactionModal]);

  const submitProof = useCallback(async (params: SubmitProofParams) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Upload proof to IPFS
      const ipfsHash = await uploadToIPFS(params.proofFile);
      
      // Get transaction clauses from contract service
      const clauses = contractService.submitProofTransaction({
        bountyId: params.bountyId,
        ipfsHash
      });
      
      // Open transaction modal and send transaction
      openTransactionModal();
      await sendTransaction(clauses);
      
      return true;
    } catch (error) {
      console.error('Failed to submit proof:', error);
      toast.error('Failed to submit proof');
      throw error;
    }
  }, [account?.address, sendTransaction, openTransactionModal, uploadToIPFS]);

  const releaseFunds = useCallback(async (bountyId: string, verified: boolean = true) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Get transaction clauses from contract service
      const clauses = contractService.releaseFundsTransaction(bountyId, verified);
      
      // Open transaction modal and send transaction
      openTransactionModal();
      await sendTransaction(clauses);
      
      return true;
    } catch (error) {
      console.error('Failed to release funds:', error);
      toast.error('Failed to release funds');
      throw error;
    }
  }, [account?.address, sendTransaction, openTransactionModal]);

  // Retry transaction function
  const handleTryAgain = useCallback(async (clauses: any[]) => {
    resetStatus();
    await sendTransaction(clauses);
  }, [sendTransaction, resetStatus]);

  return {
    createBounty,
    donate,
    submitProof,
    releaseFunds,
    uploadToIPFS,
    isTransactionPending,
    isTransactionModalOpen,
    openTransactionModal,
    closeTransactionModal,
    status,
    txReceipt,
    error,
    resetStatus,
    handleTryAgain,
  };
};
