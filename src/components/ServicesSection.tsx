import React, { useState } from 'react';
import { DoctorProfile, MedicalService } from '../types/doctor';
import { DynamicIcon } from './icons/DynamicIcon';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Plus,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
} from 'lucide-react';
import { EditableElement } from './visual-builder/EditableElement';
import { useVisualBuilder } from './visual-builder/VisualBuilderContext';

interface ServicesSectionProps {
  profile: DoctorProfile;
  onSelectService: (service: MedicalService) => void;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

const getServiceIcon = (iconName: string) => {
  return <DynamicIcon name={iconName || 'HeartPulse'} className="w-5 h-5 text-sky-600" />;
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  profile,
  onSelectService,
  onUpdateProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { isVisualEditMode, openIconPicker } = useVisualBuilder();

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  const categories = ['All', 'Consultation', 'Interventional', 'Diagnostic', 'Preventive', 'Specialized'];

  const filteredServices =
    selectedCategory === 'All'
      ? profile.services
      : profile.services.filter((s) => s.category === selectedCategory);

  const alignClass =
    profile.servicesAlign === 'center'
      ? 'text-center items-center'
      : profile.servicesAlign === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const handleAddNewService = () => {
    const newService: MedicalService = {
      id: `service-${Date.now()}`,
      title: 'New Clinical Consultation / Procedure',
      category: 'Consultation',
      duration: '45 mins',
      price: '$250',
      description: 'Comprehensive medical assessment, diagnostic review, and personalized care plan.',
      keyBenefits: ['Detailed diagnostic evaluation', 'One-on-one specialist consultation', 'Clear treatment plan'],
      icon: 'Stethoscope',
    };
    update({ services: [...profile.services, newService] });
  };

  const moveService = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= profile.services.length) return;
    const newServices = [...profile.services];
    const [moved] = newServices.splice(idx, 1);
    newServices.splice(targetIdx, 0, moved);
    update({ services: newServices });
  };

  const duplicateService = (service: MedicalService) => {
    const dup: MedicalService = {
      ...service,
      id: `service-${Date.now()}`,
      title: `${service.title} (Copy)`,
    };
    update({ services: [...profile.services, dup] });
  };

  const deleteService = (id: string) => {
    update({ services: profile.services.filter((s) => s.id !== id) });
  };

  return (
    <section id="services" className="py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className={`max-w-2xl flex flex-col ${alignClass}`}>
            <EditableElement
              id="servicesBadge"
              label="Services Section Badge"
              type="badge"
              value={profile.servicesBadge || 'Specialized Procedures & Clinical Programs'}
              alignment={profile.servicesAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { servicesBadge: value } : {}),
                  ...(alignment !== undefined ? { servicesAlign: alignment } : {}),
                });
              }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-100/80 text-sky-900 text-xs font-semibold mb-3 border border-sky-200/60">
                <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                <span>{profile.servicesBadge || 'Specialized Procedures & Clinical Programs'}</span>
              </div>
            </EditableElement>

            <EditableElement
              id="servicesTitle"
              label="Services Section Title"
              type="heading"
              value={profile.servicesTitle || 'Evidence-Based Cardiovascular Care'}
              alignment={profile.servicesAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { servicesTitle: value } : {}),
                  ...(alignment !== undefined ? { servicesAlign: alignment } : {}),
                });
              }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {profile.servicesTitle || 'Evidence-Based Cardiovascular Care'}
              </h2>
            </EditableElement>

            <EditableElement
              id="servicesSubtitle"
              label="Services Section Subtitle"
              type="text"
              value={
                profile.servicesSubtitle ||
                'From routine preventive screening to complex catheter-based structural revascularization, every protocol is tailored to your unique clinical anatomy.'
              }
              alignment={profile.servicesAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { servicesSubtitle: value } : {}),
                  ...(alignment !== undefined ? { servicesAlign: alignment } : {}),
                });
              }}
            >
              <p className="text-slate-600 text-base sm:text-lg mt-3">
                {profile.servicesSubtitle ||
                  'From routine preventive screening to complex catheter-based structural revascularization, every protocol is tailored to your unique clinical anatomy.'}
              </p>
            </EditableElement>
          </div>

          {/* Category Filter Pills & Add Procedure CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5 bg-slate-200/60 p-1.5 rounded-xl self-start md:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-sky-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {isVisualEditMode && (
              <button
                type="button"
                onClick={handleAddNewService}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Procedure</span>
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative"
            >
              {/* Quick Actions in Edit Mode */}
              {isVisualEditMode && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/90 rounded-lg p-1 text-white z-20 shadow-md">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveService(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                    title="Move Left / Earlier"
                  >
                    <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveService(idx, 'down');
                    }}
                    disabled={idx === profile.services.length - 1}
                    className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                    title="Move Right / Later"
                  >
                    <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateService(service);
                    }}
                    className="p-1 hover:bg-slate-800 rounded text-sky-400 cursor-pointer"
                    title="Duplicate Procedure"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteService(service.id);
                    }}
                    className="p-1 hover:bg-rose-950 text-rose-400 rounded cursor-pointer"
                    title="Delete Procedure"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                {/* Header: Icon, Category Badge & Price */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <EditableElement
                    id={`serviceIcon-${service.id}`}
                    label={`${service.title} Icon`}
                    type="badge"
                    value={service.icon || 'HeartPulse'}
                    iconName={service.icon}
                    onUpdate={({ iconName, value }) => {
                      const newServices = profile.services.map((s) =>
                        s.id === service.id ? { ...s, icon: iconName || value || s.icon } : s
                      );
                      update({ services: newServices });
                    }}
                  >
                    <div
                      onClick={(e) => {
                        if (isVisualEditMode) {
                          e.stopPropagation();
                          openIconPicker(service.icon, (selectedIcon: string) => {
                            const newServices = profile.services.map((s) =>
                              s.id === service.id ? { ...s, icon: selectedIcon } : s
                            );
                            update({ services: newServices });
                          });
                        }
                      }}
                      className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform cursor-pointer"
                      title={isVisualEditMode ? 'Click to change icon' : undefined}
                    >
                      {getServiceIcon(service.icon)}
                    </div>
                  </EditableElement>

                  <div className="text-right">
                    <EditableElement
                      id={`serviceCategory-${service.id}`}
                      label="Service Category"
                      type="badge"
                      value={service.category}
                      onUpdate={({ value }) => {
                        if (value !== undefined) {
                          const newServices = profile.services.map((s) =>
                            s.id === service.id ? { ...s, category: value } : s
                          );
                          update({ services: newServices });
                        }
                      }}
                    >
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 mb-1">
                        {service.category}
                      </span>
                    </EditableElement>

                    <EditableElement
                      id={`servicePrice-${service.id}`}
                      label="Service Price"
                      type="text"
                      value={service.price}
                      onUpdate={({ value }) => {
                        if (value !== undefined) {
                          const newServices = profile.services.map((s) =>
                            s.id === service.id ? { ...s, price: value } : s
                          );
                          update({ services: newServices });
                        }
                      }}
                    >
                      <div className="text-xs font-semibold text-slate-600">
                        {service.price}
                      </div>
                    </EditableElement>
                  </div>
                </div>

                {/* Service Title */}
                <EditableElement
                  id={`serviceTitle-${service.id}`}
                  label="Service Title"
                  type="heading"
                  value={service.title}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newServices = profile.services.map((s) =>
                        s.id === service.id ? { ...s, title: value } : s
                      );
                      update({ services: newServices });
                    }
                  }}
                >
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-900 transition-colors">
                    {service.title}
                  </h3>
                </EditableElement>

                {/* Description */}
                <EditableElement
                  id={`serviceDesc-${service.id}`}
                  label="Service Description"
                  type="text"
                  value={service.description}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newServices = profile.services.map((s) =>
                        s.id === service.id ? { ...s, description: value } : s
                      );
                      update({ services: newServices });
                    }
                  }}
                >
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {service.description}
                  </p>
                </EditableElement>

                {/* Key Benefits List */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Key Clinical Highlights:
                  </span>
                  {service.keyBenefits.map((benefit, i) => (
                    <EditableElement
                      key={i}
                      id={`serviceBenefit-${service.id}-${i}`}
                      label={`Highlight #${i + 1}`}
                      type="text"
                      value={benefit}
                      onUpdate={({ value }) => {
                        if (value !== undefined) {
                          const newBenefits = [...service.keyBenefits];
                          newBenefits[i] = value;
                          const newServices = profile.services.map((s) =>
                            s.id === service.id ? { ...s, keyBenefits: newBenefits } : s
                          );
                          update({ services: newServices });
                        }
                      }}
                      onDelete={() => {
                        const newBenefits = service.keyBenefits.filter((_, idx) => idx !== i);
                        const newServices = profile.services.map((s) =>
                          s.id === service.id ? { ...s, keyBenefits: newBenefits } : s
                        );
                        update({ services: newServices });
                      }}
                    >
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    </EditableElement>
                  ))}
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <EditableElement
                  id={`serviceDuration-${service.id}`}
                  label="Service Duration"
                  type="text"
                  value={service.duration}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newServices = profile.services.map((s) =>
                        s.id === service.id ? { ...s, duration: value } : s
                      );
                      update({ services: newServices });
                    }
                  }}
                >
                  <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{service.duration}</span>
                  </div>
                </EditableElement>

                <button
                  onClick={() => onSelectService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 group-hover:translate-x-0.5 transition-all cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* "+ Add Procedure" Card when in Visual Edit Mode */}
          {isVisualEditMode && (
            <button
              type="button"
              onClick={handleAddNewService}
              className="bg-dashed border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 text-sky-700 hover:text-sky-900 hover:bg-sky-50/50 transition-all cursor-pointer min-h-[300px]"
            >
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Add New Procedure / Service</p>
                <p className="text-xs text-slate-500 mt-1">
                  Create a custom medical service card with price, duration, and clinical highlights
                </p>
              </div>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
