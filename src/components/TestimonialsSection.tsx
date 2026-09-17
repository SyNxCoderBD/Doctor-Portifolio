import React, { useState } from 'react';
import { DoctorProfile, PatientTestimonial } from '../types/doctor';
import { Star, ShieldCheck, ChevronLeft, ChevronRight, Quote, Plus, Trash2 } from 'lucide-react';
import { EditableElement } from './visual-builder/EditableElement';
import { useVisualBuilder } from './visual-builder/VisualBuilderContext';

interface TestimonialsSectionProps {
  profile: DoctorProfile;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isVisualEditMode } = useVisualBuilder();

  const testimonials = profile.testimonials || [];

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  const alignClass =
    profile.testimonialsAlign === 'center'
      ? 'text-center items-center'
      : profile.testimonialsAlign === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleAddTestimonial = () => {
    const newTestimonial: PatientTestimonial = {
      id: `review-${Date.now()}`,
      patientName: 'Sarah Jenkins',
      condition: 'Preventive Care Consultation',
      rating: 5,
      comment:
        'Outstanding specialist who listened attentively to all my symptoms and designed a comprehensive treatment protocol that completely restored my quality of life.',
      date: 'Recent Visit',
      verified: true,
    };
    update({ testimonials: [...testimonials, newTestimonial] });
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    update({ testimonials: updated });
    if (currentIndex >= updated.length && updated.length > 0) {
      setCurrentIndex(updated.length - 1);
    }
  };

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section id="testimonials" className="py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className={`max-w-2xl flex flex-col ${alignClass}`}>
            <EditableElement
              id="testimonialsBadge"
              label="Testimonials Section Badge"
              type="badge"
              value={profile.testimonialsBadge || 'Verified Clinical Outcomes & Patient Advocacy'}
              alignment={profile.testimonialsAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { testimonialsBadge: value } : {}),
                  ...(alignment !== undefined ? { testimonialsAlign: alignment } : {}),
                });
              }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{profile.testimonialsBadge || 'Verified Clinical Outcomes & Patient Advocacy'}</span>
              </div>
            </EditableElement>

            <EditableElement
              id="testimonialsTitle"
              label="Testimonials Section Title"
              type="heading"
              value={profile.testimonialsTitle || 'Patient Voices & Clinical Stories'}
              alignment={profile.testimonialsAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { testimonialsTitle: value } : {}),
                  ...(alignment !== undefined ? { testimonialsAlign: alignment } : {}),
                });
              }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {profile.testimonialsTitle || 'Patient Voices & Clinical Stories'}
              </h2>
            </EditableElement>

            <EditableElement
              id="testimonialsSubtitle"
              label="Testimonials Section Subtitle"
              type="text"
              value={
                profile.testimonialsSubtitle ||
                'Real experiences from patients who underwent specialized diagnosis, therapeutic care, and personalized wellness recovery.'
              }
              alignment={profile.testimonialsAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { testimonialsSubtitle: value } : {}),
                  ...(alignment !== undefined ? { testimonialsAlign: alignment } : {}),
                });
              }}
            >
              <p className="text-slate-600 text-base sm:text-lg mt-3">
                {profile.testimonialsSubtitle ||
                  'Real experiences from patients who underwent specialized diagnosis, therapeutic care, and personalized wellness recovery.'}
              </p>
            </EditableElement>
          </div>

          {/* Navigation Arrows for carousel + Add in Edit Mode */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {isVisualEditMode && (
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer mr-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            )}
            <button
              onClick={prevTestimonial}
              aria-label="Previous patient story"
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next patient story"
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Testimonial Carousel Banner */}
        {current && (
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm overflow-hidden mb-12">
            <Quote className="absolute top-6 right-8 w-24 h-24 text-slate-100 pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl space-y-6">
              {/* Stars & Condition Tag */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>

                <EditableElement
                  id={`reviewCondition-${current.id}`}
                  label="Condition / Treatment Type"
                  type="badge"
                  value={current.condition}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newTest = [...testimonials];
                      newTest[currentIndex] = { ...newTest[currentIndex], condition: value };
                      update({ testimonials: newTest });
                    }
                  }}
                >
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-100">
                    {current.condition}
                  </span>
                </EditableElement>

                {current.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Patient
                  </span>
                )}
              </div>

              {/* Testimonial Quote */}
              <EditableElement
                id={`reviewComment-${current.id}`}
                label="Patient Testimonial Quote"
                type="text"
                value={current.comment}
                onUpdate={({ value }) => {
                  if (value !== undefined) {
                    const newTest = [...testimonials];
                    newTest[currentIndex] = { ...newTest[currentIndex], comment: value };
                    update({ testimonials: newTest });
                  }
                }}
              >
                <p className="text-lg sm:text-xl md:text-2xl text-slate-800 font-medium leading-relaxed italic">
                  “{current.comment}”
                </p>
              </EditableElement>

              {/* Author Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <EditableElement
                  id={`reviewAuthor-${current.id}`}
                  label="Patient Name & Date"
                  type="card"
                  value={current.patientName}
                  secondaryValue={current.date}
                  onUpdate={({ value, secondaryValue }) => {
                    const newTest = [...testimonials];
                    newTest[currentIndex] = {
                      ...newTest[currentIndex],
                      ...(value !== undefined ? { patientName: value } : {}),
                      ...(secondaryValue !== undefined ? { date: secondaryValue } : {}),
                    };
                    update({ testimonials: newTest });
                  }}
                >
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {current.patientName}
                    </h4>
                    <p className="text-xs text-slate-500">{current.date}</p>
                  </div>
                </EditableElement>

                {/* Indicator dots */}
                <div className="flex gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? 'w-6 bg-sky-600' : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between relative group"
            >
              {isVisualEditMode && (
                <button
                  type="button"
                  onClick={() => handleDeleteTestimonial(item.id)}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 mr-6">{item.date}</span>
                </div>

                <EditableElement
                  id={`reviewCardCondition-${item.id}`}
                  label="Condition Tag"
                  type="badge"
                  value={item.condition}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newTest = [...testimonials];
                      newTest[idx] = { ...newTest[idx], condition: value };
                      update({ testimonials: newTest });
                    }
                  }}
                >
                  <h4 className="text-xs font-bold text-sky-800 mb-2">{item.condition}</h4>
                </EditableElement>

                <EditableElement
                  id={`reviewCardComment-${item.id}`}
                  label="Review Text"
                  type="text"
                  value={item.comment}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newTest = [...testimonials];
                      newTest[idx] = { ...newTest[idx], comment: value };
                      update({ testimonials: newTest });
                    }
                  }}
                >
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-4 leading-relaxed">
                    "{item.comment}"
                  </p>
                </EditableElement>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <EditableElement
                  id={`reviewCardAuthor-${item.id}`}
                  label="Patient Name"
                  type="text"
                  value={item.patientName}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newTest = [...testimonials];
                      newTest[idx] = { ...newTest[idx], patientName: value };
                      update({ testimonials: newTest });
                    }
                  }}
                >
                  <span className="text-xs font-bold text-slate-900">{item.patientName}</span>
                </EditableElement>

                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
