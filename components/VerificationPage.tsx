import React, { useState, useEffect, useRef } from 'react';
import type { Certificate, VerificationLog, Page } from '../types';
import { SearchIcon, QrCodeIcon, UploadIcon } from './Icons';

// Since we are loading from CDN, we need to declare these on the window object for TypeScript
declare const Html5Qrcode: any;

interface VerificationPageProps {
  certificates: Certificate[];
  setPage: (page: Page) => void;
  setSelectedCertificate: (certificate: Certificate | null) => void;
  addLog: (log: Omit<VerificationLog, 'id' | 'timestamp' | 'ipAddress'>) => void;
  t: (key: string) => string;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ certificates, setPage, setSelectedCertificate, addLog, t }) => {
  const [certificateId, setCertificateId] = useState('');
  const [error, setError] = useState('');
  const [fileScanError, setFileScanError] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVerify = (idToVerify: string) => {
    if (!idToVerify.trim()) {
      setError(t('errorRequired'));
      return;
    }
    setError('');
    setFileScanError('');
    setVerificationError('');
    setIsLoading(true);

    setTimeout(() => {
      const foundCertificate = certificates.find(cert => cert.id.toLowerCase() === idToVerify.toLowerCase().trim());

      if (foundCertificate) {
        addLog({ certificateId: foundCertificate.id, status: 'SUCCESS' });
        setSelectedCertificate(foundCertificate);
        setPage(2 /* CertificateDetails */);
      } else {
        addLog({ certificateId: idToVerify.trim(), status: 'FAILED' });
        setSelectedCertificate(null);
        setVerificationError(t('invalidQrCodeError'));
      }
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(certificateId);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setError('');
    setFileScanError('');
    setVerificationError('');
    setIsLoading(true);

    const html5QrCode = new Html5Qrcode("qr-file-reader"); 
    try {
        const decodedText = await html5QrCode.scanFile(file, false);
        setCertificateId(decodedText);
        handleVerify(decodedText);
    } catch (err) {
        console.error('Error scanning file.', err);
        setFileScanError(t('qrScanError'));
        setIsLoading(false);
    } finally {
        if (e.target) {
            e.target.value = '';
        }
    }
  };
  
  useEffect(() => {
    if (isScanning) {
      // Element with id 'qr-reader' is now in the DOM.
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const qrCodeSuccessCallback = (decodedText: string) => {
        setIsScanning(false);
        setCertificateId(decodedText);
        handleVerify(decodedText);
      };
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, undefined)
        .catch((err: any) => {
          console.error("Unable to start scanning.", err);
          setIsScanning(false); // Stop scanning on error
        });
    }

    // Cleanup function
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err: any) => {
          console.error("Failed to stop scanner on cleanup", err);
        });
      }
    };
  }, [isScanning]);


  return (
    <div className="flex-grow flex items-center justify-center p-4">
      {/* A hidden element for the file scanner to attach to, preventing errors */}
      <div id="qr-file-reader" style={{ display: 'none' }}></div>
      <div className="w-full max-w-lg">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">{t('verifyTitle')}</h2>
            <p className="text-gray-500 mt-2">{t('verifySubtitle')}</p>
          </div>

          {isScanning ? (
            <div className="mt-8 text-center">
              <div id="qr-reader" className="w-full rounded-lg overflow-hidden border-2 border-gray-300"></div>
              <p className="text-gray-600 mt-4">{t('scannerInstruction')}</p>
              <button
                onClick={() => setIsScanning(false)}
                className="w-full mt-4 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {t('stopScanning')}
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="relative">
                  <input
                    type="text"
                    value={certificateId}
                    onChange={(e) => {
                      setCertificateId(e.target.value);
                      setError('');
                      setFileScanError('');
                      setVerificationError('');
                    }}
                    placeholder={t('placeholder')}
                    className="w-full px-4 py-3 ps-4 pe-10 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300"
                    disabled={isLoading}
                  />
                  <SearchIcon className="absolute end-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                </div>
                
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {fileScanError && <p className="text-red-500 text-sm mt-2">{fileScanError}</p>}
                {verificationError && <p className="text-red-500 text-sm mt-2">{verificationError}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:bg-sky-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                >
                    {isLoading ? (
                    <>
                        <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('verifyingButton')}
                    </>
                    ) : (
                    t('verifyButton')
                    )}
                </button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-2 text-sm text-gray-500 uppercase">{t('or')}</span></div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setIsScanning(true)}
                    disabled={isLoading}
                    className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    <QrCodeIcon className="w-6 h-6" />
                    <span>{t('scanQrCode')}</span>
                </button>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    <UploadIcon className="w-6 h-6" />
                    <span>{t('uploadQrCode')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;