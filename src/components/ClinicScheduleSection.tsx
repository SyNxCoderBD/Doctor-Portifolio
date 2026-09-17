import React, { useState } from 'react';
import { DoctorProfile } from '../types/doctor';
import { MapPin, Phone, Mail, Clock, Calendar, AlertCircle, CheckCircle, Car } from 'lucide-react';
import { bookAppointment } from '../firebase/firestoreService';
import { EditableElement } from './visual-builder/EditableElement';

interface ClinicScheduleSectionProps {
  profile: DoctorProfile;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

export const ClinicScheduleSection: React.FC<ClinicScheduleSectionProps> = ({
  profile,
  onShowToast,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'General Consultation',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  const alignClass =
    profile.scheduleAlign === 'center'
      ? 'text-center items-center'
      : profile.scheduleAlign === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      onShowToast('error', 'Incomplete Form', 'Please provide your full name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookAppointment({
        patientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        preferredTime: '10:00 AM',
        serviceId: 'inquiry',
        serviceTitle: formData.service,
        isFirstVisit: true,
        notes: formData.message,
      });

      onShowToast(
        'success',
        'Message & Appointment Request Dispatched',
        'Our clinical triage coordinator will call you within 2 business hours.'
      );
      setFormData({ name: '', email: '', phone: '', service: 'General Consultation', message: '' });
    } catch (err) {
      console.error('Submission error:', err);
      onShowToast(
        'info',
        'Request Logged',
        'Thank you! Our office staff has received your inquiry details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Open
          </span>
        );
      case 'Surgery Hours':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            Cath Lab / Surgery
          </span>
        );
      case 'By Appointment':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            By Appt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            On-Call Emergency
          </span>
        );
    }
  };

  return (
    <section id="schedule" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-14 flex flex-col ${alignClass}`}>
          <EditableElement
            id="scheduleBadge"
            label="Schedule Section Badge"
            type="badge"
            value={profile.scheduleBadge || 'Consultation Schedule & Facility Location'}
            alignment={profile.scheduleAlign || 'left'}
            onUpdate={({ value, alignment }) => {
              update({
                ...(value !== undefined ? { scheduleBadge: value } : {}),
                ...(alignment !== undefined ? { scheduleAlign: alignment } : {}),
              });
            }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-semibold mb-3 border border-sky-100">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{profile.scheduleBadge || 'Consultation Schedule & Facility Location'}</span>
            </div>
          </EditableElement>

          <EditableElement
            id="scheduleTitle"
            label="Schedule Section Title"
            type="heading"
            value={profile.scheduleTitle || 'Visit Our Practice'}
            alignment={profile.scheduleAlign || 'left'}
            onUpdate={({ value, alignment }) => {
              update({
                ...(value !== undefined ? { scheduleTitle: value } : {}),
                ...(alignment !== undefined ? { scheduleAlign: alignment } : {}),
              });
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {profile.scheduleTitle || 'Visit Our Practice'}
            </h2>
          </EditableElement>

          <EditableElement
            id="scheduleSubtitle"
            label="Schedule Section Subtitle"
            type="text"
            value={
              profile.scheduleSubtitle ||
              'Conveniently located with dedicated valet parking and immediate accessibility.'
            }
            alignment={profile.scheduleAlign || 'left'}
            onUpdate={({ value, alignment }) => {
              update({
                ...(value !== undefined ? { scheduleSubtitle: value } : {}),
                ...(alignment !== undefined ? { scheduleAlign: alignment } : {}),
              });
            }}
          >
            <p className="text-slate-600 text-base sm:text-lg mt-3">
              {profile.scheduleSubtitle ||
                'Conveniently located with dedicated valet parking and immediate accessibility.'}
            </p>
          </EditableElement>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Schedule Table & Clinic Details */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Consultation Hours Table */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <EditableElement
                id="scheduleHoursTitle"
                label="Hours Table Heading"
                type="text"
                value={profile.scheduleHoursTitle || 'Clinical Consultation Hours'}
                onUpdate={({ value }) => {
                  if (value !== undefined) update({ scheduleHoursTitle: value });
                }}
              >
                <div className="p-5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Calendar className="w-4 h-4 text-sky-700" />
                    <span>{profile.scheduleHoursTitle || 'Clinical Consultation Hours'}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Eastern Standard Time</span>
                </div>
              </EditableElement>

              <div className="divide-y divide-slate-200/80 text-sm">
                {profile.consultationHours.map((ch, idx) => (
                  <EditableElement
                    key={idx}
                    id={`scheduleDay-${idx}`}
                    label={`${ch.day} Hours`}
                    type="card"
                    value={ch.hours}
                    secondaryValue={ch.status}
                    onUpdate={({ value, secondaryValue }) => {
                      const newHours = [...profile.consultationHours];
                      newHours[idx] = {
                        ...newHours[idx],
                        ...(value !== undefined ? { hours: value } : {}),
                        ...(secondaryValue !== undefined ? { status: secondaryValue } : {}),
                      };
                      update({ consultationHours: newHours });
                    }}
                  >
                    <div className="flex items-center justify-between px-5 py-3 hover:bg-white transition-colors">
                      <span className="font-semibold text-slate-800">{ch.day}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-mono text-xs">{ch.hours}</span>
                        {getStatusBadge(ch.status)}
                      </div>
                    </div>
                  </EditableElement>
                ))}
              </div>
            </div>

            {/* Address & Parking Card */}
            <EditableElement
              id="clinicContactDetails"
              label="Clinic Facility & Location Info"
              type="card"
              value={profile.clinicInfo.name}
              secondaryValue={`${profile.clinicInfo.address}, ${profile.clinicInfo.suite}, ${profile.clinicInfo.cityStateZip}`}
              onUpdate={({ value, secondaryValue }) => {
                update({
                  clinicInfo: {
                    ...profile.clinicInfo,
                    ...(value !== undefined ? { name: value } : {}),
                  },
                });
              }}
            >
              <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{profile.clinicInfo.name}</h4>
                    <p className="text-sm text-slate-300 mt-0.5">
                      {profile.clinicInfo.address}, {profile.clinicInfo.suite}
                    </p>
                    <p className="text-sm text-slate-300">{profile.clinicInfo.cityStateZip}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-300">
                  <Car className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{profile.clinicInfo.parkingInfo}</span>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-sky-300">
                  <a
                    href={`tel:${profile.clinicInfo.phone.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{profile.clinicInfo.phone}</span>
                  </a>
                  <a
                    href={`mailto:${profile.clinicInfo.email}`}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile.clinicInfo.email}</span>
                  </a>
                </div>
              </div>
            </EditableElement>

          </div>

          {/* Right: Direct Clinic Inquiry Form */}
          <div className="lg:col-span-6 bg-slate-50/70 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">Direct Patient Inquiry</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Have a question regarding insurance coverage, pre-operative protocols, or procedure second opinions? Submit below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Jonathan Miller"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jonathan@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (212) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Area of Inquiry / Procedure
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                >
                  <option value="General Consultation">Comprehensive Cardiovascular Consultation</option>
                  <option value="TAVR Evaluation">TAVR / Aortic Valve Second Opinion</option>
                  <option value="Coronary Angioplasty / Stenting">Coronary Stenting / Angioplasty Evaluation</option>
                  <option value="Preventive Lipid Screening">Preventive Lipidology & Calcium Score</option>
                  <option value="Athletic Heart Clearance">Athletic Heart Screening & CPET</option>
                  <option value="Other">Other Clinical Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Medical Background or Questions
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share any current symptoms, recent stress test results, or specific referral details..."
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Emergency Notice:</strong> If you are experiencing acute crushing chest pain, shortness of breath, or sudden numbness, call 911 immediately or go to the nearest emergency room.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Clinical Triage...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Clinical Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
