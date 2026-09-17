import React, { useState, useEffect } from 'react';
import { DoctorProfile } from '../types/doctor';
import { Phone, Calendar, ShieldCheck, Menu, X, HeartPulse, Clock, Edit3, Sparkles } from 'lucide-react';
import { useVisualBuilder } from './visual-builder/VisualBuilderContext';
import { EditableElement } from './visual-builder/EditableElement';

interface HeaderProps {
  profile: DoctorProfile;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenBooking,
  onOpenAdmin,
  onUpdateProfile,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isVisualEditMode, toggleVisualEditMode, openPresetsModal } = useVisualBuilder();

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About & Credentials', href: '#about', visible: profile.visibility.about },
    { label: 'Clinical Services', href: '#services', visible: profile.visibility.services },
    { label: 'Clinic & Hours', href: '#schedule', visible: profile.visibility.schedule },
    { label: 'Facility Tour', href: '#gallery', visible: profile.visibility.gallery },
    { label: 'Patient Reviews', href: '#testimonials', visible: profile.visibility.testimonials },
  ].filter((item) => item.visible);

  return (
    <>
      {/* Top Clinical Notification / Emergency Hotline Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Accepting New Patients
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-slate-400">{profile.clinicInfo.cityStateZip}</span>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <a
              href={`tel:${profile.clinicInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>Office: {profile.clinicInfo.phone}</span>
            </a>
            <span className="text-slate-700">|</span>
            <div className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Emergency: {profile.clinicInfo.emergencyPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Practice Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-950/10 hover:scale-105 transition-transform duration-200 overflow-hidden p-1">
              {profile.websiteIconBase64 ? (
                <img
                  src={profile.websiteIconBase64}
                  alt="Website Icon"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <HeartPulse className="w-6 h-6 text-sky-300" />
              )}
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                <EditableElement
                  id="headerDoctorName"
                  label="Doctor Name in Header"
                  type="text"
                  value={profile.name}
                  onUpdate={({ value }) => {
                    if (value !== undefined) update({ name: value });
                  }}
                >
                  <span>{profile.name}</span>
                </EditableElement>

                <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                  <ShieldCheck className="w-3 h-3 text-sky-600" />
                  Verified
                </span>
              </div>
              
              <EditableElement
                id="headerClinicName"
                label="Practice / Clinic Name"
                type="text"
                value={profile.clinicInfo.name}
                onUpdate={({ value }) => {
                  if (value !== undefined) {
                    update({ clinicInfo: { ...profile.clinicInfo, name: value } });
                  }
                }}
              >
                <p className="text-xs text-slate-500 font-medium line-clamp-1">
                  {profile.clinicInfo.name}
                </p>
              </EditableElement>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Visual Editor Toggle Button */}
            <button
              onClick={toggleVisualEditMode}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isVisualEditMode
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-md animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Click any text, image or section on this site to edit it directly on-page!"
            >
              <Edit3 className="w-3.5 h-3.5 text-current" />
              <span className="hidden sm:inline">
                {isVisualEditMode ? 'Visual Edit: ON' : 'Visual Edit'}
              </span>
            </button>

            {/* Specialty Presets Quick Trigger */}
            <button
              onClick={openPresetsModal}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 cursor-pointer"
              title="Browse 12+ Medical Specialty Presets (Cardiology, Dermatology, Orthopedics, Pediatrics, etc.)"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Presets</span>
            </button>

            {/* Book Appointment CTA */}
            <button
              id="header-book-btn"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </button>

            {/* Admin CMS Access Trigger */}
            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              title="Practice Admin CMS & Configuration"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
              aria-label="Open Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-slate-700" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleVisualEditMode();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-50 text-amber-900 border border-amber-300 text-sm font-bold py-2 rounded-lg"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isVisualEditMode ? 'Turn Off Visual Editor' : 'Enable Visual Editor'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openPresetsModal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-sky-50 text-sky-800 border border-sky-200 text-sm font-semibold py-2 rounded-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Switch Specialty Presets</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Consultation</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium py-2 rounded-lg border border-slate-200"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span>Doctor CMS & Practice Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
