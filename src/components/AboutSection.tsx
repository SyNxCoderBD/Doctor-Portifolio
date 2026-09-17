import React, { useState } from 'react';
import { DoctorProfile } from '../types/doctor';
import { GraduationCap, Award, BookOpen, Stethoscope, Check, ShieldCheck } from 'lucide-react';
import { EditableElement } from './visual-builder/EditableElement';

interface AboutSectionProps {
  profile: DoctorProfile;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'education' | 'awards'>('education');

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  const alignClass =
    profile.aboutAlign === 'center'
      ? 'text-center items-center mx-auto'
      : profile.aboutAlign === 'right'
      ? 'text-right items-end ml-auto'
      : 'text-left items-start';

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-14 flex flex-col ${alignClass}`}>
          <EditableElement
            id="aboutBadge"
            label="About Section Badge"
            type="badge"
            value={profile.aboutBadge || 'Physician Profile & Clinical Philosophy'}
            alignment={profile.aboutAlign || 'left'}
            onUpdate={({ value, alignment }) => {
              update({
                ...(value !== undefined ? { aboutBadge: value } : {}),
                ...(alignment !== undefined ? { aboutAlign: alignment } : {}),
              });
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-semibold mb-3 border border-sky-100">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{profile.aboutBadge || 'Physician Profile & Clinical Philosophy'}</span>
            </div>
          </EditableElement>

          <EditableElement
            id="aboutTitle"
            label="About Section Title"
            type="heading"
            value={profile.aboutTitle || 'Distinguished Expertise in Cardiovascular Medicine'}
            alignment={profile.aboutAlign || 'left'}
            onUpdate={({ value, alignment }) => {
              update({
                ...(value !== undefined ? { aboutTitle: value } : {}),
                ...(alignment !== undefined ? { aboutAlign: alignment } : {}),
              });
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {profile.aboutTitle || 'Distinguished Expertise in Cardiovascular Medicine'}
            </h2>
          </EditableElement>

          <EditableElement
            id="aboutSubtitle"
            label="About Section Subtitle"
            type="text"
            value={
              profile.aboutSubtitle ||
              'Combining rigorous academic fellowship training at Harvard and Johns Hopkins with compassionate, continuous patient advocacy.'
            }
            alignment={profile.aboutAlign || 'left'}
            onUpdate={({ value, alignment }) => {
              update({
                ...(value !== undefined ? { aboutSubtitle: value } : {}),
                ...(alignment !== undefined ? { aboutAlign: alignment } : {}),
              });
            }}
          >
            <p className="text-slate-600 text-base sm:text-lg mt-3">
              {profile.aboutSubtitle ||
                'Combining rigorous academic fellowship training at Harvard and Johns Hopkins with compassionate, continuous patient advocacy.'}
            </p>
          </EditableElement>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Biography, Philosophy & Clinical Scope */}
          <div className="lg:col-span-6 space-y-6">
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <EditableElement
                id="bioParagraph1"
                label="Biography Paragraph 1"
                type="text"
                value={profile.bioParagraph1}
                onUpdate={({ value }) => {
                  if (value !== undefined) update({ bioParagraph1: value });
                }}
              >
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {profile.bioParagraph1}
                </p>
              </EditableElement>

              <EditableElement
                id="bioParagraph2"
                label="Biography Paragraph 2"
                type="text"
                value={profile.bioParagraph2}
                onUpdate={({ value }) => {
                  if (value !== undefined) update({ bioParagraph2: value });
                }}
              >
                <p className="text-base text-slate-600 leading-relaxed">
                  {profile.bioParagraph2}
                </p>
              </EditableElement>
            </div>

            {/* Doctor's Core Philosophy Callout Card */}
            <EditableElement
              id="aboutPhilosophy"
              label="Philosophy Card (Title & Quote)"
              type="card"
              value={profile.aboutPhilosophyTitle || 'The Vance Practice Philosophy'}
              secondaryValue={
                profile.aboutPhilosophyQuote ||
                '“Every heartbeat tells an intricate physiological story. Our role as physicians is not merely to perform interventions, but to educate, listen, and partner with each patient to construct a resilient, lifelong cardiovascular foundation.”'
              }
              onUpdate={({ value, secondaryValue }) => {
                update({
                  ...(value !== undefined ? { aboutPhilosophyTitle: value } : {}),
                  ...(secondaryValue !== undefined ? { aboutPhilosophyQuote: secondaryValue } : {}),
                });
              }}
            >
              <div className="rounded-xl p-6 bg-slate-50 border border-slate-200/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {profile.aboutPhilosophyTitle || 'The Vance Practice Philosophy'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 italic leading-relaxed">
                      {profile.aboutPhilosophyQuote ||
                        '“Every heartbeat tells an intricate physiological story. Our role as physicians is not merely to perform interventions, but to educate, listen, and partner with each patient to construct a resilient, lifelong cardiovascular foundation.”'}
                    </p>
                    <p className="text-xs font-semibold text-sky-800 mt-2">
                      — {profile.name}
                    </p>
                  </div>
                </div>
              </div>
            </EditableElement>

            {/* Licensure & Accreditations Checklist */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Current Licensure & Board Accreditations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'American Board of Internal Medicine (ABIM)',
                  'Subspecialty Board in Cardiovascular Disease',
                  'Board of Interventional Cardiology',
                  'National Board of Echocardiography (ASCeXAM)',
                  'Fellow, American College of Cardiology (FACC)',
                  'New York State Medical License #3829104',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
              </div>

              {/* Verified Certificate Image if present */}
              {profile.certificateImageBase64 && (
                <EditableElement
                  id="certificateImage"
                  label="Board Certificate Image"
                  type="image"
                  value={profile.certificateImageBase64}
                  onUpdate={({ value }) => {
                    if (value !== undefined) update({ certificateImageBase64: value });
                  }}
                >
                  <div className="mt-5 p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-4">
                    <div className="w-20 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img
                        src={profile.certificateImageBase64}
                        alt="Board Accreditation"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Verified Board Credentials</span>
                      <span className="text-[11px] text-slate-500 block">Official fellowship & state licensing documentation on file</span>
                    </div>
                  </div>
                </EditableElement>
              )}
            </div>
          </div>

          {/* Right: Interactive Timeline for Education & Awards */}
          <div className="lg:col-span-6 bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200">
            
            {/* Toggle Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-200/70 rounded-xl mb-6">
              <button
                onClick={() => setActiveTab('education')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'education'
                    ? 'bg-white text-sky-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Education & Fellowships</span>
              </button>
              <button
                onClick={() => setActiveTab('awards')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'awards'
                    ? 'bg-white text-sky-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Honors & Clinical Awards</span>
              </button>
            </div>

            {/* Tab 1: Education Timeline */}
            {activeTab === 'education' && (
              <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                {profile.education.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node marker */}
                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-sky-600 ring-4 ring-slate-100 group-hover:scale-125 transition-transform" />
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs group-hover:border-sky-300 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {item.year}
                        </span>
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">
                        {item.degree}
                      </h4>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {item.institution}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Awards & Honors */}
            {activeTab === 'awards' && (
              <div className="space-y-4">
                {profile.awards.map((award) => (
                  <div
                    key={award.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-4 hover:border-amber-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500">{award.year}</span>
                        {award.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100/70 text-amber-800">
                            {award.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {award.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Conferred by {award.issuer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
