import React, { useState } from 'react';
import type { Certificate, University, Page, Language } from '../types';
import { CheckCircleIcon, XCircleIcon, DownloadIcon } from './Icons';

// Since we are loading from CDN, we need to declare these on the window object for TypeScript
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

interface CertificateDetailsProps {
  certificate: Certificate | null;
  universities: University[];
  setPage: (page: Page) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  language: Language;
}

const CertificateDetails: React.FC<CertificateDetailsProps> = ({ certificate, universities, setPage, t, language }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const university = certificate ? universities.find(u => u.id === certificate.universityId) : null;

  const handleDownloadPdf = async () => {
    if (!certificate || !window.html2canvas || !window.jspdf) {
      console.error("PDF generation libraries not loaded.");
      return;
    }
    
    const input = document.getElementById('certificate-to-print');
    if (!input) {
      console.error("Certificate element not found.");
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await window.html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      let finalImgWidth = pdfWidth - 20; // with some margin
      let finalImgHeight = finalImgWidth / ratio;

      if (finalImgHeight > pdfHeight) {
        finalImgHeight = pdfHeight - 20;
        finalImgWidth = finalImgHeight * ratio;
      }
      
      const x = (pdfWidth - finalImgWidth) / 2;
      const y = 10;
      
      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
      pdf.save(`Certificate-${certificate.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderCertificate = () => {
    if (!certificate || !university) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto text-center border-t-8 border-red-500">
          <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">{t('failedTitle')}</h2>
          <p className="text-gray-600 mt-2 text-lg">{t('failedSubtitle')}</p>
        </div>
      );
    }

    return (
      <div id="certificate-to-print">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-auto overflow-hidden border-t-8 border-green-500">
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b-2 border-gray-100">
              <div>
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="w-10 h-10 me-3" />
                  <h2 className="text-3xl font-bold">{t('verifiedTitle')}</h2>
                </div>
                <p className="text-gray-500 mt-1">{t('verifiedSubtitle', { universityName: university.name })}</p>
              </div>
              <img src={certificate.qrCodeUrl} alt="Certificate QR Code" className="w-24 h-24 mt-4 md:mt-0" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-lg">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase">{t('studentName')}</span>
                <span className="font-medium text-gray-800">{certificate.studentName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase">{t('issuingUniversity')}</span>
                <span className="font-medium text-gray-800">{university.name}, {university.country}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase">{t('degree')}</span>
                <span className="font-medium text-gray-800">{certificate.degree}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase">{t('major')}</span>
                <span className="font-medium text-gray-800">{certificate.major}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase">{t('graduationDate')}</span>
                <span className="font-medium text-gray-800">{new Date(certificate.graduationDate).toLocaleDateString(language)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase">{t('certificateId')}</span>
                <span className="font-mono text-gray-800">{certificate.id}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-8 py-4 text-sm text-gray-500">
            <p>{t('disclaimer', { date: new Date().toLocaleString(language), universityName: university.name })}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div>
        {renderCertificate()}
        <div className="flex justify-center items-center flex-wrap gap-4 mt-8">
          <button
            onClick={() => setPage(1 /* Verify */)}
            className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300"
          >
            {t('verifyAnotherButton')}
          </button>
          {certificate && (
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2 disabled:bg-gray-400"
            >
              {isDownloading ? (
                <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('downloadingPdfButton')}
                </>
              ) : (
                <>
                  <DownloadIcon className="w-5 h-5" />
                  {t('downloadPdfButton')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;