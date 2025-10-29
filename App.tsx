import React, { useState, useEffect } from 'react';
import './index.css';

import type { Page, Language, Certificate, University, VerificationLog } from './types';
import { Page as PageEnum } from './types';
import { UNIVERSITIES, CERTIFICATES, TRANSLATIONS } from './constants';
import { LogoutIcon } from './components/Icons';

import HomePage from './components/HomePage';
import VerificationPage from './components/VerificationPage';
import CertificateDetails from './components/CertificateDetails';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';

interface AdminState {
  isLoggedIn: boolean;
  username: string | null;
}

function App() {
  const [page, setPage] = useState<Page>(PageEnum.Home);
  const [language, setLanguage] = useState<Language>('en');
  const [adminState, setAdminState] = useState<AdminState>({ isLoggedIn: false, username: null });
  
  const [universities, setUniversities] = useState<University[]>(UNIVERSITIES);
  const [certificates, setCertificates] = useState<Certificate[]>(CERTIFICATES);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [logs, setLogs] = useState<VerificationLog[]>([]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, replacements?: { [key: string]: string | number }) => {
    let str = TRANSLATIONS[language][key as keyof typeof TRANSLATIONS.en] || key;
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        str = str.replace(`{${rKey}}`, String(replacements[rKey]));
      });
    }
    return str;
  };

  const addLog = (logData: Omit<VerificationLog, 'id' | 'timestamp' | 'ipAddress'>) => {
    const newLog: VerificationLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1', // Mock IP
    };
    setLogs(prevLogs => [...prevLogs, newLog]);
  };

  // Certificate Handlers
  const handleAddCertificate = (certData: Omit<Certificate, 'id' | 'issueDate' | 'qrCodeUrl'>) => {
    const newId = `${certData.major.substring(0,2).toUpperCase()}-${certData.universityId.toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newCertificate: Certificate = {
      ...certData,
      id: newId,
      issueDate: new Date().toISOString().split('T')[0],
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${newId}`,
    };
    setCertificates(prevCerts => [...prevCerts, newCertificate]);
  };

  const handleUpdateCertificate = (updatedCertificate: Certificate) => {
    setCertificates(prevCerts => prevCerts.map(cert => cert.id === updatedCertificate.id ? updatedCertificate : cert));
  };
  
  const handleDeleteCertificate = (id: string) => {
    setCertificates(prevCerts => prevCerts.filter(cert => cert.id !== id));
  };

  // University Handlers
  const handleAddUniversity = (uniData: Omit<University, 'id'>) => {
    const newUniversity: University = {
      ...uniData,
      id: `u${Date.now()}`
    };
    setUniversities(prevUnis => [...prevUnis, newUniversity]);
  };

  const handleUpdateUniversity = (updatedUniversity: University) => {
    setUniversities(prevUnis => prevUnis.map(uni => uni.id === updatedUniversity.id ? updatedUniversity : uni));
  };

  const handleDeleteUniversity = (id: string) => {
    setUniversities(prevUnis => prevUnis.filter(uni => uni.id !== id));
    // Optional: Also remove certificates associated with this university
    setCertificates(prevCerts => prevCerts.filter(cert => cert.universityId !== id));
  };

  const handleLogin = (username: string) => {
    setAdminState({ isLoggedIn: true, username: username });
    setPage(PageEnum.AdminDashboard);
  };

  const handleLogout = () => {
    if (window.confirm(t('logoutConfirmation'))) {
      setAdminState({ isLoggedIn: false, username: null });
      setPage(PageEnum.Home);
    }
  };
  
  const renderPage = () => {
    switch (page) {
      case PageEnum.Verify:
        return <VerificationPage certificates={certificates} setPage={setPage} setSelectedCertificate={setSelectedCertificate} addLog={addLog} t={t} />;
      case PageEnum.CertificateDetails:
        return <CertificateDetails certificate={selectedCertificate} universities={universities} setPage={setPage} t={t} language={language} />;
      case PageEnum.AdminLogin:
        return <AdminLoginPage onLogin={handleLogin} t={t} />;
      case PageEnum.AdminDashboard:
        return adminState.isLoggedIn ? (
          <AdminDashboard 
            adminUsername={adminState.username}
            certificates={certificates} 
            universities={universities} 
            logs={logs} 
            t={t}
            onAddCertificate={handleAddCertificate}
            onUpdateCertificate={handleUpdateCertificate}
            onDeleteCertificate={handleDeleteCertificate}
            onAddUniversity={handleAddUniversity}
            onUpdateUniversity={handleUpdateUniversity}
            onDeleteUniversity={handleDeleteUniversity}
          />
        ) : (
          <AdminLoginPage onLogin={handleLogin} t={t} />
        );
      case PageEnum.Home:
      default:
        return <HomePage setPage={setPage} t={t} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage(PageEnum.Home); }} className="text-xl font-bold text-sky-700">
              {t('appName')}
            </a>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button onClick={() => setPage(PageEnum.Home)} className="text-gray-600 hover:text-sky-600">{t('home')}</button>
            <button onClick={() => setPage(PageEnum.Verify)} className="text-gray-600 hover:text-sky-600">{t('verify')}</button>
            {adminState.isLoggedIn ? (
              <>
                <button onClick={() => setPage(PageEnum.AdminDashboard)} className="text-gray-600 hover:text-sky-600">{t('dashboardTitle')}</button>
                <button onClick={handleLogout} className="text-gray-600 hover:text-sky-600 flex items-center gap-1">
                  <LogoutIcon className="w-5 h-5" />
                  {t('logout')}
                </button>
              </>
            ) : (
              <button onClick={() => setPage(PageEnum.AdminLogin)} className="text-gray-600 hover:text-sky-600">{t('admin')}</button>
            )}
            <div className="border-l border-gray-300 h-6"></div>
            <button onClick={() => setLanguage(lang => lang === 'en' ? 'ar' : 'en')} className="text-gray-600 font-semibold hover:text-sky-600">
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} {t('appName')}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
