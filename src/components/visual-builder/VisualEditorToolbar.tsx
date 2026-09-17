import React from 'react';
import { useVisualBuilder } from './VisualBuilderContext';
import {
  Sparkles,
  Save,
  Eye,
  Edit3,
  Sliders,
  Check,
  AlertCircle,
  Stethoscope,
  X,
  Layers,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface VisualEditorToolbarProps {
  onOpenAdminModal: () => void;
}

export const VisualEditorToolbar: React.FC<VisualEditorToolbarProps> = ({ onOpenAdminModal }) => {
  const {
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    isVisualEditMode,
    setIsVisualEditMode,
    setIsPresetsModalOpen,
    saveToFirestore,
    isSaving,
    hasUnsavedChanges,
    selectTarget,
  } = useVisualBuilder();

  // If user is NOT logged in as admin, DO NOT display any builder UI or toolbar to regular visitors
  if (!isAdminLoggedIn) {
    return null;
  }

  // If admin is logged in but visual edit mode is currently toggled OFF, render a discreet floating pill for the authenticated admin
  if (!isVisualEditMode) {
    return (
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => setIsVisualEditMode(true)}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/95 hover:bg-slate-900 text-white text-xs font-bold shadow-2xl backdrop-blur-md border border-slate-700 hover:border-amber-400 hover:scale-105 transition-all cursor-pointer group"
          title="Admin Authenticated: Click to launch visual front-end editor"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 group-hover:animate-ping" />
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Launch Visual Editor</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="visual-editor-top-toolbar"
      className="sticky top-0 z-50 bg-slate-950 text-white backdrop-blur-md border-b border-slate-800 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Visual Builder Active</span>
          </div>

          <span className="hidden lg:inline text-xs text-slate-400 font-medium border-l border-slate-800 pl-3">
            Click any text, image, icon or card on the page to customize.
          </span>
        </div>

        {/* Center/Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Specialty Presets (12+) */}
          <button
            type="button"
            onClick={() => {
              selectTarget(null);
              setIsPresetsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-900/70 hover:bg-sky-800 text-sky-200 border border-sky-600/40 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Switch medical specialty presets (Cardiology, Pediatrics, Dermatology, Neurology, Orthopedics, etc.)"
          >
            <Stethoscope className="w-3.5 h-3.5 text-sky-300" />
            <span>Specialty Presets</span>
          </button>

          {/* Save Live to Firestore */}
          <button
            type="button"
            onClick={saveToFirestore}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/50 animate-pulse'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes *' : 'Save Live'}</span>
          </button>

          {/* Full CMS Dashboard */}
          <button
            type="button"
            onClick={() => {
              selectTarget(null);
              onOpenAdminModal();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
            title="Open Administrative Dashboard with Appointments, Passcode & Data Tabs"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Admin CMS</span>
          </button>

          {/* Patient View / Exit Edit Mode */}
          <button
            type="button"
            onClick={() => {
              selectTarget(null);
              setIsVisualEditMode(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-slate-800"
            title="Switch to patient view"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Patient View</span>
          </button>

          {/* Admin Logout */}
          <button
            type="button"
            onClick={() => {
              selectTarget(null);
              setIsAdminLoggedIn(false);
            }}
            className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer border border-slate-800"
            title="Log out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
