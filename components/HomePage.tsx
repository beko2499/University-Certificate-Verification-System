import React from 'react';
import { CertificateIcon, ShieldCheckIcon, SearchIcon } from './Icons';
import type { Page } from '../types';

interface HomePageProps {
  setPage: (page: Page) => void;
  t: (key: string) => string;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300">
    <div className="flex justify-center items-center mb-4 text-sky-500">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const DecorativeCertificate: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute bg-white/10 backdrop-blur-sm rounded-lg shadow-lg ${className}`}>
    <div className="h-3 bg-white/20 rounded-t-lg"></div>
    <div className="p-4 space-y-2">
      <div className="h-2 bg-white/20 rounded"></div>
      <div className="h-2 w-2/3 bg-white/20 rounded"></div>
    </div>
  </div>
);


const HomePage: React.FC<HomePageProps> = ({ setPage, t }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-sky-700 text-white text-center py-20 px-4 md:py-32 relative overflow-hidden">
        
        {/* Floating decorative certificates */}
        <DecorativeCertificate className="w-32 h-40 -top-8 -left-12 rotate-[-20deg] animate-float" />
        <DecorativeCertificate className="w-48 h-60 -bottom-16 -right-20 rotate-[30deg] animate-float [animation-delay:-2s]" />
        <DecorativeCertificate className="hidden md:block w-24 h-32 top-24 -right-10 rotate-[-10deg] animate-float [animation-delay:-4s]" />
        <DecorativeCertificate className="hidden lg:block w-40 h-52 bottom-20 -left-24 rotate-[15deg] animate-float [animation-delay:-1s]" />

        <div className="max-w-4xl mx-auto relative z-10">
          <ShieldCheckIcon className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('heroTitle')}</h1>
          <p className="text-lg md:text-xl text-sky-200 mb-8">
            {t('heroSubtitle')}
          </p>
          <button
            onClick={() => setPage(1 /* Verify */)}
            className="bg-white text-sky-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-sky-100 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            {t('heroButton')}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('howItWorks')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<SearchIcon className="w-16 h-16" />}
              title={t('feature1Title')}
              description={t('feature1Desc')}
            />
            <FeatureCard
              icon={<CertificateIcon className="w-16 h-16" />}
              title={t('feature2Title')}
              description={t('feature2Desc')}
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-16 h-16" />}
              title={t('feature3Title')}
              description={t('feature3Desc')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;