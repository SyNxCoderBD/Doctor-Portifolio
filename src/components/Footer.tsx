import React from 'react';
import { DoctorProfile } from '../types/doctor';
import { HeartPulse, Phone, Mail, MapPin, ShieldAlert, Lock, ArrowUp } from 'lucide-react';
import { EditableElement } from './visual-builder/EditableElement';

interface FooterProps {
  profile: DoctorProfile;
  onOpenAdmin: () => void;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAdmin, onUpdateProfile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Alert Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Emergency Protocol
              </h4>
              <EditableElement
                id="emergencyNoticeText"
                label="Emergency Protocol Notice"
                type="text"
                value={
                  profile.emergencyNoticeText ||
                  'If you or a loved one is experiencing severe symptoms, acute chest pain, or loss of consciousness, please call 911 or visit the nearest emergency trauma center immediately.'
                }
                onUpdate={({ value }) => {
                  if (value !== undefined) update({ emergencyNoticeText: value });
                }}
              >
                <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">
                  {profile.emergencyNoticeText ||
                    'If you or a loved one is experiencing severe symptoms, acute chest pain, or loss of consciousness, please call 911 or visit the nearest emergency trauma center immediately.'}
                </p>
              </EditableElement>
            </div>
          </div>
          <div className="shrink-0">
            <a
              href={`tel:${profile.clinicInfo.emergencyPhone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>On-Call: {profile.clinicInfo.emergencyPhone}</span>
            </a>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Doctor Practice Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white overflow-hidden p-1">
                {profile.websiteIconBase64 ? (
                  <img
                    src={profile.websiteIconBase64}
                    alt="Brand Icon"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <HeartPulse className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{profile.name}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {profile.title}. Dedicated to evidence-based intervention, non-invasive imaging, and clinical excellence.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="text-sky-400 font-semibold">{profile.credentialsBadge}</p>
              <p>{profile.medicalLicense}</p>
            </div>
          </div>

          {/* Column 2: Clinical Office Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Practice Address
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 font-semibold">{profile.clinicInfo.name}</p>
                <p>{profile.clinicInfo.address}, {profile.clinicInfo.suite}</p>
                <p>{profile.clinicInfo.cityStateZip}</p>
                <p className="text-slate-400 mt-1 italic">{profile.clinicInfo.parkingInfo}</p>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Hours Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>Office: {profile.clinicInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>{profile.clinicInfo.email}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Mon - Fri: 8:00 AM – 5:00 PM EST<br />
                Procedure & Surgery Hours: By Appointment
              </p>
            </div>
          </div>

          {/* Column 4: Quick Navigation & Patient Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Patient Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a href="#about" className="hover:text-sky-400 transition-colors">
                  Physician Credentials & Fellowships
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-sky-400 transition-colors">
                  Clinical Services & Procedures
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-sky-400 transition-colors">
                  Consultation Schedule & Location
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-sky-400 transition-colors">
                  Patient Reviews & Outcomes
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-sky-400 transition-colors">
                  Facility Tour
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Disclaimers, and Admin Lock */}
        <div className="pt-6 pb-2 text-center text-[11px] text-slate-500 max-w-4xl mx-auto leading-relaxed">
          <EditableElement
            id="footerDisclaimer"
            label="Footer Medical Disclaimer"
            type="text"
            value={
              profile.footerDisclaimer ||
              'Medical Disclaimer: Information presented on this website is for general educational and informational purposes and does not constitute formal medical diagnosis or establish a physician-patient relationship.'
            }
            onUpdate={({ value }) => {
              if (value !== undefined) update({ footerDisclaimer: value });
            }}
          >
            <p>
              {profile.footerDisclaimer ||
                'Medical Disclaimer: Information presented on this website is for general educational and informational purposes and does not constitute formal medical diagnosis or establish a physician-patient relationship.'}
            </p>
          </EditableElement>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <EditableElement
            id="footerCopyright"
            label="Footer Copyright Line"
            type="text"
            value={profile.footerCopyright || `© ${new Date().getFullYear()} ${profile.name}. All medical rights reserved.`}
            onUpdate={({ value }) => {
              if (value !== undefined) update({ footerCopyright: value });
            }}
          >
            <p className="text-center sm:text-left">
              {profile.footerCopyright || `© ${new Date().getFullYear()} ${profile.name}. All medical rights reserved.`}
            </p>
          </EditableElement>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Practice Admin Portal</span>
            </button>

            <span className="text-slate-700">|</span>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
