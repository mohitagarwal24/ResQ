import { toast } from 'sonner';

export interface IPFSUploadResult {
  hash: string;
  url: string;
}

class IPFSService {
  private pinataJWT: string | undefined;

  constructor() {
    this.pinataJWT = import.meta.env.VITE_PINATA_JWT;
  }

  async uploadFile(file: File): Promise<IPFSUploadResult> {
    try {
      // Try Pinata first if JWT is available
      if (this.pinataJWT) {
        return await this.uploadToPinata(file);
      }
      
      // Fallback to mock implementation
      return await this.mockUpload(file);
    } catch (error) {
      console.error('IPFS upload failed:', error);
      toast.error('Failed to upload file to IPFS');
      throw error;
    }
  }

  async uploadJSON(data: any): Promise<IPFSUploadResult> {
    try {
      // Try Pinata first if JWT is available
      if (this.pinataJWT) {
        return await this.uploadJSONToPinata(data);
      }
      
      // Fallback to mock implementation
      return await this.mockUploadJSON(data);
    } catch (error) {
      console.error('IPFS JSON upload failed:', error);
      toast.error('Failed to upload JSON to IPFS');
      throw error;
    }
  }

  private async uploadToPinata(file: File): Promise<IPFSUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedBy: 'ResQ-DAO',
        timestamp: new Date().toISOString(),
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.pinataJWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata upload failed: ${errorText}`);
    }

    const result = await response.json();
    toast.success('File uploaded to IPFS via Pinata!');
    
    return {
      hash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    };
  }

  private async uploadJSONToPinata(data: any): Promise<IPFSUploadResult> {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.pinataJWT}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: 'ResQ-DAO-Data',
          keyvalues: {
            uploadedBy: 'ResQ-DAO',
            timestamp: new Date().toISOString(),
          }
        },
        pinataOptions: {
          cidVersion: 0,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata JSON upload failed: ${errorText}`);
    }

    const result = await response.json();
    toast.success('JSON uploaded to IPFS via Pinata!');
    
    return {
      hash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    };
  }

  private async mockUpload(_file: File): Promise<IPFSUploadResult> {
    console.warn('No IPFS service configured, using mock implementation');
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const hash = 'Qm' + Math.random().toString(36).substring(2, 48);
    toast.success('File uploaded to IPFS (mock)!');
    
    return {
      hash,
      url: `https://ipfs.io/ipfs/${hash}`
    };
  }

  private async mockUploadJSON(_data: any): Promise<IPFSUploadResult> {
    console.warn('No IPFS service configured, using mock JSON upload');
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const hash = 'Qm' + Math.random().toString(36).substring(2, 48);
    toast.success('JSON uploaded to IPFS (mock)!');
    
    return {
      hash,
      url: `https://ipfs.io/ipfs/${hash}`
    };
  }

  async fetchFromIPFS(hash: string): Promise<any> {
    try {
      // Try Pinata gateway first
      const pinataUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
      const response = await fetch(pinataUrl);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.blob();
        }
      }
      
      // Fallback to public IPFS gateway
      const publicUrl = `https://ipfs.io/ipfs/${hash}`;
      const fallbackResponse = await fetch(publicUrl);
      
      if (fallbackResponse.ok) {
        const contentType = fallbackResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await fallbackResponse.json();
        } else {
          return await fallbackResponse.blob();
        }
      }
      
      throw new Error('Failed to fetch from IPFS');
    } catch (error) {
      console.error('IPFS fetch failed:', error);
      throw error;
    }
  }
}

export const ipfsService = new IPFSService();
