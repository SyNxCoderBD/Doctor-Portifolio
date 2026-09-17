import React, { useState, useMemo } from 'react';
import { SPECIALTY_PRESETS, SpecialtyPreset } from '../../data/specialtyPresets';
import { useVisualBuilder } from './VisualBuilderContext';
import {
  X,
  Sparkles,
  CheckCircle2,
  Heart,
  Brain,
  Baby,
  Smile,
  Activity,
  UserCheck,
  Eye,
  HeartHandshake,
  ShieldAlert,
  Zap,
  Search,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Heart: Heart,
  Brain: Brain,
  Baby: Baby,
  Sparkles: Sparkles,
  Activity: Activity,
  Smile: Smile,
  UserCheck: UserCheck,
  Eye: Eye,
  HeartHandshake: HeartHandshake,
  ShieldAlert: ShieldAlert,
  Zap: Zap,
};

export const SpecialtyPresetsModal: React.FC = () => {
  const { isPresetsModalOpen, setIsPresetsModalOpen, applySpecialtyPreset } = useVisualBuilder();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    SPECIALTY_PRESETS.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredPresets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SPECIALTY_PRESETS.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.doctorName.toLowerCase().includes(q) ||
        p.specialtyTitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  if (!isPresetsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl my-auto flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-sky-900 via-slate-900 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Medical Specialty & Practice Presets
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-300 border border-sky-400/30">
                  12 Complete Disciplines
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Switch the entire website in 1 click to any medical or surgical discipline. All doctor credentials, procedures, titles, consultation hours, and patient reviews will automatically adapt.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPresetsModalOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search specialty, doctor, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Presets Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map((preset) => {
            const IconComponent = CATEGORY_ICONS[preset.iconName] || Activity;

            return (
              <div
                key={preset.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {preset.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {preset.doctorName}
                    </p>
                    <p className="text-[11px] text-sky-700 font-medium line-clamp-1">
                      {preset.specialtyTitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {preset.description}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{preset.badge}</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => applySpecialtyPreset(preset.id)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Apply This Preset</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
