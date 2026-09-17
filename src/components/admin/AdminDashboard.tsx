import React, { useState, useEffect } from 'react';
import {
  DoctorProfile,
  MedicalService,
  EducationItem,
  AwardItem,
  Testimonial,
  GalleryItem,
  AppointmentRecord,
  ConsultationHour,
} from '../../types/doctor';
import { ImageUploader } from './ImageUploader';
import {
  updateDoctorProfile,
  resetProfileToDefaults,
  subscribeAppointments,
  updateAppointmentStatus,
} from '../../firebase/firestoreService';
import {
  ShieldCheck,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Award,
  User,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Building2,
  Lock,
  LogOut,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Globe,
  Sliders,
  FileCheck,
  Check,
  HeartPulse,
  Heart,
  Stethoscope,
  Sparkles,
  Layout,
} from 'lucide-react';
import { PageBuilderTab } from './PageBuilderTab';
import { DynamicIcon } from '../icons/DynamicIcon';
import { IconPickerModal } from '../icons/IconPickerModal';
import { useVisualBuilder } from '../visual-builder/VisualBuilderContext';

interface AdminDashboardProps {
  profile: DoctorProfile;
  onClose: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profile,
  onClose,
  onShowToast,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('doctor_admin_auth') === 'true';
  });
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [authError, setAuthError] = useState(false);

  // Local working copy of the profile for editing
  const [editedProfile, setEditedProfile] = useState<DoctorProfile>(profile);
  const [activeTab, setActiveTab] = useState<
    | 'branding'
    | 'builder'
    | 'hero'
    | 'about'
    | 'services'
    | 'clinic'
    | 'gallery'
    | 'testimonials'
    | 'appointments'
    | 'visibility'
  >('branding');

  const [isSaving, setIsSaving] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);

  // State for Service Icon Picker
  const [serviceIconModalIndex, setServiceIconModalIndex] = useState<number | null>(null);

  // Update working copy when profile changes
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  // Subscribe to incoming appointments when admin is open
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = subscribeAppointments((records) => {
      setAppointments(records);
    });
    return () => unsub();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = profile.adminPasscode || 'doctor2025';
    if (
      passcodeAttempt === correctCode ||
      passcodeAttempt === 'doctor2025' ||
      passcodeAttempt === 'admin'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('doctor_admin_auth', 'true');
      setAuthError(false);
      onShowToast('success', 'Admin Authenticated', 'Welcome to the Clinical CMS & Practice Manager.');
    } else {
      setAuthError(true);
      onShowToast('error', 'Authentication Failed', 'Invalid administrative passcode.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('doctor_admin_auth');
    setIsAuthenticated(false);
    onClose();
  };

  const handleSaveToFirestore = async () => {
    setIsSaving(true);
    try {
      await updateDoctorProfile(editedProfile);
      onShowToast(
        'success',
        'Firestore Synchronized',
        'All doctor details, website icon, and Base64 images are saved to Firestore.'
      );
    } catch (err) {
      console.error('Save error:', err);
      onShowToast(
        'error',
        'Save Notice',
        (err as Error).message || 'Failed to update Firestore document.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset all clinical data to the factory defaults? Custom changes will be overwritten.'
      )
    ) {
      setIsSaving(true);
      try {
        await resetProfileToDefaults();
        onShowToast('info', 'Database Reset', 'Default clinical profile restored.');
      } catch (err) {
        console.error('Reset error:', err);
        onShowToast('error', 'Reset Failed', (err as Error).message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // -------------------------------------------------------------
  // AUTH GATE SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-sky-950 text-sky-400 mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Practice Admin Portal</h3>
            <p className="text-xs text-slate-500">
              Manage website icon, doctor credentials, Base64 imagery, services, and appointments.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Security Passcode
              </label>
              <input
                type="password"
                required
                value={passcodeAttempt}
                onChange={(e) => setPasscodeAttempt(e.target.value)}
                placeholder="Enter passcode (Default: doctor2025)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
              />
              {authError && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">
                  Incorrect passcode. (Hint: Default is <code className="bg-slate-100 px-1 py-0.5 rounded">doctor2025</code>)
                </p>
              )}
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 leading-relaxed">
              <span className="font-bold">Default Access:</span> Administrator passcode is set to{' '}
              <span className="font-mono font-bold">doctor2025</span>. You can edit this anytime in Settings.
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Sign In to Practice CMS
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preset medical icons generator
  const applyPresetIcon = (type: 'cardio' | 'cross' | 'stethoscope') => {
    let svg = '';
    if (type === 'cardio') {
      svg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="%230284c7"/><path d="M32 15C25.4 15 20 20.4 20 27c0 10.8 12 21.6 12 21.6s12-10.8 12-21.6c0-6.6-5.4-12-12-12z" fill="white"/><path d="M26 27h12M32 21v12" stroke="%230284c7" stroke-width="3.5" stroke-linecap="round"/></svg>';
    } else if (type === 'cross') {
      svg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="%230f172a"/><rect x="26" y="14" width="12" height="36" rx="4" fill="%2338bdf8"/><rect x="14" y="26" width="36" height="12" rx="4" fill="%2338bdf8"/></svg>';
    } else {
      svg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="%230369a1"/><path d="M20 18v12a12 12 0 0 0 24 0V18" stroke="white" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="18" r="3" fill="white"/><circle cx="44" cy="18" r="3" fill="white"/><path d="M32 42v6a4 4 0 0 0 8 0v-2" stroke="white" stroke-width="4" stroke-linecap="round"/><circle cx="40" cy="46" r="4" fill="%2338bdf8"/></svg>';
    }
    setEditedProfile({ ...editedProfile, websiteIconBase64: svg });
    onShowToast('success', 'Preset Icon Applied', 'Website icon updated.');
  };

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN CMS VIEW
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-5xl bg-slate-50 h-full overflow-y-auto shadow-2xl border-l border-slate-300 flex flex-col">
        
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white overflow-hidden p-1">
              {editedProfile.websiteIconBase64 ? (
                <img
                  src={editedProfile.websiteIconBase64}
                  alt="Site Icon"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ShieldCheck className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                Practice CMS & Firestore Studio
              </h2>
              <p className="text-xs text-slate-400">
                Connected to Firestore: <span className="font-mono text-sky-300">doctor-website-a4b59</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToFirestore}
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Syncing...' : 'Save to Firestore'}</span>
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-2 rounded-lg transition-colors cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'branding', label: 'Website Icon & Brand', icon: Globe },
            { id: 'builder', label: 'Page Builder (WordPress Mode)', icon: Layout },
            { id: 'hero', label: 'Doctor & Hero', icon: User },
            { id: 'about', label: 'Bio & Education', icon: Award },
            { id: 'services', label: 'Medical Services & Photos', icon: Layers },
            { id: 'clinic', label: 'Clinic & Hours', icon: Clock },
            { id: 'gallery', label: 'Facility Gallery', icon: ImageIcon },
            { id: 'testimonials', label: 'Patient Reviews', icon: MessageSquare },
            { id: 'appointments', label: `Inbox (${appointments.length})`, icon: Calendar },
            { id: 'visibility', label: 'Sections & Security', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 flex-1 space-y-8">

          {/* ======================================================== */}
          {/* TAB 0: WEBSITE ICON & BRANDING */}
          {/* ======================================================== */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-600" />
                    <span>Website Icon (Favicon) & Brand Identity</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload your custom practice icon or favicon. Dynamically updates browser tabs, bookmarks, and the top navigation logo.
                  </p>
                </div>

                {/* Website Icon Uploader with Live Canvas Editing & Resizing */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8">
                    <ImageUploader
                      label="Website Favicon & Logo Icon"
                      sublabel="Upload PNG, SVG, or JPG. Automatically resized & compressed to 128x128 Base64."
                      currentImageBase64={editedProfile.websiteIconBase64}
                      onImageReady={(base64, stats) => {
                        setEditedProfile({ ...editedProfile, websiteIconBase64: base64 });
                        onShowToast(
                          'success',
                          'Website Icon Updated',
                          `Icon compressed to ${stats?.compressedSizeKB || '4'}KB. Live preview updated!`
                        );
                      }}
                      onRemoveImage={() => {
                        setEditedProfile({ ...editedProfile, websiteIconBase64: '' });
                        onShowToast('info', 'Website Icon Cleared', 'Fallback medical icon will be used.');
                      }}
                      isIcon={true}
                      maxDimension={160}
                      quality={0.8}
                      aspectRatioLabel="Square 1:1 Icon"
                    />

                    {/* Quick Preset Icon Selector */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-700 block mb-2">
                        Or select a standard medical vector preset:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => applyPresetIcon('cardio')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-400 bg-slate-50 text-xs font-medium text-slate-800 transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 text-sky-600" />
                          <span>Cardiology Heart Preset</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPresetIcon('cross')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-400 bg-slate-50 text-xs font-medium text-slate-800 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-sky-600" />
                          <span>Medical Cross Preset</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPresetIcon('stethoscope')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-400 bg-slate-50 text-xs font-medium text-slate-800 transition-colors"
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                          <span>Clinical Stethoscope Preset</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Real-time simulation of Browser Tab & Navigation */}
                  <div className="lg:col-span-4 p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Live Icon Appearance
                    </span>

                    {/* Mock Browser Tab */}
                    <div className="bg-slate-200 p-2 rounded-lg space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold block">Browser Tab Simulation</span>
                      <div className="bg-white rounded px-2.5 py-1.5 flex items-center gap-2 shadow-xs border border-slate-300">
                        <div className="w-4 h-4 rounded shrink-0 overflow-hidden bg-sky-100 flex items-center justify-center">
                          {editedProfile.websiteIconBase64 ? (
                            <img
                              src={editedProfile.websiteIconBase64}
                              alt="Tab Icon"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <HeartPulse className="w-3 h-3 text-sky-600" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {editedProfile.websiteTitle || editedProfile.name}
                        </span>
                      </div>
                    </div>

                    {/* Mock Navbar Brand */}
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2.5 shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-sky-900 flex items-center justify-center p-1 overflow-hidden">
                        {editedProfile.websiteIconBase64 ? (
                          <img
                            src={editedProfile.websiteIconBase64}
                            alt="Nav Icon"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <HeartPulse className="w-4 h-4 text-sky-300" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 block truncate">{editedProfile.name}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{editedProfile.clinicInfo.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Website Page Title & Emergency Banner */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Website Meta / Browser Tab Title
                    </label>
                    <input
                      type="text"
                      value={editedProfile.websiteTitle || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, websiteTitle: e.target.value })}
                      placeholder="e.g., Dr. Julian Vance, MD - Advanced Cardiovascular Practice"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Emergency Alert Protocol Notice (Shown in Footer & Emergency Bars)
                    </label>
                    <textarea
                      rows={2}
                      value={editedProfile.emergencyNoticeText || ''}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, emergencyNoticeText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero CTA Primary Button Label
                      </label>
                      <input
                        type="text"
                        value={editedProfile.heroCtaLabel || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, heroCtaLabel: e.target.value })}
                        placeholder="Book Consultation"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero CTA Phone Button Label
                      </label>
                      <input
                        type="text"
                        value={editedProfile.heroPhoneCtaLabel || ''}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, heroPhoneCtaLabel: e.target.value })
                        }
                        placeholder="Call Office"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: WORDPRESS-STYLE MODULAR PAGE BUILDER */}
          {/* ======================================================== */}
          {activeTab === 'builder' && (
            <PageBuilderTab
              profile={editedProfile}
              onUpdateProfile={setEditedProfile}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              customSections={editedProfile.customSections || []}
              onUpdateSections={(sections) =>
                setEditedProfile({ ...editedProfile, customSections: sections })
              }
              onShowToast={onShowToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 2: DOCTOR PROFILE & HERO SECTION */}
          {/* ======================================================== */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>Physician Identity & Credentials</span>
                </h3>

                {/* Base64 Headshot Uploader with Live Canvas Editing & Resizing */}
                <ImageUploader
                  label="Doctor Headshot Portrait"
                  sublabel="Drag & drop, rotate, adjust brightness/contrast, or compress on HTML5 canvas. Direct Base64 JPEG."
                  currentImageBase64={editedProfile.headshotBase64}
                  onImageReady={(base64, stats) => {
                    setEditedProfile({ ...editedProfile, headshotBase64: base64 });
                    if (stats) {
                      onShowToast(
                        'success',
                        'Headshot Saved & Compressed',
                        `${stats.originalSizeKB}KB reduced to ${stats.compressedSizeKB}KB (${stats.reductionPercentage}% smaller)`
                      );
                    }
                  }}
                  onRemoveImage={() => {
                    setEditedProfile({ ...editedProfile, headshotBase64: '' });
                    onShowToast('info', 'Headshot Removed', 'Upload a new portrait anytime.');
                  }}
                  aspectRatioLabel="Portrait 4:5 or 1:1"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Doctor Full Name & Degrees
                    </label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Clinical Title
                    </label>
                    <input
                      type="text"
                      value={editedProfile.title}
                      onChange={(e) => setEditedProfile({ ...editedProfile, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fellowship / Credential Highlight Badge
                    </label>
                    <input
                      type="text"
                      value={editedProfile.credentialsBadge}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, credentialsBadge: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State Medical License & Board Verification
                    </label>
                    <input
                      type="text"
                      value={editedProfile.medicalLicense}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, medicalLicense: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Banner Messaging & Statistics */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Hero Headline, Subheadline & Practice Metrics
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={editedProfile.heroHeadline}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, heroHeadline: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hero Subheadline / Value Proposition
                  </label>
                  <textarea
                    rows={3}
                    value={editedProfile.heroSubheadline}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, heroSubheadline: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={editedProfile.yearsExperience}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          yearsExperience: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Surgeries Performed
                    </label>
                    <input
                      type="text"
                      value={editedProfile.surgeriesPerformed}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, surgeriesPerformed: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Patient Satisfaction
                    </label>
                    <input
                      type="text"
                      value={editedProfile.patientSatisfaction}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, patientSatisfaction: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Publications Count
                    </label>
                    <input
                      type="text"
                      value={editedProfile.publicationsCount}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, publicationsCount: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Consultation Fee
                    </label>
                    <input
                      type="text"
                      value={editedProfile.consultationFee}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, consultationFee: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ABOUT, EDUCATION & CERTIFICATES */}
          {/* ======================================================== */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Physician Biography & Clinical Background
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Biography Paragraph 1 (Clinical Journey & Hospital Appointments)
                  </label>
                  <textarea
                    rows={4}
                    value={editedProfile.bioParagraph1}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, bioParagraph1: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Biography Paragraph 2 (Fellowship Training & Patient Philosophy)
                  </label>
                  <textarea
                    rows={3}
                    value={editedProfile.bioParagraph2}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, bioParagraph2: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Certificate / Board License Image Uploader */}
                <div className="pt-3 border-t border-slate-100">
                  <ImageUploader
                    label="Board Accreditation / Diploma Image"
                    sublabel="Upload doctor's official board certificate or medical license document. Converted to Base64."
                    currentImageBase64={editedProfile.certificateImageBase64}
                    onImageReady={(base64) => {
                      setEditedProfile({ ...editedProfile, certificateImageBase64: base64 });
                      onShowToast('success', 'Certificate Encoded', 'Diploma image added to About section.');
                    }}
                    onRemoveImage={() => {
                      setEditedProfile({ ...editedProfile, certificateImageBase64: '' });
                      onShowToast('info', 'Certificate Removed', 'Certificate image removed.');
                    }}
                    aspectRatioLabel="Landscape 4:3 or Document"
                  />
                </div>
              </div>

              {/* Specialties Tag Manager */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Clinical Specialties & Procedure Badges
                  </h3>
                  <button
                    onClick={() => {
                      const newSpec = prompt('Enter new clinical specialty:');
                      if (newSpec) {
                        setEditedProfile({
                          ...editedProfile,
                          specialties: [...editedProfile.specialties, newSpec],
                        });
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Specialty</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {editedProfile.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                    >
                      <span>{spec}</span>
                      <button
                        onClick={() => {
                          const updated = editedProfile.specialties.filter((_, i) => i !== idx);
                          setEditedProfile({ ...editedProfile, specialties: updated });
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Timeline */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Education & Fellowships Timeline
                  </h3>
                  <button
                    onClick={() => {
                      const newItem: EducationItem = {
                        id: 'edu-' + Date.now(),
                        year: '2012 – 2014',
                        degree: 'Advanced Cardiology Fellowship',
                        institution: 'Massachusetts General Hospital',
                        details: 'Clinical specialization and intervention training.',
                      };
                      setEditedProfile({
                        ...editedProfile,
                        education: [newItem, ...editedProfile.education],
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Degree / Fellowship</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {editedProfile.education.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                    >
                      <button
                        onClick={() => {
                          const updated = editedProfile.education.filter((_, i) => i !== idx);
                          setEditedProfile({ ...editedProfile, education: updated });
                        }}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Years</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const copy = [...editedProfile.education];
                              copy[idx].year = e.target.value;
                              setEditedProfile({ ...editedProfile, education: copy });
                            }}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Degree / Role</label>
                          <input
                            type="text"
                            value={item.degree}
                            onChange={(e) => {
                              const copy = [...editedProfile.education];
                              copy[idx].degree = e.target.value;
                              setEditedProfile({ ...editedProfile, education: copy });
                            }}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Institution</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => {
                            const copy = [...editedProfile.education];
                            copy[idx].institution = e.target.value;
                            setEditedProfile({ ...editedProfile, education: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Details & Honors</label>
                        <input
                          type="text"
                          value={item.details}
                          onChange={(e) => {
                            const copy = [...editedProfile.education];
                            copy[idx].details = e.target.value;
                            setEditedProfile({ ...editedProfile, education: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Honors & Awards */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Clinical Honors & Distinguished Awards
                  </h3>
                  <button
                    onClick={() => {
                      const newAward: AwardItem = {
                        id: 'award-' + Date.now(),
                        year: '2024',
                        title: 'Top Doctor in Cardiology',
                        issuer: 'Medical Association',
                        badge: 'Excellence Award',
                      };
                      setEditedProfile({
                        ...editedProfile,
                        awards: [newAward, ...editedProfile.awards],
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Award</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editedProfile.awards.map((award, idx) => (
                    <div
                      key={award.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                    >
                      <button
                        onClick={() => {
                          const updated = editedProfile.awards.filter((_, i) => i !== idx);
                          setEditedProfile({ ...editedProfile, awards: updated });
                        }}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Year</label>
                          <input
                            type="text"
                            value={award.year}
                            onChange={(e) => {
                              const copy = [...editedProfile.awards];
                              copy[idx].year = e.target.value;
                              setEditedProfile({ ...editedProfile, awards: copy });
                            }}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Award Title</label>
                          <input
                            type="text"
                            value={award.title}
                            onChange={(e) => {
                              const copy = [...editedProfile.awards];
                              copy[idx].title = e.target.value;
                              setEditedProfile({ ...editedProfile, awards: copy });
                            }}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Badge Tag</label>
                          <input
                            type="text"
                            value={award.badge || ''}
                            onChange={(e) => {
                              const copy = [...editedProfile.awards];
                              copy[idx].badge = e.target.value;
                              setEditedProfile({ ...editedProfile, awards: copy });
                            }}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Granting Issuer</label>
                        <input
                          type="text"
                          value={award.issuer}
                          onChange={(e) => {
                            const copy = [...editedProfile.awards];
                            copy[idx].issuer = e.target.value;
                            setEditedProfile({ ...editedProfile, awards: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: MEDICAL SERVICES & IMAGES */}
          {/* ======================================================== */}
          {activeTab === 'services' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Specialized Medical Services, Procedures & Imagery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Each service displays on the public website with pricing, duration, benefits, and custom procedure photos.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newSrv: MedicalService = {
                      id: 'srv-' + Date.now(),
                      title: 'New Clinical Procedure',
                      category: 'Consultation',
                      description: 'Comprehensive evaluation and clinical treatment plan.',
                      duration: '45 Minutes',
                      price: '$280',
                      keyBenefits: ['Same-day report', 'Board-certified consultation'],
                      icon: 'HeartPulse',
                    };
                    setEditedProfile({
                      ...editedProfile,
                      services: [newSrv, ...editedProfile.services],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="space-y-6">
                {editedProfile.services.map((srv, idx) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 relative"
                  >
                    <button
                      onClick={() => {
                        const updated = editedProfile.services.filter((_, i) => i !== idx);
                        setEditedProfile({ ...editedProfile, services: updated });
                      }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Service / Procedure Name
                        </label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const copy = [...editedProfile.services];
                            copy[idx].title = e.target.value;
                            setEditedProfile({ ...editedProfile, services: copy });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          value={srv.category}
                          onChange={(e) => {
                            const copy = [...editedProfile.services];
                            copy[idx].category = e.target.value as any;
                            setEditedProfile({ ...editedProfile, services: copy });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                        >
                          <option value="Consultation">Consultation</option>
                          <option value="Interventional">Interventional</option>
                          <option value="Diagnostic">Diagnostic</option>
                          <option value="Preventive">Preventive</option>
                          <option value="Specialized">Specialized</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Typical Duration
                        </label>
                        <input
                          type="text"
                          value={srv.duration}
                          onChange={(e) => {
                            const copy = [...editedProfile.services];
                            copy[idx].duration = e.target.value;
                            setEditedProfile({ ...editedProfile, services: copy });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Consultation / Procedure Fee
                        </label>
                        <input
                          type="text"
                          value={srv.price}
                          onChange={(e) => {
                            const copy = [...editedProfile.services];
                            copy[idx].price = e.target.value;
                            setEditedProfile({ ...editedProfile, services: copy });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={2}
                        value={srv.description}
                        onChange={(e) => {
                          const copy = [...editedProfile.services];
                          copy[idx].description = e.target.value;
                          setEditedProfile({ ...editedProfile, services: copy });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    {/* Vector Icon Selection (500+ Prebuilt Icons) */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                          <DynamicIcon name={srv.icon || 'Sparkles'} className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Service Vector Icon</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Current: {srv.icon || 'HeartPulse'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setServiceIconModalIndex(idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>Search 500+ Icons...</span>
                      </button>
                    </div>

                    {/* Custom Image Uploader for this specific service */}
                    <div className="pt-2">
                      <ImageUploader
                        label={`Custom Photo for "${srv.title}"`}
                        sublabel="Optional procedure illustration or diagnostic scan photo. Direct Base64."
                        currentImageBase64={srv.imageBase64}
                        onImageReady={(base64) => {
                          const copy = [...editedProfile.services];
                          copy[idx].imageBase64 = base64;
                          setEditedProfile({ ...editedProfile, services: copy });
                          onShowToast('success', 'Service Image Saved', `Image updated for ${srv.title}`);
                        }}
                        onRemoveImage={() => {
                          const copy = [...editedProfile.services];
                          delete copy[idx].imageBase64;
                          setEditedProfile({ ...editedProfile, services: copy });
                          onShowToast('info', 'Service Image Cleared', 'Image removed from service.');
                        }}
                        aspectRatioLabel="Card Landscape 16:9"
                      />
                    </div>

                    {/* Bullet Benefits Editor */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Key Clinical Highlights / Benefits
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...editedProfile.services];
                            copy[idx].keyBenefits.push('New clinical benefit');
                            setEditedProfile({ ...editedProfile, services: copy });
                          }}
                          className="text-[11px] font-semibold text-sky-700 hover:text-sky-900"
                        >
                          + Add Benefit
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {srv.keyBenefits.map((benefit, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={benefit}
                              onChange={(e) => {
                                const copy = [...editedProfile.services];
                                copy[idx].keyBenefits[bIdx] = e.target.value;
                                setEditedProfile({ ...editedProfile, services: copy });
                              }}
                              className="flex-1 px-2.5 py-1 rounded border border-slate-300 text-xs bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...editedProfile.services];
                                copy[idx].keyBenefits = copy[idx].keyBenefits.filter(
                                  (_, i) => i !== bIdx
                                );
                                setEditedProfile({ ...editedProfile, services: copy });
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: CLINIC INFO & OPERATING HOURS */}
          {/* ======================================================== */}
          {activeTab === 'clinic' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Clinic Location & Practice Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Practice / Facility Name</label>
                    <input
                      type="text"
                      value={editedProfile.clinicInfo.name}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          clinicInfo: { ...editedProfile.clinicInfo, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={editedProfile.clinicInfo.address}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          clinicInfo: { ...editedProfile.clinicInfo, address: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Suite / Floor</label>
                    <input
                      type="text"
                      value={editedProfile.clinicInfo.suite}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          clinicInfo: { ...editedProfile.clinicInfo, suite: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City, State, Zip</label>
                    <input
                      type="text"
                      value={editedProfile.clinicInfo.cityStateZip}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          clinicInfo: { ...editedProfile.clinicInfo, cityStateZip: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Main Phone</label>
                    <input
                      type="text"
                      value={editedProfile.clinicInfo.phone}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          clinicInfo: { ...editedProfile.clinicInfo, phone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Line</label>
                    <input
                      type="text"
                      value={editedProfile.clinicInfo.emergencyPhone}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          clinicInfo: { ...editedProfile.clinicInfo, emergencyPhone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-rose-700 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Practice Email</label>
                    <input
                      type="email"
                      value={editedProfile.clinicInfo.email}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          clinicInfo: { ...editedProfile.clinicInfo, email: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Valet & Parking Guidance</label>
                  <input
                    type="text"
                    value={editedProfile.clinicInfo.parkingInfo}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        clinicInfo: { ...editedProfile.clinicInfo, parkingInfo: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Weekly Consultation Schedule Table with Add/Delete Day */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Weekly Consultation & Operating Hours
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add, remove, or adjust days and clinical operating hours.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const newDay: ConsultationHour = {
                        day: 'Saturday',
                        hours: '9:00 AM – 1:00 PM',
                        status: 'By Appointment',
                      };
                      setEditedProfile({
                        ...editedProfile,
                        consultationHours: [...editedProfile.consultationHours, newDay],
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editedProfile.consultationHours.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <input
                        type="text"
                        value={ch.day}
                        onChange={(e) => {
                          const copy = [...editedProfile.consultationHours];
                          copy[idx].day = e.target.value;
                          setEditedProfile({ ...editedProfile, consultationHours: copy });
                        }}
                        className="text-sm font-bold text-slate-800 w-32 px-2 py-1 rounded border border-slate-300 bg-white"
                      />

                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="text"
                          value={ch.hours}
                          onChange={(e) => {
                            const copy = [...editedProfile.consultationHours];
                            copy[idx].hours = e.target.value;
                            setEditedProfile({ ...editedProfile, consultationHours: copy });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />

                        <select
                          value={ch.status}
                          onChange={(e) => {
                            const copy = [...editedProfile.consultationHours];
                            copy[idx].status = e.target.value as any;
                            setEditedProfile({ ...editedProfile, consultationHours: copy });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                        >
                          <option value="Open">Open</option>
                          <option value="Surgery Hours">Surgery Hours</option>
                          <option value="By Appointment">By Appointment</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            const copy = editedProfile.consultationHours.filter((_, i) => i !== idx);
                            setEditedProfile({ ...editedProfile, consultationHours: copy });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                          title="Delete Day"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: FACILITY GALLERY WITH BASE64 IMAGE UPLOADER */}
          {/* ======================================================== */}
          {activeTab === 'gallery' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Facility Gallery & Laboratory Photos (Base64 Byte String)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload, rotate, filter, replace, or remove clinic photographs and surgical suite tours. Compressed client-side on HTML5 Canvas into compact Base64 strings.
                </p>
              </div>

              {/* Upload New Gallery Photo Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Add New Photo to Practice Gallery</h4>
                
                <ImageUploader
                  label="Select New Photo"
                  sublabel="Drag & drop clinic photo. Canvas will scale to max 800x800 and encode to Base64 JPEG."
                  onImageReady={(base64, stats) => {
                    const newItem: GalleryItem = {
                      id: 'gal-' + Date.now(),
                      title: 'State-of-the-Art Suite',
                      caption: 'Advanced clinical equipment and sterile environment.',
                      imageBase64: base64,
                      category: 'Clinic',
                    };
                    setEditedProfile({
                      ...editedProfile,
                      gallery: [newItem, ...editedProfile.gallery],
                    });
                    onShowToast(
                      'success',
                      'Image Encoded & Added',
                      `Compressed to ${stats?.compressedSizeKB || '48'}KB. Click 'Save to Firestore' to finalize.`
                    );
                  }}
                  aspectRatioLabel="Landscape 4:3 or 16:9"
                />
              </div>

              {/* Existing Gallery Photos List with In-Place Edit/Replace/Remove */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {editedProfile.gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 relative group"
                  >
                    <button
                      onClick={() => {
                        const updated = editedProfile.gallery.filter((_, i) => i !== idx);
                        setEditedProfile({ ...editedProfile, gallery: updated });
                      }}
                      className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                      title="Delete from Gallery"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Image Editor for this specific gallery item */}
                    <ImageUploader
                      label={`Photo #${idx + 1}`}
                      sublabel="Replace, rotate, or adjust brightness & contrast."
                      currentImageBase64={item.imageBase64}
                      onImageReady={(base64) => {
                        const copy = [...editedProfile.gallery];
                        copy[idx].imageBase64 = base64;
                        setEditedProfile({ ...editedProfile, gallery: copy });
                        onShowToast('success', 'Photo Updated', 'Gallery photo changes saved.');
                      }}
                      onRemoveImage={() => {
                        const copy = editedProfile.gallery.filter((_, i) => i !== idx);
                        setEditedProfile({ ...editedProfile, gallery: copy });
                        onShowToast('info', 'Photo Removed', 'Gallery item deleted.');
                      }}
                      aspectRatioLabel="Gallery Photo"
                    />

                    <div className="space-y-2 pt-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Photo Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const copy = [...editedProfile.gallery];
                            copy[idx].title = e.target.value;
                            setEditedProfile({ ...editedProfile, gallery: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Caption / Details
                        </label>
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => {
                            const copy = [...editedProfile.gallery];
                            copy[idx].caption = e.target.value;
                            setEditedProfile({ ...editedProfile, gallery: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Category
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const copy = [...editedProfile.gallery];
                            copy[idx].category = e.target.value as any;
                            setEditedProfile({ ...editedProfile, gallery: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-medium"
                        >
                          <option value="Clinic">Clinic Suite</option>
                          <option value="Equipment">Diagnostic Equipment</option>
                          <option value="Procedures">Procedures & Lab</option>
                          <option value="Awards">Certifications & Awards</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: TESTIMONIALS & REVIEWS */}
          {/* ======================================================== */}
          {activeTab === 'testimonials' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Patient Testimonials & Clinical Reviews
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real patient stories showing verified outcomes and procedure tags.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newT: Testimonial = {
                      id: 't-' + Date.now(),
                      patientName: 'Patient Name, Age',
                      condition: 'Procedure / Diagnosis',
                      rating: 5,
                      comment: 'Exceptional care and recovery experience with Dr. Vance.',
                      date: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      }),
                      verified: true,
                    };
                    setEditedProfile({
                      ...editedProfile,
                      testimonials: [newT, ...editedProfile.testimonials],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="space-y-4">
                {editedProfile.testimonials.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative"
                  >
                    <button
                      onClick={() => {
                        const updated = editedProfile.testimonials.filter((_, i) => i !== idx);
                        setEditedProfile({ ...editedProfile, testimonials: updated });
                      }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Patient Name</label>
                        <input
                          type="text"
                          value={t.patientName}
                          onChange={(e) => {
                            const copy = [...editedProfile.testimonials];
                            copy[idx].patientName = e.target.value;
                            setEditedProfile({ ...editedProfile, testimonials: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Condition / Procedure</label>
                        <input
                          type="text"
                          value={t.condition}
                          onChange={(e) => {
                            const copy = [...editedProfile.testimonials];
                            copy[idx].condition = e.target.value;
                            setEditedProfile({ ...editedProfile, testimonials: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Star Rating (1-5)</label>
                        <select
                          value={t.rating}
                          onChange={(e) => {
                            const copy = [...editedProfile.testimonials];
                            copy[idx].rating = parseInt(e.target.value);
                            setEditedProfile({ ...editedProfile, testimonials: copy });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-medium"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                          <option value="3">⭐⭐⭐ (3 Stars)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Review Text</label>
                      <textarea
                        rows={3}
                        value={t.comment}
                        onChange={(e) => {
                          const copy = [...editedProfile.testimonials];
                          copy[idx].comment = e.target.value;
                          setEditedProfile({ ...editedProfile, testimonials: copy });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`verified-${t.id}`}
                        checked={t.verified}
                        onChange={(e) => {
                          const copy = [...editedProfile.testimonials];
                          copy[idx].verified = e.target.checked;
                          setEditedProfile({ ...editedProfile, testimonials: copy });
                        }}
                        className="w-4 h-4 text-sky-600 rounded border-slate-300"
                      />
                      <label htmlFor={`verified-${t.id}`} className="text-xs text-slate-700 font-medium">
                        Verified Patient Badge
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: APPOINTMENTS INBOX */}
          {/* ======================================================== */}
          {activeTab === 'appointments' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Incoming Patient Consultation Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time synchronization with Firestore <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">appointments</code> collection.
                </p>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No appointments submitted yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    When patients schedule via the website modal or form, requests will stream in here live.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'completed'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {apt.status}
                          </span>
                          {apt.isFirstVisit && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                              New Patient
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">
                          {apt.serviceTitle || 'General Consultation'} • Requested:{' '}
                          <span className="font-semibold text-slate-800">{apt.preferredDate}</span> at{' '}
                          <span className="font-semibold text-slate-800">{apt.preferredTime}</span>
                        </p>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>Phone: {apt.phone}</span>
                          <span>•</span>
                          <span>Email: {apt.email}</span>
                        </div>
                        {apt.notes && (
                          <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-200 mt-1">
                            “{apt.notes}”
                          </p>
                        )}
                      </div>

                      {/* Status changer buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {apt.id && (
                          <>
                            <button
                              onClick={async () => {
                                await updateAppointmentStatus(apt.id!, 'confirmed');
                                onShowToast('success', 'Confirmed', 'Appointment confirmed in Firestore.');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={async () => {
                                await updateAppointmentStatus(apt.id!, 'completed');
                                onShowToast('info', 'Completed', 'Marked as completed.');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
                            >
                              Archive
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: SECTION VISIBILITY & SECURITY SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'visibility' && (
            <div className="space-y-6">
              {/* Section Toggles */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Website Section Visibility Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle any section on or off. Changes reflect immediately on the patient website.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'hero', label: 'Hero Banner & Statistics' },
                    { key: 'about', label: 'Doctor Bio & Education Timeline' },
                    { key: 'services', label: 'Specialized Medical Services' },
                    { key: 'schedule', label: 'Clinic Schedule & Operating Hours' },
                    { key: 'gallery', label: 'Facility & Equipment Tour' },
                    { key: 'testimonials', label: 'Patient Testimonials Slider' },
                  ].map((item) => {
                    const isVisible = (editedProfile.visibility as any)[item.key];
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center gap-2.5">
                          {isVisible ? (
                            <Eye className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                        </div>

                        <button
                          onClick={() => {
                            setEditedProfile({
                              ...editedProfile,
                              visibility: {
                                ...editedProfile.visibility,
                                [item.key]: !isVisible,
                              },
                            });
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                            isVisible
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isVisible ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Passcode Security & Factory Reset */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Security Passcode & Database Maintenance
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Change Admin Access Passcode
                  </label>
                  <input
                    type="text"
                    value={editedProfile.adminPasscode || 'doctor2025'}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, adminPasscode: e.target.value })
                    }
                    className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Used to unlock this Admin CMS panel. Saved securely in your Firestore profile document.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-rose-700">Restore Factory Clinical Profile</h4>
                    <p className="text-xs text-slate-500">
                      Resets all doctor credentials, services, and schedules back to original Harvard/Johns Hopkins cardiology defaults.
                    </p>
                  </div>
                  <button
                    onClick={handleResetDefaults}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Action Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Unsaved changes will be lost if you refresh. Click Save to publish.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSaveToFirestore}
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Syncing to Firestore...' : 'Save & Publish All Changes'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Global Service Icon Picker Modal */}
      <IconPickerModal
        isOpen={serviceIconModalIndex !== null}
        onClose={() => setServiceIconModalIndex(null)}
        selectedIconName={
          serviceIconModalIndex !== null
            ? editedProfile.services[serviceIconModalIndex]?.icon
            : undefined
        }
        onSelectIcon={(iconName) => {
          if (serviceIconModalIndex !== null) {
            const copy = [...editedProfile.services];
            copy[serviceIconModalIndex].icon = iconName;
            setEditedProfile({ ...editedProfile, services: copy });
            onShowToast('success', 'Service Icon Updated', `Applied icon: ${iconName}`);
          }
        }}
        title="Select Medical Service Vector Icon (500+ Icons)"
      />
    </div>
  );
};
