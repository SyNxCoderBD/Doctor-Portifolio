import React, { useState, useMemo } from 'react';
import { useVisualBuilder } from './VisualBuilderContext';
import {
  X,
  Search,
  Heart,
  Activity,
  Stethoscope,
  ShieldAlert,
  Brain,
  Eye,
  Smile,
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  BookOpen,
  Sparkles,
  Camera,
  FileText,
  User,
  Pill,
  Syringe,
  Thermometer,
  Microscope,
  Baby,
  Bone,
  Ear,
  Scan,
} from 'lucide-react';

export const AVAILABLE_ICONS: { name: string; label: string; component: React.ComponentType<{ className?: string }> }[] = [
  { name: 'Stethoscope', label: 'Stethoscope', component: Stethoscope },
  { name: 'Heart', label: 'Heart', component: Heart },
  { name: 'Activity', label: 'ECG / Activity', component: Activity },
  { name: 'Brain', label: 'Neurology / Brain', component: Brain },
  { name: 'Eye', label: 'Ophthalmology / Eye', component: Eye },
  { name: 'Smile', label: 'Dentistry / Smile', component: Smile },
  { name: 'Baby', label: 'Pediatrics / Baby', component: Baby },
  { name: 'Bone', label: 'Orthopedics / Bone', component: Bone },
  { name: 'Ear', label: 'ENT / Ear', component: Ear },
  { name: 'Scan', label: 'Imaging / MRI Scan', component: Scan },
  { name: 'Pill', label: 'Pharmacy / Pill', component: Pill },
  { name: 'Syringe', label: 'Vaccination / Syringe', component: Syringe },
  { name: 'Thermometer', label: 'Vitals / Thermometer', component: Thermometer },
  { name: 'Microscope', label: 'Pathology / Lab', component: Microscope },
  { name: 'Zap', label: 'Emergency / Urgent', component: Zap },
  { name: 'ShieldAlert', label: 'Emergency / Shield', component: ShieldAlert },
  { name: 'Award', label: 'Credentials / Board', component: Award },
  { name: 'BookOpen', label: 'Research / Fellow', component: BookOpen },
  { name: 'Calendar', label: 'Calendar / Schedule', component: Calendar },
  { name: 'Clock', label: 'Clock / Hours', component: Clock },
  { name: 'MapPin', label: 'Clinic Location', component: MapPin },
  { name: 'Phone', label: 'Phone Hotline', component: Phone },
  { name: 'Mail', label: 'Email', component: Mail },
  { name: 'Sparkles', label: 'Modern / Aesthetic', component: Sparkles },
  { name: 'Camera', label: 'Gallery / Photos', component: Camera },
  { name: 'FileText', label: 'Clinical Records', component: FileText },
  { name: 'User', label: 'Doctor / Patient', component: User },
  { name: 'CheckCircle2', label: 'Verified', component: CheckCircle2 },
];

export const IconPickerModal: React.FC = () => {
  const { isIconPickerOpen, setIsIconPickerOpen, iconPickerTarget } = useVisualBuilder();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return AVAILABLE_ICONS;
    return AVAILABLE_ICONS.filter(
      (item) => item.name.toLowerCase().includes(q) || item.label.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  if (!isIconPickerOpen || !iconPickerTarget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm">Select Element Icon</h3>
            <p className="text-[11px] text-slate-400">Choose an icon to represent this clinical feature</p>
          </div>
          <button
            type="button"
            onClick={() => setIsIconPickerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search icons (e.g. Heart, Brain, Bone, Baby)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="p-4 max-h-72 overflow-y-auto grid grid-cols-4 gap-2.5">
          {filtered.map((item) => {
            const IconComp = item.component;
            const isSelected = iconPickerTarget.iconName === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  iconPickerTarget.onSelect(item.name);
                  setIsIconPickerOpen(false);
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-300'
                    : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <IconComp className="w-6 h-6" />
                <span className="text-[10px] font-medium line-clamp-1">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => setIsIconPickerOpen(false)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
