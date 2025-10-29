export interface University {
  id: string;
  name: string;
  country: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  universityId: string;
  degree: string;
  major: string;
  graduationDate: string;
  issueDate: string;
  qrCodeUrl: string; // URL to a QR code image
}

export interface VerificationLog {
  id:string;
  certificateId: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  ipAddress: string;
}

export enum Page {
  Home,
  Verify,
  CertificateDetails,
  AdminLogin,
  AdminDashboard,
}

export type Language = 'en' | 'ar';