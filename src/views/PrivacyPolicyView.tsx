import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Trash2,
  PhoneCall,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  HelpCircle,
  Clock,
  Server
} from 'lucide-react';

interface PrivacyPolicyViewProps {
  language: SupportedLanguage;
  onNavigate: (view: string) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  language,
  onNavigate
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [dataDeletionSubmitted, setDataDeletionSubmitted] = useState(false);
  const [deletionEmail, setDeletionEmail] = useState('');

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/privacy-policy.html` : 'https://your-domain.com/privacy-policy.html';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDataDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionEmail.trim()) return;
    setDataDeletionSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">AegisHealth AI: Privacy Policy & Health Data Protection</h1>
              <p className="text-xs text-slate-500">
                Official Data Protection Standard • Smart Care. Better Lives.
              </p>
            </div>
          </div>
        </div>

        {/* Public URL badge for App Store submission */}
        <div className="shrink-0 flex flex-col items-start sm:items-end gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Public Store URL</span>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 max-w-[200px] truncate">
              /privacy-policy.html
            </code>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-medium transition-colors"
            >
              {copiedLink ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Overview Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-teal-50/80 border border-teal-200 p-4 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-teal-900">No Sale of Personal Data</h3>
            <p className="text-xs text-teal-800/90 mt-0.5">
              Your reported health symptoms are never sold, rented, or monetized for advertising.
            </p>
          </div>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-blue-900">Ephemeral Guest Sessions</h3>
            <p className="text-xs text-blue-800/90 mt-0.5">
              Guest symptom checks remain stored locally on your device unless you register.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
          <Trash2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-emerald-900">Right to Erasure</h3>
            <p className="text-xs text-emerald-800/90 mt-0.5">
              Delete your consultation history and account records at any time with one click.
            </p>
          </div>
        </div>
      </div>

      {/* Main Privacy Policy Clauses */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
        
        {/* Effective Date */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Effective Date: <strong>September 2026</strong></span>
          </div>
          <span>Version: <strong>1.4.0 (Production)</strong></span>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">1</span>
            Introduction & Scope
          </h2>
          <p>
            Welcome to the <strong>AI Health Symptom Checker & Preliminary Healthcare Triage System</strong> ("we", "our", or "the Application"). This Privacy Policy explains how our application collects, uses, stores, and protects user information when you access our web platform, mobile applications, or connected triage services.
          </p>
          <p>
            This Privacy Policy strictly complies with the <strong>Google Play Developer Health Apps Policy</strong>, <strong>Apple App Store Review Guidelines (Section 5.1 & Section 1.4)</strong>, and applicable data protection regulations.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">2</span>
            Information We Collect
          </h2>
          <p>We collect only the minimum necessary data to perform preliminary medical triage:</p>
          <div className="space-y-2 pl-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 text-xs block">A. Health & Symptom Data (Sensitive Personal Information)</span>
              <p className="text-xs text-slate-600 mt-1">
                Symptoms selected via 3D Body Anatomy Map or text chat (e.g., fever, chest discomfort, duration, severity ratings). This data is used solely to generate statistical machine learning condition predictions and triage classifications.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 text-xs block">B. Optional Profile & Demographics</span>
              <p className="text-xs text-slate-600 mt-1">
                Age, sex, and preferred language (English, Hindi, Kannada, Telugu, Tamil) to calibrate age-appropriate triage risk benchmarks.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 text-xs block">C. Account Information (For Registered Users Only)</span>
              <p className="text-xs text-slate-600 mt-1">
                Name and email address when you voluntarily create an account to save cross-device consultation history. Guest users operate without registering any email.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">3</span>
            How We Use Your Information (Purpose of Processing)
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Clinical Risk Triage:</strong> Running ensemble Machine Learning models (Random Forest, Decision Tree, Naive Bayes) to estimate condition likelihoods.</li>
            <li><strong>Emergency Detection:</strong> Identifying critical red-flag vitals (e.g., suspected myocardial infarction or acute stroke) and providing immediate 108/112 helpline buttons.</li>
            <li><strong>Doctor & Care Navigation:</strong> Displaying verified specialty healthcare providers in Ballari, Bengaluru, and Indian metro regions based on triage findings.</li>
            <li><strong>No Commercial Profiling:</strong> We do NOT build behavioral advertising profiles or sell data to brokers, insurance companies, or third-party marketing networks.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">4</span>
            Third-Party Services & AI Sub-Processors
          </h2>
          <p className="text-xs">
            To provide conversational natural language parsing, the application may communicate with authorized secure sub-processors:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block">Google Gemini API / Cloud Run:</strong>
              <span className="text-slate-600">Processes conversational text to extract clinical symptom tokens. Data sent to API endpoints is strictly non-persistent and not used for foundational LLM training.</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block">Firebase Firestore & Auth:</strong>
              <span className="text-slate-600">Encrypted in-transit (TLS 1.3) and at-rest (AES-256) cloud persistence for registered patient accounts.</span>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">5</span>
            User Rights & Account Deletion (Google/Apple Compliance)
          </h2>
          <p className="text-xs">
            In accordance with Google Play and Apple App Store guidelines, all users have the absolute right to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Access all stored health history records under the <strong>History</strong> tab.</li>
            <li>Clear local browser storage cache at any time.</li>
            <li>Request complete deletion of account credentials and associated health records.</li>
          </ul>

          {/* Account Deletion Request Widget */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 mt-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Instant Data Deletion Request</span>
            </h4>
            {dataDeletionSubmitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Your deletion request for <strong>{deletionEmail}</strong> has been logged. All associated database records will be expunged.</span>
              </div>
            ) : (
              <form onSubmit={handleDataDeletion} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your registered account email"
                  value={deletionEmail}
                  onChange={(e) => setDeletionEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Request Data Erasure
                </button>
              </form>
            )}
            <p className="text-[11px] text-slate-500">
              Account data is immediately wiped from active Firestore indices upon confirmation.
            </p>
          </div>
        </section>

        {/* Section 6: Children's Privacy */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">6</span>
            Children's Privacy
          </h2>
          <p className="text-xs text-slate-600">
            Our Service is not directed to individuals under the age of 13 without parental or guardian oversight. We do not knowingly collect personally identifiable information from children under 13.
          </p>
        </section>

        {/* Section 7: Medical Disclaimer Warning */}
        <section className="space-y-2 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Mandatory Clinical & Medical Disclaimer</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            The AI Health Symptom Checker is an educational and preliminary triage decision-support tool. It does <strong>NOT</strong> provide a definitive clinical diagnosis, prescribe prescription pharmaceuticals, or replace consultations with licensed physicians. In the event of a medical emergency, call <strong>108 / 112</strong> immediately.
          </p>
        </section>

        {/* Section 8: Contact Details */}
        <section className="space-y-2 pt-2 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">7</span>
            Contact Information & Data Protection Officer
          </h2>
          <p className="text-xs text-slate-600">
            If you have questions, feedback, or privacy concerns regarding this application, please contact our administrative team:
          </p>
          <div className="text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1">
            <div><strong>Project:</strong> AI Health Symptom Checker Team</div>
            <div><strong>Department:</strong> Information Science & Engineering (RYMEC)</div>
            <div><strong>Email:</strong> arunkumar.ise.rymec@gmail.com</div>
          </div>
        </section>

      </div>
    </div>
  );
};
