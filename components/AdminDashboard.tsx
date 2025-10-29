import React, { useState } from 'react';
import type { Certificate, University, VerificationLog } from '../types';
import { CertificateIcon, ShieldCheckIcon, SearchIcon, PencilIcon, TrashIcon, PlusIcon } from './Icons';

interface AdminDashboardProps {
  adminUsername: string | null;
  certificates: Certificate[];
  universities: University[];
  logs: VerificationLog[];
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  onAddCertificate: (certificate: Omit<Certificate, 'id' | 'issueDate' | 'qrCodeUrl'>) => void;
  onUpdateCertificate: (certificate: Certificate) => void;
  onDeleteCertificate: (id: string) => void;
  onAddUniversity: (university: Omit<University, 'id'>) => void;
  onUpdateUniversity: (university: University) => void;
  onDeleteUniversity: (id: string) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string }> = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-sky-100 text-sky-600 rounded-full p-3 me-4 rtl:ms-4 rtl:me-0">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    adminUsername,
    certificates, universities, logs, t, 
    onAddCertificate, onUpdateCertificate, onDeleteCertificate,
    onAddUniversity, onUpdateUniversity, onDeleteUniversity
}) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);

  const openAddCertModal = () => {
    setEditingCertificate(null);
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (cert: Certificate) => {
    setEditingCertificate(cert);
    setIsCertModalOpen(true);
  };
  
  const openAddUniModal = () => {
    setEditingUniversity(null);
    setIsUniModalOpen(true);
  };
  
  const openEditUniModal = (uni: University) => {
    setEditingUniversity(uni);
    setIsUniModalOpen(true);
  };

  const handleDeleteCertificate = (id: string) => {
    if (window.confirm(t('deleteConfirmation'))) {
      onDeleteCertificate(id);
    }
  };
  
  const handleDeleteUniversity = (id: string) => {
    if (window.confirm(t('deleteUniversityConfirmation'))) {
      onDeleteUniversity(id);
    }
  };

  const getUniversityName = (id: string) => {
      return universities.find(u => u.id === id)?.name || 'Unknown';
  }

  return (
    <div className="flex-grow p-4 md:p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('dashboardTitle')}</h1>
        {adminUsername && <p className="text-lg text-gray-600 mb-6">{t('welcomeMessage', { name: adminUsername })}</p>}
        
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 rtl:space-x-reverse" aria-label="Tabs">
            <button onClick={() => setActiveTab('stats')} className={`${activeTab === 'stats' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('dashboardTitle')}</button>
            <button onClick={() => setActiveTab('certs')} className={`${activeTab === 'certs' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('manageCertificates')}</button>
            <button onClick={() => setActiveTab('unis')} className={`${activeTab === 'unis' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('manageUniversities')}</button>
            <button onClick={() => setActiveTab('logs')} className={`${activeTab === 'logs' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('verificationLogs')}</button>
          </nav>
        </div>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<CertificateIcon className="w-6 h-6" />} title={t('totalCerts')} value={certificates.length} />
            <StatCard icon={<ShieldCheckIcon className="w-6 h-6" />} title={t('totalUnis')} value={universities.length} />
            <StatCard icon={<SearchIcon className="w-6 h-6" />} title={t('totalVerifications')} value={logs.length} />
          </div>
        )}

        {activeTab === 'certs' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">{t('manageCertificates')}</h2>
              <button onClick={openAddCertModal} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300 flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                {t('addNewCertificate')}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('certificateId')}</th>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentName')}</th>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('university')}</th>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">{cert.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{cert.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUniversityName(cert.universityId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                        <button onClick={() => openEditCertModal(cert)} className="text-sky-600 hover:text-sky-900"><PencilIcon className="w-5 h-5"/></button>
                        <button onClick={() => handleDeleteCertificate(cert.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'unis' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{t('manageUniversities')}</h2>
                <button onClick={openAddUniModal} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300 flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    {t('addNewUniversity')}
                </button>
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('universityId')}</th>
                        <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('universityName')}</th>
                        <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('country')}</th>
                        <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {universities.map((uni) => (
                        <tr key={uni.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">{uni.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{uni.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{uni.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                            <button onClick={() => openEditUniModal(uni)} className="text-sky-600 hover:text-sky-900"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={() => handleDeleteUniversity(uni.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5" /></button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
             <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{t('verificationLogs')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('logId')}</th>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('certId')}</th>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('timestamp')}</th>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('ipAddress')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.slice().reverse().map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{log.certificateId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {log.status === 'SUCCESS' ? t('statusSuccess') : t('statusFailed')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isCertModalOpen && (
        <CertificateModal 
            certificate={editingCertificate} 
            universities={universities}
            t={t}
            onClose={() => setIsCertModalOpen(false)}
            onSave={(certData) => {
                if(editingCertificate) {
                    onUpdateCertificate({ ...editingCertificate, ...certData });
                } else {
                    onAddCertificate(certData as Omit<Certificate, 'id' | 'issueDate' | 'qrCodeUrl'>);
                }
                setIsCertModalOpen(false);
            }}
        />
      )}
      {isUniModalOpen && (
        <UniversityModal 
            university={editingUniversity}
            t={t}
            onClose={() => setIsUniModalOpen(false)}
            onSave={(uniData) => {
                if(editingUniversity) {
                    onUpdateUniversity({ ...editingUniversity, ...uniData });
                } else {
                    onAddUniversity(uniData as Omit<University, 'id'>);
                }
                setIsUniModalOpen(false);
            }}
        />
      )}
    </div>
  );
};

// Certificate Modal Component
interface CertificateModalProps {
    certificate: Certificate | null;
    universities: University[];
    t: (key: string) => string;
    onClose: () => void;
    onSave: (data: Partial<Certificate>) => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, universities, t, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        studentName: certificate?.studentName || '',
        universityId: certificate?.universityId || universities[0]?.id || '',
        degree: certificate?.degree || '',
        major: certificate?.major || '',
        graduationDate: certificate?.graduationDate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.studentName || !formData.universityId || !formData.degree || !formData.major || !formData.graduationDate) {
            alert("Please fill all fields");
            return;
        }
        onSave(formData);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" dir={document.documentElement.dir}>
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">{certificate ? t('editCertificate') : t('addNewCertificate')}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('studentName')}</label>
                            <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder={t('studentNamePlaceholder')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('university')}</label>
                            <select name="universityId" value={formData.universityId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm">
                                {universities.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">{t('degree')}</label>
                            <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder={t('degreePlaceholder')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('major')}</label>
                            <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder={t('majorPlaceholder')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">{t('graduationDateLabel')}</label>
                            <input type="date" name="graduationDate" value={formData.graduationDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 flex justify-end space-x-2 rtl:space-x-reverse rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// University Modal Component
interface UniversityModalProps {
    university: University | null;
    t: (key: string) => string;
    onClose: () => void;
    onSave: (data: Partial<University>) => void;
}

const UniversityModal: React.FC<UniversityModalProps> = ({ university, t, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: university?.name || '',
        country: university?.country || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.country) {
            alert("Please fill all fields");
            return;
        }
        onSave(formData);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" dir={document.documentElement.dir}>
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">{university ? t('editUniversity') : t('addNewUniversity')}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('universityName')}</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('universityNamePlaceholder')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('country')}</label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder={t('countryPlaceholder')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 flex justify-end space-x-2 rtl:space-x-reverse rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;