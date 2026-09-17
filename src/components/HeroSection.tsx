import React from 'react';
import { DoctorProfile } from '../types/doctor';
import { Calendar, PhoneCall, Award, CheckCircle2, Shield, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableElement } from './visual-builder/EditableElement';

interface HeroSectionProps {
  profile: DoctorProfile;
  onOpenBooking: () => void;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onOpenBooking, onUpdateProfile }) => {
  const alignClass =
    profile.heroAlign === 'center'
      ? 'text-center items-center'
      : profile.heroAlign === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60">
      {/* Subtle architectural background grid & radial light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Clinical Title & Messaging */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`lg:col-span-7 space-y-6 flex flex-col ${alignClass}`}
          >
            {/* Trust Pill / Credentials Tag */}
            <EditableElement
              id="heroCredentialsBadge"
              label="Trust Badge / Fellowship"
              type="badge"
              value={profile.credentialsBadge}
              onUpdate={({ value }) => {
                if (value !== undefined) update({ credentialsBadge: value });
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-900 text-xs font-semibold shadow-xs">
                <Award className="w-4 h-4 text-sky-600" />
                <span>{profile.credentialsBadge}</span>
              </div>
            </EditableElement>

            {/* Doctor Name & Specialty Title */}
            <div className="space-y-2 w-full">
              <EditableElement
                id="heroHeadline"
                label="Hero Main Headline"
                type="heading"
                value={profile.heroHeadline}
                alignment={profile.heroAlign || 'left'}
                onUpdate={({ value, alignment }) => {
                  update({
                    ...(value !== undefined ? { heroHeadline: value } : {}),
                    ...(alignment !== undefined ? { heroAlign: alignment } : {}),
                  });
                }}
              >
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] ${
                  profile.heroAlign === 'center' ? 'text-center' : profile.heroAlign === 'right' ? 'text-right' : 'text-left'
                }`}>
                  {profile.heroHeadline}
                </h1>
              </EditableElement>

              <EditableElement
                id="doctorNameAndTitle"
                label="Doctor Name & Clinical Title"
                type="text"
                value={profile.name}
                secondaryValue={profile.title}
                alignment={profile.heroAlign || 'left'}
                onUpdate={({ value, secondaryValue, alignment }) => {
                  update({
                    ...(value !== undefined ? { name: value } : {}),
                    ...(secondaryValue !== undefined ? { title: secondaryValue } : {}),
                    ...(alignment !== undefined ? { heroAlign: alignment } : {}),
                  });
                }}
              >
                <p className={`text-base sm:text-lg text-sky-800 font-semibold tracking-normal ${
                  profile.heroAlign === 'center' ? 'text-center' : profile.heroAlign === 'right' ? 'text-right' : 'text-left'
                }`}>
                  {profile.name} • <span className="text-slate-600 font-normal">{profile.title}</span>
                </p>
              </EditableElement>
            </div>

            {/* Sub-headline description */}
            <EditableElement
              id="heroSubheadline"
              label="Hero Subheadline Paragraph"
              type="text"
              value={profile.heroSubheadline}
              alignment={profile.heroAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { heroSubheadline: value } : {}),
                  ...(alignment !== undefined ? { heroAlign: alignment } : {}),
                });
              }}
              className="w-full"
            >
              <p className={`text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal ${
                profile.heroAlign === 'center' ? 'text-center mx-auto' : profile.heroAlign === 'right' ? 'text-right ml-auto' : 'text-left'
              }`}>
                {profile.heroSubheadline}
              </p>
            </EditableElement>

            {/* Specialization Badges */}
            <div className="space-y-2.5 pt-1 w-full">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block">
                Primary Clinical Focus & Procedures:
              </span>
              <div className={`flex flex-wrap gap-2 ${profile.heroAlign === 'center' ? 'justify-center' : profile.heroAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                {profile.specialties.slice(0, 5).map((spec, i) => (
                  <EditableElement
                    key={i}
                    id={`heroSpecialty-${i}`}
                    label={`Specialty #${i + 1}`}
                    type="badge"
                    value={spec}
                    onUpdate={({ value }) => {
                      if (value !== undefined) {
                        const newSpecs = [...profile.specialties];
                        newSpecs[i] = value;
                        update({ specialties: newSpecs });
                      }
                    }}
                    onDelete={() => {
                      const newSpecs = profile.specialties.filter((_, idx) => idx !== i);
                      update({ specialties: newSpecs });
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-slate-800 text-xs font-medium border border-slate-200 shadow-xs hover:border-sky-300 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{spec}</span>
                    </span>
                  </EditableElement>
                ))}
                {profile.specialties.length > 5 && (
                  <a
                    href="#services"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-sky-700 hover:text-sky-900"
                  >
                    +{profile.specialties.length - 5} more
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Action CTAs */}
            <div className={`pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 ${
              profile.heroAlign === 'center' ? 'justify-center' : profile.heroAlign === 'right' ? 'justify-end' : 'justify-start'
            }`}>
              <EditableElement
                id="heroCtaBtn"
                label="Hero Primary Booking Button"
                type="button"
                value={profile.heroCtaLabel || 'Book Consultation'}
                buttonVariant="primary"
                onUpdate={({ value }) => {
                  if (value !== undefined) update({ heroCtaLabel: value });
                }}
              >
                <button
                  id="hero-book-btn"
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-base px-6 py-3.5 rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 transition-all cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-sky-100" />
                  <span>{profile.heroCtaLabel || 'Book Consultation'}</span>
                </button>
              </EditableElement>

              <EditableElement
                id="heroPhoneBtn"
                label="Hero Phone CTA Button"
                type="button"
                value={profile.heroPhoneCtaLabel || `Call ${profile.clinicInfo.phone}`}
                buttonVariant="secondary"
                onUpdate={({ value }) => {
                  if (value !== undefined) update({ heroPhoneCtaLabel: value });
                }}
              >
                <a
                  id="hero-phone-cta"
                  href={`tel:${profile.clinicInfo.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base px-5 py-3.5 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-sky-600" />
                  <span>{profile.heroPhoneCtaLabel || `Call ${profile.clinicInfo.phone}`}</span>
                </a>
              </EditableElement>
            </div>

            {/* Medical License Notice */}
            <EditableElement
              id="heroLicenseNotice"
              label="Medical Licensure & Fee Notice"
              type="text"
              value={profile.medicalLicense}
              secondaryValue={profile.consultationFee}
              onUpdate={({ value, secondaryValue }) => {
                update({
                  ...(value !== undefined ? { medicalLicense: value } : {}),
                  ...(secondaryValue !== undefined ? { consultationFee: secondaryValue } : {}),
                });
              }}
            >
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>{profile.medicalLicense}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">Fee: {profile.consultationFee} Initial Consult</span>
              </div>
            </EditableElement>
          </motion.div>

          {/* Right Column: Headshot & Trust Overlay Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Framed Headshot Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <EditableElement
                id="doctorHeroHeadshot"
                label="Doctor Portrait Image URL"
                type="image"
                value={profile.headshotBase64}
                onUpdate={({ value }) => {
                  if (value !== undefined) update({ headshotBase64: value });
                }}
              >
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-900 to-sky-950 p-1.5 shadow-2xl shadow-slate-900/15">
                  <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-slate-200">
                    <img
                      id="doctor-hero-headshot"
                      src={profile.headshotBase64}
                      alt={`${profile.name} - Portrait`}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle Gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Overlaid Doctor Title Pill inside portrait */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-lg font-bold tracking-tight">{profile.name}</p>
                      <p className="text-xs text-sky-300 line-clamp-1">{profile.title}</p>
                    </div>
                  </div>
                </div>
              </EditableElement>

              {/* Floating Stat Badge 1: Interventions */}
              <div className="absolute -top-4 -left-4 sm:-left-6">
                <EditableElement
                  id="heroStatBadge1"
                  label="Hero Floating Stat 1"
                  type="stat"
                  value={profile.heroStat1Value || profile.surgeriesPerformed}
                  secondaryValue={profile.heroStat1Label || 'Procedures Completed'}
                  onUpdate={({ value, secondaryValue }) => {
                    update({
                      ...(value !== undefined ? { heroStat1Value: value } : {}),
                      ...(secondaryValue !== undefined ? { heroStat1Label: secondaryValue } : {}),
                    });
                  }}
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-slate-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 fill-sky-600 text-sky-600" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-slate-900 leading-none">
                        {profile.heroStat1Value || profile.surgeriesPerformed}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {profile.heroStat1Label || 'Procedures Completed'}
                      </div>
                    </div>
                  </div>
                </EditableElement>
              </div>

              {/* Floating Stat Badge 2: Satisfaction */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6">
                <EditableElement
                  id="heroStatBadge2"
                  label="Hero Floating Stat 2"
                  type="stat"
                  value={profile.heroStat2Value || profile.patientSatisfaction}
                  secondaryValue={profile.heroStat2Label || 'Patient Satisfaction'}
                  onUpdate={({ value, secondaryValue }) => {
                    update({
                      ...(value !== undefined ? { heroStat2Value: value } : {}),
                      ...(secondaryValue !== undefined ? { heroStat2Label: secondaryValue } : {}),
                    });
                  }}
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-slate-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-slate-900 leading-none">
                        {profile.heroStat2Value || profile.patientSatisfaction}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {profile.heroStat2Label || 'Patient Satisfaction'}
                      </div>
                    </div>
                  </div>
                </EditableElement>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Practice Highlights Metric Banner */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <EditableElement
            id="bottomStat1"
            label="Metric Banner: Stat 1"
            type="stat"
            value={profile.heroStat3Value || `${profile.yearsExperience}+ Years`}
            secondaryValue={profile.heroStat3Label || 'Active Clinical Practice'}
            onUpdate={({ value, secondaryValue }) => {
              update({
                ...(value !== undefined ? { heroStat3Value: value } : {}),
                ...(secondaryValue !== undefined ? { heroStat3Label: secondaryValue } : {}),
              });
            }}
          >
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 tracking-tight">
                {profile.heroStat3Value || `${profile.yearsExperience}+ Years`}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                {profile.heroStat3Label || 'Active Clinical Practice'}
              </div>
            </div>
          </EditableElement>

          <EditableElement
            id="bottomStat2"
            label="Metric Banner: Stat 2"
            type="stat"
            value={profile.heroStat1Value || profile.surgeriesPerformed}
            secondaryValue={profile.heroStat1Label || 'Angioplasty & Valve Cases'}
            onUpdate={({ value, secondaryValue }) => {
              update({
                ...(value !== undefined ? { heroStat1Value: value } : {}),
                ...(secondaryValue !== undefined ? { heroStat1Label: secondaryValue } : {}),
              });
            }}
          >
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 tracking-tight">
                {profile.heroStat1Value || profile.surgeriesPerformed}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                {profile.heroStat1Label || 'Angioplasty & Valve Cases'}
              </div>
            </div>
          </EditableElement>

          <EditableElement
            id="bottomStat3"
            label="Metric Banner: Stat 3"
            type="stat"
            value={profile.heroStat2Value || profile.patientSatisfaction}
            secondaryValue={profile.heroStat2Label || 'Verified Five-Star Outcomes'}
            onUpdate={({ value, secondaryValue }) => {
              update({
                ...(value !== undefined ? { heroStat2Value: value } : {}),
                ...(secondaryValue !== undefined ? { heroStat2Label: secondaryValue } : {}),
              });
            }}
          >
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 tracking-tight">
                {profile.heroStat2Value || profile.patientSatisfaction}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                {profile.heroStat2Label || 'Verified Five-Star Outcomes'}
              </div>
            </div>
          </EditableElement>

          <EditableElement
            id="bottomStat4"
            label="Metric Banner: Stat 4"
            type="stat"
            value={profile.heroStat4Value || `${profile.publicationsCount} Papers`}
            secondaryValue={profile.heroStat4Label || 'Peer-Reviewed Publications'}
            onUpdate={({ value, secondaryValue }) => {
              update({
                ...(value !== undefined ? { heroStat4Value: value } : {}),
                ...(secondaryValue !== undefined ? { heroStat4Label: secondaryValue } : {}),
              });
            }}
          >
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 tracking-tight">
                {profile.heroStat4Value || `${profile.publicationsCount} Papers`}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                {profile.heroStat4Label || 'Peer-Reviewed Publications'}
              </div>
            </div>
          </EditableElement>
        </div>

      </div>
    </section>
  );
};
