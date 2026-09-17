import React, { useState } from 'react';
import { DoctorProfile, CustomSection, SectionElement, ElementType } from '../../types/doctor';
import { DynamicIcon } from '../icons/DynamicIcon';
import { IconPickerModal } from '../icons/IconPickerModal';
import { ImageUploader } from './ImageUploader';
import {
  Layout,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Type,
  Heading,
  Image as ImageIcon,
  Square,
  CreditCard,
  AlertTriangle,
  Minus,
  Tag,
  Copy,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Palette,
  User,
  Stethoscope,
  Clock,
  Camera,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';

export interface PageBuilderTabProps {
  profile: DoctorProfile;
  onUpdateProfile: (updated: DoctorProfile) => void;
  onNavigateTab?: (tabId: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  customSections?: CustomSection[];
  onUpdateSections?: (sections: CustomSection[]) => void;
}

export const PageBuilderTab: React.FC<PageBuilderTabProps> = ({
  profile,
  onUpdateProfile,
  onNavigateTab,
  onShowToast,
  customSections: legacySections,
  onUpdateSections: legacyUpdate,
}) => {
  const currentProfile = profile;
  const customSections = currentProfile?.customSections || legacySections || [];

  const defaultBaseOrder = ['hero', 'about', 'services', 'schedule', 'gallery', 'testimonials'];
  const customIds = customSections.map((s) => s.id);
  const rawOrder =
    currentProfile?.sectionOrder && currentProfile.sectionOrder.length > 0
      ? currentProfile.sectionOrder
      : ['hero', 'about', 'services', ...customIds, 'schedule', 'gallery', 'testimonials'];

  const allKnownIds = [...defaultBaseOrder, ...customIds];
  const activeOrder: string[] = [];
  rawOrder.forEach((id) => {
    if (allKnownIds.includes(id) && !activeOrder.includes(id)) {
      activeOrder.push(id);
    }
  });
  allKnownIds.forEach((id) => {
    if (!activeOrder.includes(id)) {
      activeOrder.push(id);
    }
  });

  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    activeOrder.length > 0 ? activeOrder[0] : null
  );
  const [editingElementId, setEditingElementId] = useState<string | null>(null);

  // Icon picker state
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconTarget, setIconTarget] = useState<{
    sectionId: string;
    elementId: string;
    field: 'buttonIcon' | 'cardIcon' | 'badgeIcon';
    currentVal?: string;
  } | null>(null);

  // Helper to update custom sections
  const updateCustomSections = (newSections: CustomSection[]) => {
    if (onUpdateProfile && currentProfile) {
      onUpdateProfile({ ...currentProfile, customSections: newSections });
    } else if (legacyUpdate) {
      legacyUpdate(newSections);
    }
  };

  const updateSection = (sectionId: string, updater: (sec: CustomSection) => CustomSection) => {
    const updated = customSections.map((s) => (s.id === sectionId ? updater(s) : s));
    updateCustomSections(updated);
  };

  // Reorder in master sectionOrder
  const moveSectionInMasterOrder = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeOrder.length) return;
    const newOrder = [...activeOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    if (onUpdateProfile && currentProfile) {
      onUpdateProfile({ ...currentProfile, sectionOrder: newOrder });
    }
    onShowToast('info', 'Section Sequence Updated', `Section repositioned ${direction} on the live website.`);
  };

  // Toggle Visibility
  const toggleSectionVisibility = (sectionId: string) => {
    if (!currentProfile) return;
    if (defaultBaseOrder.includes(sectionId)) {
      const current = currentProfile.visibility?.[sectionId as keyof typeof currentProfile.visibility] !== false;
      onUpdateProfile({
        ...currentProfile,
        visibility: {
          ...currentProfile.visibility,
          [sectionId]: !current,
        },
      });
      onShowToast('info', 'Visibility Updated', `Section ${current ? 'hidden from page' : 'now visible on page'}.`);
    } else {
      const updated = customSections.map((s) =>
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      );
      updateCustomSections(updated);
      onShowToast('info', 'Visibility Updated', 'Custom section visibility toggled.');
    }
  };

  // Reset to standard recommended layout
  const handleResetOrder = () => {
    if (window.confirm('Reset all sections to the standard recommended medical practice layout?')) {
      const standardOrder = ['hero', 'about', 'services', ...customIds, 'schedule', 'gallery', 'testimonials'];
      if (onUpdateProfile && currentProfile) {
        onUpdateProfile({ ...currentProfile, sectionOrder: standardOrder });
      }
      onShowToast('info', 'Layout Reset', 'Section order restored to standard clinical flow.');
    }
  };

  // Add new Section
  const handleAddNewSection = () => {
    const newId = 'sec-' + Date.now();
    const newSection: CustomSection = {
      id: newId,
      title: 'New Custom Practice Section',
      subtitle: 'Add details, custom buttons, imagery, or formatted text blocks.',
      position: 'after-services',
      backgroundColor: 'white',
      textColor: 'dark',
      paddingY: 'medium',
      containerWidth: 'wide',
      headerAlign: 'left',
      isVisible: true,
      order: customSections.length + 1,
      elements: [
        {
          id: 'el-head-' + Date.now(),
          type: 'heading',
          align: 'left',
          headingText: 'Featured Clinical Program',
          headingLevel: 'h3',
        },
        {
          id: 'el-text-' + Date.now(),
          type: 'text',
          align: 'left',
          textContent:
            'Describe your medical philosophy, advanced surgical procedures, patient guidelines, or upcoming clinical trials.',
          textSize: 'base',
        },
        {
          id: 'el-btn-' + Date.now(),
          type: 'button',
          align: 'left',
          buttonLabel: 'Learn More & Inquire',
          buttonLink: '#schedule',
          buttonIcon: 'ArrowRight',
          buttonVariant: 'primary',
          buttonSize: 'md',
        },
      ],
    };
    const updatedSections = [...customSections, newSection];
    const updatedOrder = [...activeOrder, newId];
    if (onUpdateProfile && currentProfile) {
      onUpdateProfile({
        ...currentProfile,
        customSections: updatedSections,
        sectionOrder: updatedOrder,
      });
    } else if (legacyUpdate) {
      legacyUpdate(updatedSections);
    }
    setExpandedSectionId(newId);
    onShowToast('success', 'New Section Added', 'Custom section created and added to page sequence.');
  };

  // Delete Section
  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('Are you sure you want to remove this custom section?')) {
      const updatedSections = customSections.filter((s) => s.id !== sectionId);
      const updatedOrder = activeOrder.filter((id) => id !== sectionId);
      if (onUpdateProfile && currentProfile) {
        onUpdateProfile({
          ...currentProfile,
          customSections: updatedSections,
          sectionOrder: updatedOrder,
        });
      } else if (legacyUpdate) {
        legacyUpdate(updatedSections);
      }
      if (expandedSectionId === sectionId) {
        setExpandedSectionId(null);
      }
      onShowToast('info', 'Section Removed', 'Section removed from page.');
    }
  };

  // Duplicate Section
  const handleDuplicateSection = (sec: CustomSection) => {
    const cloneId = 'sec-' + Date.now();
    const cloned: CustomSection = {
      ...sec,
      id: cloneId,
      title: `${sec.title} (Copy)`,
      elements: sec.elements.map((el) => ({
        ...el,
        id: 'el-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      })),
    };
    const currentIdx = activeOrder.indexOf(sec.id);
    const newOrder = [...activeOrder];
    if (currentIdx !== -1) {
      newOrder.splice(currentIdx + 1, 0, cloneId);
    } else {
      newOrder.push(cloneId);
    }
    if (onUpdateProfile && currentProfile) {
      onUpdateProfile({
        ...currentProfile,
        customSections: [...customSections, cloned],
        sectionOrder: newOrder,
      });
    }
    setExpandedSectionId(cloneId);
    onShowToast('success', 'Section Duplicated', 'Cloned section created and placed in page order.');
  };

  // Get Prebuilt Section Meta
  const getPrebuiltSectionMeta = (id: string) => {
    if (!currentProfile) {
      return { title: id, subtitle: '', tab: 'hero', tabName: id, icon: Layout };
    }
    switch (id) {
      case 'hero':
        return {
          title: 'Hero & Practice Intro',
          subtitle: currentProfile.heroHeadline || 'Hero banner, physician credentials, and practice metrics',
          tab: 'hero',
          tabName: 'Hero & Intro',
          icon: Sparkles,
        };
      case 'about':
        return {
          title: currentProfile.aboutTitle || 'Physician Profile & Education',
          subtitle: currentProfile.aboutSubtitle || 'Biography, fellowship training, and philosophy quote',
          tab: 'about',
          tabName: 'Physician Profile',
          icon: User,
        };
      case 'services':
        return {
          title: currentProfile.servicesTitle || 'Clinical Services & Procedures',
          subtitle: currentProfile.servicesSubtitle || `${currentProfile.services?.length || 0} specialized procedures available`,
          tab: 'services',
          tabName: 'Clinical Services',
          icon: Stethoscope,
        };
      case 'schedule':
        return {
          title: currentProfile.scheduleTitle || 'Clinic Location & Hours',
          subtitle: currentProfile.scheduleSubtitle || 'Consultation hours and appointment scheduling',
          tab: 'clinic',
          tabName: 'Clinic & Hours',
          icon: Clock,
        };
      case 'gallery':
        return {
          title: currentProfile.galleryTitle || 'Facility Tour & Gallery',
          subtitle: currentProfile.gallerySubtitle || `${currentProfile.gallery?.length || 0} facility photos uploaded`,
          tab: 'gallery',
          tabName: 'Facility Tour',
          icon: Camera,
        };
      case 'testimonials':
        return {
          title: currentProfile.testimonialsTitle || 'Patient Reviews & Testimonials',
          subtitle: currentProfile.testimonialsSubtitle || `${currentProfile.testimonials?.length || 0} verified patient reviews`,
          tab: 'testimonials',
          tabName: 'Patient Reviews',
          icon: MessageSquare,
        };
      default:
        return {
          title: 'Section',
          subtitle: '',
          tab: 'hero',
          tabName: 'Section',
          icon: Layout,
        };
    }
  };

  // Render Prebuilt Quick Content Editor
  const renderPrebuiltEditor = (secId: string) => {
    if (!currentProfile || !onUpdateProfile) return null;
    const meta = getPrebuiltSectionMeta(secId);

    return (
      <div className="p-6 bg-white space-y-5 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
              Pre-Built Section Quick Editor
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the live badges, headings, and descriptions for this core section.
            </p>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab(meta.tab)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Dedicated {meta.tabName} Tab</span>
            </button>
          )}
        </div>

        {/* HERO SECTION */}
        {secId === 'hero' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={currentProfile.heroHeadline || ''}
                onChange={(e) =>
                  onUpdateProfile({ ...currentProfile, heroHeadline: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Subheadline / Value Proposition
              </label>
              <textarea
                rows={2}
                value={currentProfile.heroSubheadline || ''}
                onChange={(e) =>
                  onUpdateProfile({ ...currentProfile, heroSubheadline: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credential / Verification Badge Text
                </label>
                <input
                  type="text"
                  value={currentProfile.credentialsBadge || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, credentialsBadge: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CTA Phone Button Label
                </label>
                <input
                  type="text"
                  value={currentProfile.heroPhoneCtaLabel || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, heroPhoneCtaLabel: e.target.value })
                  }
                  placeholder="Call Office"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block mb-2">
                Four Practice Statistics
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <input
                    type="text"
                    value={currentProfile.heroStat1Value || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat1Value: e.target.value })}
                    placeholder="Value (e.g. 5,000+)"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                  />
                  <input
                    type="text"
                    value={currentProfile.heroStat1Label || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat1Label: e.target.value })}
                    placeholder="Label"
                    className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded mt-1"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={currentProfile.heroStat2Value || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat2Value: e.target.value })}
                    placeholder="Value (e.g. 99.4%)"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                  />
                  <input
                    type="text"
                    value={currentProfile.heroStat2Label || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat2Label: e.target.value })}
                    placeholder="Label"
                    className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded mt-1"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={currentProfile.heroStat3Value || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat3Value: e.target.value })}
                    placeholder="Value (e.g. 18+)"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                  />
                  <input
                    type="text"
                    value={currentProfile.heroStat3Label || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat3Label: e.target.value })}
                    placeholder="Label"
                    className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded mt-1"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={currentProfile.heroStat4Value || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat4Value: e.target.value })}
                    placeholder="Value (e.g. 40+)"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                  />
                  <input
                    type="text"
                    value={currentProfile.heroStat4Label || ''}
                    onChange={(e) => onUpdateProfile({ ...currentProfile, heroStat4Label: e.target.value })}
                    placeholder="Label"
                    className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT SECTION */}
        {secId === 'about' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={currentProfile.aboutBadge || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, aboutBadge: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={currentProfile.aboutTitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, aboutTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={currentProfile.aboutSubtitle || ''}
                onChange={(e) =>
                  onUpdateProfile({ ...currentProfile, aboutSubtitle: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Philosophy Box Title
                </label>
                <input
                  type="text"
                  value={currentProfile.aboutPhilosophyTitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, aboutPhilosophyTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Philosophy Quote Text
                </label>
                <input
                  type="text"
                  value={currentProfile.aboutPhilosophyQuote || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, aboutPhilosophyQuote: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* CLINICAL SERVICES SECTION */}
        {secId === 'services' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={currentProfile.servicesBadge || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, servicesBadge: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={currentProfile.servicesTitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, servicesTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={currentProfile.servicesSubtitle || ''}
                onChange={(e) =>
                  onUpdateProfile({ ...currentProfile, servicesSubtitle: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                Configured: <strong>{currentProfile.services?.length || 0} procedures</strong>
              </span>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('services')}
                  className="text-sky-600 font-bold hover:underline"
                >
                  Manage / Add / Remove Procedures &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* CLINIC & HOURS SECTION */}
        {secId === 'schedule' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={currentProfile.scheduleBadge || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, scheduleBadge: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={currentProfile.scheduleTitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, scheduleTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Subtitle / Description
                </label>
                <input
                  type="text"
                  value={currentProfile.scheduleSubtitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, scheduleSubtitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Hours Card Title
                </label>
                <input
                  type="text"
                  value={currentProfile.scheduleHoursTitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, scheduleHoursTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* FACILITY TOUR & GALLERY SECTION */}
        {secId === 'gallery' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={currentProfile.galleryBadge || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, galleryBadge: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={currentProfile.galleryTitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, galleryTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={currentProfile.gallerySubtitle || ''}
                onChange={(e) =>
                  onUpdateProfile({ ...currentProfile, gallerySubtitle: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        )}

        {/* PATIENT REVIEWS & TESTIMONIALS SECTION */}
        {secId === 'testimonials' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={currentProfile.testimonialsBadge || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, testimonialsBadge: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={currentProfile.testimonialsTitle || ''}
                  onChange={(e) =>
                    onUpdateProfile({ ...currentProfile, testimonialsTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={currentProfile.testimonialsSubtitle || ''}
                onChange={(e) =>
                  onUpdateProfile({ ...currentProfile, testimonialsSubtitle: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add Element to Section
  const handleAddElement = (sectionId: string, type: ElementType) => {
    const newElId = 'el-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    let newEl: SectionElement = {
      id: newElId,
      type,
      align: 'left',
    };

    if (type === 'heading') {
      newEl.headingText = 'New Heading Title';
      newEl.headingLevel = 'h3';
      newEl.headingColor = '#0f172a';
    } else if (type === 'text') {
      newEl.textContent = 'Write your custom paragraph description or medical guidelines here.';
      newEl.textSize = 'base';
      newEl.textColor = '#475569';
    } else if (type === 'button') {
      newEl.buttonLabel = 'Explore Clinical Services';
      newEl.buttonLink = '#services';
      newEl.buttonIcon = 'ArrowRight';
      newEl.buttonVariant = 'primary';
      newEl.buttonSize = 'md';
    } else if (type === 'html') {
      newEl.customHtml =
        '<div style="padding: 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; text-align: center;">\n  <h4 style="margin: 0 0 8px 0; color: #0369a1; font-weight: bold;">Custom Interactive Button / HTML</h4>\n  <button style="background: #0284c7; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;" onclick="alert(\'Custom Button Clicked!\')">\n    ✨ Click Me (Custom Code)\n  </button>\n</div>';
    } else if (type === 'image') {
      newEl.imageAlt = 'Clinical Facility';
      newEl.imageMaxWidth = 'md';
      newEl.imageRounded = 'xl';
    } else if (type === 'card') {
      newEl.cardTitle = 'Advanced Cardiac Diagnostics';
      newEl.cardDescription = 'Non-invasive stress testing, 3D echocardiography, and Holter monitoring.';
      newEl.cardIcon = 'HeartPulse';
      newEl.cardBadge = 'Same Day';
    } else if (type === 'alert') {
      newEl.alertTitle = 'Notice for Scheduled Patients';
      newEl.alertMessage = 'Please arrive 15 minutes early with your photo ID and insurance cards.';
      newEl.alertVariant = 'info';
    } else if (type === 'divider') {
      newEl.dividerStyle = 'line';
      newEl.dividerHeight = 32;
    } else if (type === 'badge') {
      newEl.badgeText = 'Board Certified Specialist';
      newEl.badgeColor = 'sky';
      newEl.badgeIcon = 'Award';
    }

    updateSection(sectionId, (sec) => ({
      ...sec,
      elements: [...sec.elements, newEl],
    }));
    setEditingElementId(newElId);
    onShowToast('success', 'Element Added', `Added new ${type} element.`);
  };

  // Move Element Up/Down
  const moveElement = (sectionId: string, elIndex: number, direction: 'up' | 'down') => {
    updateSection(sectionId, (sec) => {
      const targetIdx = direction === 'up' ? elIndex - 1 : elIndex + 1;
      if (targetIdx < 0 || targetIdx >= sec.elements.length) return sec;
      const copy = [...sec.elements];
      const temp = copy[elIndex];
      copy[elIndex] = copy[targetIdx];
      copy[targetIdx] = temp;
      return { ...sec, elements: copy };
    });
  };

  // Duplicate Element
  const duplicateElement = (sectionId: string, elIndex: number) => {
    updateSection(sectionId, (sec) => {
      const copy = [...sec.elements];
      const target = copy[elIndex];
      const cloned: SectionElement = {
        ...target,
        id: 'el-clone-' + Date.now(),
      };
      copy.splice(elIndex + 1, 0, cloned);
      return { ...sec, elements: copy };
    });
    onShowToast('info', 'Element Duplicated', 'Duplicated element created.');
  };

  // Delete Element
  const deleteElement = (sectionId: string, elIndex: number) => {
    updateSection(sectionId, (sec) => ({
      ...sec,
      elements: sec.elements.filter((_, i) => i !== elIndex),
    }));
    onShowToast('info', 'Element Removed', 'Element deleted from section.');
  };

  // Open Icon Picker for an element field
  const handleOpenIconPicker = (
    sectionId: string,
    elementId: string,
    field: 'buttonIcon' | 'cardIcon' | 'badgeIcon',
    currentVal?: string
  ) => {
    setIconTarget({ sectionId, elementId, field, currentVal });
    setIsIconPickerOpen(true);
  };

  const handleIconSelected = (iconName: string) => {
    if (!iconTarget) return;
    const { sectionId, elementId, field } = iconTarget;
    updateSection(sectionId, (sec) => ({
      ...sec,
      elements: sec.elements.map((el) => {
        if (el.id === elementId) {
          return { ...el, [field]: iconName };
        }
        return el;
      }),
    }));
    onShowToast('success', 'Icon Assigned', `Applied icon: ${iconName}`);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-50 text-sky-800 text-xs font-bold mb-1">
            <Layout className="w-3.5 h-3.5" />
            <span>WordPress-Style Modular Page Builder & Master Arranger</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Arrange Page Flow, Edit Every Section & Insert Custom Elements
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Reorder any section on the site with Up/Down buttons, toggle visibility, customize titles/badges, or add brand-new custom sections featuring 500+ vector icons, buttons, Base64 images, and custom HTML widgets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetOrder}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Reset to recommended clinical flow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Layout</span>
          </button>

          <button
            type="button"
            onClick={handleAddNewSection}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Section</span>
          </button>
        </div>
      </div>

      {/* Sections Master Sequence List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live Page Architecture ({activeOrder.length} Sections Total)
          </span>
          <span className="text-xs text-slate-400">
            Use ▲ ▼ buttons to rearrange display sequence on website
          </span>
        </div>

        {activeOrder.map((secId, secIdx) => {
          const isPrebuilt = defaultBaseOrder.includes(secId);
          const isExpanded = expandedSectionId === secId;

          // PRE-BUILT CORE SECTION
          if (isPrebuilt) {
            const meta = getPrebuiltSectionMeta(secId);
            const isVisible =
              currentProfile?.visibility?.[secId as keyof typeof currentProfile.visibility] !== false;
            const IconComp = meta.icon;

            return (
              <div
                key={secId}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-sky-300 shadow-md ring-1 ring-sky-300/50'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50/40 via-white to-slate-50/40 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => setExpandedSectionId(isExpanded ? null : secId)}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-sky-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{secIdx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {meta.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase tracking-wider">
                          Core Practice Section
                        </span>
                      </div>
                      {meta.subtitle && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{meta.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Prebuilt Section Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={secIdx === 0}
                      onClick={() => moveSectionInMasterOrder(secIdx, 'up')}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-600 cursor-pointer"
                      title="Move Up on Page"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={secIdx === activeOrder.length - 1}
                      onClick={() => moveSectionInMasterOrder(secIdx, 'down')}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-600 cursor-pointer"
                      title="Move Down on Page"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(secId)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isVisible
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-slate-100 text-slate-400'
                      }`}
                      title={isVisible ? 'Section Visible' : 'Section Hidden'}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedSectionId(isExpanded ? null : secId)}
                      className="px-2.5 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100 cursor-pointer"
                    >
                      {isExpanded ? 'Close' : 'Quick Edit'}
                    </button>
                  </div>
                </div>

                {/* Prebuilt Body */}
                {isExpanded && renderPrebuiltEditor(secId)}
              </div>
            );
          }

          // CUSTOM MODULAR SECTION
          const sec = customSections.find((s) => s.id === secId);
          if (!sec) return null;

          return (
            <div
              key={sec.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-emerald-300 shadow-md ring-1 ring-emerald-300/50'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Section Summary Header Bar */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/40 via-white to-slate-50/40 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                    className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Layout className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{secIdx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {sec.title || 'Untitled Custom Section'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        PageBuilder Custom
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {sec.elements.length} Elements
                      </span>
                      {sec.backgroundColor === 'custom' ? (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"
                          style={{ backgroundColor: sec.customBgHex || '#ffffff' }}
                          title={`Custom Bg: ${sec.customBgHex}`}
                        />
                      ) : (
                        <span className="text-[10px] text-slate-500 capitalize">
                          Bg: {sec.backgroundColor}
                        </span>
                      )}
                    </div>
                    {sec.subtitle && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{sec.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Section Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  {/* Move Up/Down */}
                  <button
                    type="button"
                    disabled={secIdx === 0}
                    onClick={() => moveSectionInMasterOrder(secIdx, 'up')}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-600 cursor-pointer"
                    title="Move Section Up in Website Order"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={secIdx === activeOrder.length - 1}
                    onClick={() => moveSectionInMasterOrder(secIdx, 'down')}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-600 cursor-pointer"
                    title="Move Section Down in Website Order"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Visibility */}
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      sec.isVisible
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-100 text-slate-400'
                    }`}
                    title={sec.isVisible ? 'Section Visible' : 'Section Hidden'}
                  >
                    {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Duplicate Section */}
                  <button
                    type="button"
                    onClick={() => handleDuplicateSection(sec)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Duplicate Section"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Section */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec.id)}
                    className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Expand / Edit Elements */}
                  <button
                    type="button"
                    onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                    className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 cursor-pointer"
                  >
                    {isExpanded ? 'Close' : 'Design Elements'}
                  </button>
                </div>
              </div>

              {/* Section Body (Visible when expanded) */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    
                    {/* Section Settings Block */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Section Layout & Style Settings
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({ ...s, title: e.target.value }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Section Subtitle / Description
                          </label>
                          <input
                            type="text"
                            value={sec.subtitle || ''}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({ ...s, subtitle: e.target.value }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Position */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Position on Page
                          </label>
                          <select
                            value={sec.position}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({ ...s, position: e.target.value as any }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                          >
                            <option value="after-hero">After Hero</option>
                            <option value="after-about">After About Bio</option>
                            <option value="after-services">After Services</option>
                            <option value="after-schedule">After Schedule</option>
                            <option value="after-gallery">After Gallery</option>
                            <option value="after-testimonials">After Reviews</option>
                            <option value="before-footer">Before Footer</option>
                          </select>
                        </div>

                        {/* Background Color */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Background Style
                          </label>
                          <select
                            value={sec.backgroundColor}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({
                                ...s,
                                backgroundColor: e.target.value as any,
                              }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                          >
                            <option value="white">Pure White</option>
                            <option value="slate">Light Slate / Soft Neutral</option>
                            <option value="sky">Medical Sky Tint</option>
                            <option value="dark">Deep Navy / Dark Theme</option>
                            <option value="custom">Custom Color Picker</option>
                          </select>
                        </div>

                        {/* Padding Y */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Vertical Spacing
                          </label>
                          <select
                            value={sec.paddingY}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({ ...s, paddingY: e.target.value as any }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                          >
                            <option value="none">No Padding</option>
                            <option value="small">Compact (Small)</option>
                            <option value="medium">Standard (Medium)</option>
                            <option value="large">Spacious (Large)</option>
                          </select>
                        </div>

                        {/* Container Width */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Max Width
                          </label>
                          <select
                            value={sec.containerWidth}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({
                                ...s,
                                containerWidth: e.target.value as any,
                              }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                          >
                            <option value="narrow">Narrow (Centered Form/Post)</option>
                            <option value="normal">Standard (Normal)</option>
                            <option value="wide">Wide (Spacious 7XL)</option>
                            <option value="full">Full Bleed</option>
                          </select>
                        </div>
                      </div>

                      {/* Custom Hex picker if selected */}
                      {sec.backgroundColor === 'custom' && (
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-slate-200">
                          <Palette className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-semibold text-slate-700">Custom Color:</span>
                          <input
                            type="color"
                            value={sec.customBgHex || '#ffffff'}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({ ...s, customBgHex: e.target.value }))
                            }
                            className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={sec.customBgHex || '#ffffff'}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({ ...s, customBgHex: e.target.value }))
                            }
                            className="w-24 px-2 py-1 rounded border border-slate-300 text-xs font-mono"
                          />
                          <span className="text-xs text-slate-500 ml-2">Text Contrast:</span>
                          <select
                            value={sec.textColor || 'dark'}
                            onChange={(e) =>
                              updateSection(sec.id, (s) => ({ ...s, textColor: e.target.value as any }))
                            }
                            className="px-2 py-1 rounded border border-slate-300 text-xs font-medium"
                          >
                            <option value="dark">Dark Text</option>
                            <option value="light">Light / White Text</option>
                          </select>
                        </div>
                      )}

                      {/* Header Alignment Controls */}
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-xs font-semibold text-slate-600">Header Alignment:</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() =>
                                updateSection(sec.id, (s) => ({ ...s, headerAlign: align }))
                              }
                              className={`px-2.5 py-1 rounded text-xs font-semibold capitalize flex items-center gap-1 transition-colors ${
                                sec.headerAlign === align
                                  ? 'bg-sky-600 text-white'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-3 h-3" />}
                              {align === 'center' && <AlignCenter className="w-3 h-3" />}
                              {align === 'right' && <AlignRight className="w-3 h-3" />}
                              <span>{align}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section Elements Stack */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Section Elements ({sec.elements.length})
                        </span>
                        <span className="text-xs text-slate-500">
                          Add, center align, customize or reorder below
                        </span>
                      </div>

                      {/* Add Element Toolbar Buttons */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 block mb-2">
                          + INSERT NEW ELEMENT INTO SECTION:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'heading')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <Heading className="w-3.5 h-3.5 text-sky-600" />
                            <span>Heading</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'text')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <Type className="w-3.5 h-3.5 text-sky-600" />
                            <span>Text / Paragraph</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'button')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <Square className="w-3.5 h-3.5 text-sky-600" />
                            <span>Button with Icon</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'html')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 hover:border-amber-400 text-amber-900 text-xs font-bold transition-colors shadow-2xs"
                          >
                            <Code className="w-3.5 h-3.5 text-amber-600" />
                            <span>Custom Button / HTML Code</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'image')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                            <span>Image</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'card')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                            <span>Feature Card</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'alert')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Alert Box</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'divider')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-500" />
                            <span>Divider</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddElement(sec.id, 'badge')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                          >
                            <Tag className="w-3.5 h-3.5 text-sky-600" />
                            <span>Badge Tag</span>
                          </button>
                        </div>
                      </div>

                      {/* Elements List */}
                      {sec.elements.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                          No elements in this section yet. Click a button above to add a Heading, Text, Button, or HTML!
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {sec.elements.map((el, elIdx) => {
                            const isEditing = editingElementId === el.id;
                            return (
                              <div
                                key={el.id}
                                className={`rounded-xl border transition-all ${
                                  isEditing
                                    ? 'bg-white border-sky-400 shadow-sm ring-1 ring-sky-300'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {/* Element Title & Controls Bar */}
                                <div className="p-3 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center">
                                      {elIdx + 1}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                      {el.type}
                                    </span>
                                    {/* Brief snippet preview */}
                                    <span className="text-xs text-slate-400 truncate max-w-xs hidden sm:inline">
                                      {el.headingText ||
                                        el.textContent ||
                                        el.buttonLabel ||
                                        el.cardTitle ||
                                        el.badgeText ||
                                        (el.type === 'html' ? 'Custom HTML Code' : '')}
                                    </span>
                                  </div>

                                  {/* Alignment Selector for every single element */}
                                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                                    {(['left', 'center', 'right'] as const).map((al) => (
                                      <button
                                        key={al}
                                        type="button"
                                        onClick={() =>
                                          updateSection(sec.id, (s) => ({
                                            ...s,
                                            elements: s.elements.map((e, idx) =>
                                              idx === elIdx ? { ...e, align: al } : e
                                            ),
                                          }))
                                        }
                                        className={`p-1 rounded text-xs transition-colors ${
                                          el.align === al
                                            ? 'bg-sky-600 text-white'
                                            : 'text-slate-500 hover:bg-slate-100'
                                        }`}
                                        title={`Align ${al}`}
                                      >
                                        {al === 'left' && <AlignLeft className="w-3 h-3" />}
                                        {al === 'center' && <AlignCenter className="w-3 h-3" />}
                                        {al === 'right' && <AlignRight className="w-3 h-3" />}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Actions: Move, Duplicate, Delete */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      disabled={elIdx === 0}
                                      onClick={() => moveElement(sec.id, elIdx, 'up')}
                                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                      title="Move Up"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={elIdx === sec.elements.length - 1}
                                      onClick={() => moveElement(sec.id, elIdx, 'down')}
                                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                      title="Move Down"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => duplicateElement(sec.id, elIdx)}
                                      className="p-1 rounded text-slate-400 hover:text-sky-600"
                                      title="Duplicate Element"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteElement(sec.id, elIdx)}
                                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                                      title="Delete Element"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Element Customization Form */}
                                <div className="p-4 space-y-3">
                                  {/* 1. HEADING */}
                                  {el.type === 'heading' && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div className="sm:col-span-3">
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Heading Text
                                          </label>
                                          <input
                                            type="text"
                                            value={el.headingText || ''}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, headingText: e.target.value } : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Heading Level
                                          </label>
                                          <select
                                            value={el.headingLevel || 'h3'}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx
                                                    ? { ...item, headingLevel: e.target.value as any }
                                                    : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                                          >
                                            <option value="h1">H1 (Large Display)</option>
                                            <option value="h2">H2 (Section Header)</option>
                                            <option value="h3">H3 (Subheader)</option>
                                            <option value="h4">H4 (Compact Title)</option>
                                          </select>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <label className="text-[11px] font-semibold text-slate-600">
                                          Text Color:
                                        </label>
                                        <input
                                          type="color"
                                          value={el.headingColor || '#0f172a'}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx ? { ...item, headingColor: e.target.value } : item
                                              ),
                                            }))
                                          }
                                          className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                                        />
                                        <span className="text-[10px] font-mono text-slate-500">
                                          {el.headingColor || '#0f172a'}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* 2. TEXT / PARAGRAPH */}
                                  {el.type === 'text' && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Paragraph Content
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={el.textContent || ''}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx ? { ...item, textContent: e.target.value } : item
                                              ),
                                            }))
                                          }
                                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                                        />
                                      </div>

                                      <div className="flex flex-wrap items-center gap-4">
                                        <div>
                                          <label className="text-[11px] font-semibold text-slate-600 mr-2">
                                            Font Size:
                                          </label>
                                          <select
                                            value={el.textSize || 'base'}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, textSize: e.target.value as any } : item
                                                ),
                                              }))
                                            }
                                            className="px-2 py-1 rounded border border-slate-300 text-xs"
                                          >
                                            <option value="xs">Extra Small (12px)</option>
                                            <option value="sm">Small (14px)</option>
                                            <option value="base">Standard (16px)</option>
                                            <option value="lg">Large (18px)</option>
                                            <option value="xl">Lead Text (20px)</option>
                                            <option value="2xl">Prominent (24px)</option>
                                          </select>
                                        </div>

                                        <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={!!el.isBold}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, isBold: e.target.checked } : item
                                                ),
                                              }))
                                            }
                                            className="w-3.5 h-3.5 rounded text-sky-600"
                                          />
                                          <span className="font-bold">Bold</span>
                                        </label>

                                        <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={!!el.isItalic}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, isItalic: e.target.checked } : item
                                                ),
                                              }))
                                            }
                                            className="w-3.5 h-3.5 rounded text-sky-600"
                                          />
                                          <span className="italic">Italic</span>
                                        </label>
                                      </div>
                                    </div>
                                  )}

                                  {/* 3. BUTTON WITH ICON (500+ Icons) */}
                                  {el.type === 'button' && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Button Label Text
                                          </label>
                                          <input
                                            type="text"
                                            value={el.buttonLabel || ''}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, buttonLabel: e.target.value } : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Target URL / Link (Use #book for consultation popup)
                                          </label>
                                          <input
                                            type="text"
                                            value={el.buttonLink || ''}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, buttonLink: e.target.value } : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                                          />
                                        </div>
                                      </div>

                                      {/* Icon Selection & Button Styling */}
                                      <div className="flex flex-wrap items-center gap-3 pt-1">
                                        {/* Icon Selector Button */}
                                        <div className="flex items-center gap-2">
                                          <span className="text-[11px] font-semibold text-slate-600">Button Icon:</span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleOpenIconPicker(sec.id, el.id, 'buttonIcon', el.buttonIcon)
                                            }
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors"
                                          >
                                            {el.buttonIcon ? (
                                              <>
                                                <DynamicIcon name={el.buttonIcon} className="w-4 h-4 text-sky-600" />
                                                <span className="font-mono text-[11px]">{el.buttonIcon}</span>
                                              </>
                                            ) : (
                                              <span>Browse 500+ Vector Icons...</span>
                                            )}
                                          </button>
                                          {el.buttonIcon && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                updateSection(sec.id, (s) => ({
                                                  ...s,
                                                  elements: s.elements.map((item, idx) =>
                                                    idx === elIdx ? { ...item, buttonIcon: '' } : item
                                                  ),
                                                }))
                                              }
                                              className="text-xs text-rose-500 hover:text-rose-700"
                                            >
                                              Clear
                                            </button>
                                          )}
                                        </div>

                                        {/* Variant */}
                                        <div className="flex items-center gap-2">
                                          <span className="text-[11px] font-semibold text-slate-600">Color Style:</span>
                                          <select
                                            value={el.buttonVariant || 'primary'}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx
                                                    ? { ...item, buttonVariant: e.target.value as any }
                                                    : item
                                                ),
                                              }))
                                            }
                                            className="px-2.5 py-1 rounded border border-slate-300 text-xs font-medium"
                                          >
                                            <option value="primary">Primary Sky Blue</option>
                                            <option value="secondary">Slate Navy</option>
                                            <option value="emerald">Emerald Green</option>
                                            <option value="amber">Amber Gold</option>
                                            <option value="danger">Rose Emergency</option>
                                            <option value="outline">Outline Border</option>
                                            <option value="ghost">Ghost Text Only</option>
                                            <option value="custom">Custom Hex Colors</option>
                                          </select>
                                        </div>

                                        {/* Size */}
                                        <div className="flex items-center gap-2">
                                          <span className="text-[11px] font-semibold text-slate-600">Size:</span>
                                          <select
                                            value={el.buttonSize || 'md'}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, buttonSize: e.target.value as any } : item
                                                ),
                                              }))
                                            }
                                            className="px-2 py-1 rounded border border-slate-300 text-xs"
                                          >
                                            <option value="sm">Small</option>
                                            <option value="md">Medium</option>
                                            <option value="lg">Large CTA</option>
                                          </select>
                                        </div>
                                      </div>

                                      {/* Custom hex colors if selected */}
                                      {el.buttonVariant === 'custom' && (
                                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-600 font-medium">Bg Color:</span>
                                            <input
                                              type="color"
                                              value={el.buttonCustomBg || '#0284c7'}
                                              onChange={(e) =>
                                                updateSection(sec.id, (s) => ({
                                                  ...s,
                                                  elements: s.elements.map((item, idx) =>
                                                    idx === elIdx ? { ...item, buttonCustomBg: e.target.value } : item
                                                  ),
                                                }))
                                              }
                                              className="w-7 h-7 rounded border cursor-pointer"
                                            />
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-600 font-medium">Text Color:</span>
                                            <input
                                              type="color"
                                              value={el.buttonCustomTextColor || '#ffffff'}
                                              onChange={(e) =>
                                                updateSection(sec.id, (s) => ({
                                                  ...s,
                                                  elements: s.elements.map((item, idx) =>
                                                    idx === elIdx
                                                      ? { ...item, buttonCustomTextColor: e.target.value }
                                                      : item
                                                  ),
                                                }))
                                              }
                                              className="w-7 h-7 rounded border cursor-pointer"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* 4. CUSTOM BUTTON WITH HTML CODE / RAW HTML EMBED */}
                                  {el.type === 'html' && (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                                          <Code className="w-3.5 h-3.5 text-amber-600" />
                                          <span>Custom Button / Raw HTML Code Snippet</span>
                                        </label>
                                        <span className="text-[11px] text-slate-500">
                                          Accepts HTML, inline styles, buttons, onclick handlers & links
                                        </span>
                                      </div>

                                      <textarea
                                        rows={4}
                                        value={el.customHtml || ''}
                                        onChange={(e) =>
                                          updateSection(sec.id, (s) => ({
                                            ...s,
                                            elements: s.elements.map((item, idx) =>
                                              idx === elIdx ? { ...item, customHtml: e.target.value } : item
                                            ),
                                          }))
                                        }
                                        placeholder="<button class='...' onclick='...'>Custom Button</button>"
                                        className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/30 text-xs font-mono focus:ring-2 focus:ring-amber-500"
                                      />

                                      {/* Quick Presets for Custom Button / HTML */}
                                      <div className="flex flex-wrap gap-1.5 text-xs">
                                        <span className="text-[11px] font-semibold text-slate-500 py-1">Presets:</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const code =
                                              '<div style="text-align:center;"><button style="background: linear-gradient(135deg, #0284c7, #0f172a); color: white; border: none; padding: 12px 28px; border-radius: 9999px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(2,132,199,0.3); cursor: pointer;" onclick="alert(\'VIP Rapid Consult: Connected to on-call cardiologist triage.\')">⚡ Instant VIP Triage Hotline</button></div>';
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx ? { ...item, customHtml: code } : item
                                              ),
                                            }));
                                          }}
                                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
                                        >
                                          Gradient VIP Button
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const code =
                                              '<div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">\n  <span style="background:#e0f2fe; color:#0369a1; padding:6px 14px; border-radius:8px; font-weight:bold; font-size:12px;">🛡️ Medicare Accepted</span>\n  <span style="background:#dcfce7; color:#15803d; padding:6px 14px; border-radius:8px; font-weight:bold; font-size:12px;">✓ BlueCross In-Network</span>\n  <span style="background:#fef3c7; color:#b45309; padding:6px 14px; border-radius:8px; font-weight:bold; font-size:12px;">⭐ Aetna Preferred</span>\n</div>';
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx ? { ...item, customHtml: code } : item
                                              ),
                                            }));
                                          }}
                                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
                                        >
                                          Insurance Badges Row
                                        </button>
                                      </div>

                                      {/* Live Code Preview */}
                                      {el.customHtml && (
                                        <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                            Live Output Preview:
                                          </span>
                                          <div
                                            className="p-2 bg-white rounded border border-slate-200"
                                            dangerouslySetInnerHTML={{ __html: el.customHtml }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* 5. IMAGE */}
                                  {el.type === 'image' && (
                                    <div className="space-y-3">
                                      <ImageUploader
                                        label="Section Image"
                                        sublabel="Upload clinic procedure, diagram, or certificate. Base64 canvas compressed."
                                        currentImageBase64={el.imageBase64}
                                        onImageReady={(base64) => {
                                          updateSection(sec.id, (s) => ({
                                            ...s,
                                            elements: s.elements.map((item, idx) =>
                                              idx === elIdx ? { ...item, imageBase64: base64 } : item
                                            ),
                                          }));
                                          onShowToast('success', 'Image Uploaded', 'Section image updated.');
                                        }}
                                        onRemoveImage={() => {
                                          updateSection(sec.id, (s) => ({
                                            ...s,
                                            elements: s.elements.map((item, idx) =>
                                              idx === elIdx ? { ...item, imageBase64: '' } : item
                                            ),
                                          }));
                                        }}
                                      />

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Image Caption
                                          </label>
                                          <input
                                            type="text"
                                            value={el.imageCaption || ''}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, imageCaption: e.target.value } : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Max Width
                                          </label>
                                          <select
                                            value={el.imageMaxWidth || 'md'}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx
                                                    ? { ...item, imageMaxWidth: e.target.value as any }
                                                    : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs"
                                          >
                                            <option value="xs">Extra Small (max 320px)</option>
                                            <option value="sm">Small (max 384px)</option>
                                            <option value="md">Medium (max 448px)</option>
                                            <option value="lg">Large (max 512px)</option>
                                            <option value="full">Full Width</option>
                                          </select>
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Rounded Corners
                                          </label>
                                          <select
                                            value={el.imageRounded || 'xl'}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx
                                                    ? { ...item, imageRounded: e.target.value as any }
                                                    : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs"
                                          >
                                            <option value="none">Square / No Radius</option>
                                            <option value="md">Medium (8px)</option>
                                            <option value="xl">Card Rounded (16px)</option>
                                            <option value="full">Circular / Pill</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* 6. FEATURE CARD */}
                                  {el.type === 'card' && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Card Title
                                          </label>
                                          <input
                                            type="text"
                                            value={el.cardTitle || ''}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, cardTitle: e.target.value } : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Card Badge Tag
                                          </label>
                                          <input
                                            type="text"
                                            value={el.cardBadge || ''}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, cardBadge: e.target.value } : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Card Description
                                        </label>
                                        <textarea
                                          rows={2}
                                          value={el.cardDescription || ''}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx ? { ...item, cardDescription: e.target.value } : item
                                              ),
                                            }))
                                          }
                                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                                        />
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-semibold text-slate-600">Card Icon:</span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenIconPicker(sec.id, el.id, 'cardIcon', el.cardIcon)
                                          }
                                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold"
                                        >
                                          {el.cardIcon ? (
                                            <>
                                              <DynamicIcon name={el.cardIcon} className="w-4 h-4 text-sky-600" />
                                              <span>{el.cardIcon}</span>
                                            </>
                                          ) : (
                                            <span>Pick from 500+ Icons</span>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* 7. ALERT BOX */}
                                  {el.type === 'alert' && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Alert Title
                                          </label>
                                          <input
                                            type="text"
                                            value={el.alertTitle || ''}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx ? { ...item, alertTitle: e.target.value } : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Severity Variant
                                          </label>
                                          <select
                                            value={el.alertVariant || 'info'}
                                            onChange={(e) =>
                                              updateSection(sec.id, (s) => ({
                                                ...s,
                                                elements: s.elements.map((item, idx) =>
                                                  idx === elIdx
                                                    ? { ...item, alertVariant: e.target.value as any }
                                                    : item
                                                ),
                                              }))
                                            }
                                            className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-medium"
                                          >
                                            <option value="info">Info (Sky Blue)</option>
                                            <option value="success">Success (Emerald)</option>
                                            <option value="warning">Warning (Amber)</option>
                                            <option value="emergency">Emergency Alert (Red)</option>
                                          </select>
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Alert Message
                                        </label>
                                        <textarea
                                          rows={2}
                                          value={el.alertMessage || ''}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx ? { ...item, alertMessage: e.target.value } : item
                                              ),
                                            }))
                                          }
                                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* 8. DIVIDER / SPACING */}
                                  {el.type === 'divider' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Divider Style
                                        </label>
                                        <select
                                          value={el.dividerStyle || 'line'}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx
                                                  ? { ...item, dividerStyle: e.target.value as any }
                                                  : item
                                              ),
                                            }))
                                          }
                                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                                        >
                                          <option value="line">Solid Subtle Line</option>
                                          <option value="dots">3 Decorative Dots</option>
                                          <option value="space">Blank Vertical Spacer</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Spacing Height: {el.dividerHeight || 32}px
                                        </label>
                                        <input
                                          type="range"
                                          min={8}
                                          max={120}
                                          value={el.dividerHeight || 32}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx
                                                  ? { ...item, dividerHeight: parseInt(e.target.value) }
                                                  : item
                                              ),
                                            }))
                                          }
                                          className="w-full cursor-pointer"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* 9. BADGE */}
                                  {el.type === 'badge' && (
                                    <div className="flex flex-wrap items-center gap-3">
                                      <div className="flex-1 min-w-[200px]">
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Badge Tag Text
                                        </label>
                                        <input
                                          type="text"
                                          value={el.badgeText || ''}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx ? { ...item, badgeText: e.target.value } : item
                                              ),
                                            }))
                                          }
                                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Color Theme
                                        </label>
                                        <select
                                          value={el.badgeColor || 'sky'}
                                          onChange={(e) =>
                                            updateSection(sec.id, (s) => ({
                                              ...s,
                                              elements: s.elements.map((item, idx) =>
                                                idx === elIdx
                                                  ? { ...item, badgeColor: e.target.value as any }
                                                  : item
                                              ),
                                            }))
                                          }
                                          className="px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                                        >
                                          <option value="sky">Sky Blue</option>
                                          <option value="emerald">Emerald</option>
                                          <option value="amber">Amber</option>
                                          <option value="rose">Rose</option>
                                          <option value="indigo">Indigo</option>
                                          <option value="purple">Purple</option>
                                          <option value="slate">Slate Gray</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                          Badge Icon
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenIconPicker(sec.id, el.id, 'badgeIcon', el.badgeIcon)
                                          }
                                          className="px-3 py-1.5 rounded border border-slate-300 bg-slate-50 text-xs font-semibold inline-flex items-center gap-1.5"
                                        >
                                          {el.badgeIcon ? (
                                            <>
                                              <DynamicIcon name={el.badgeIcon} className="w-3.5 h-3.5 text-sky-600" />
                                              <span>{el.badgeIcon}</span>
                                            </>
                                          ) : (
                                            <span>Pick Icon (500+)</span>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      {/* Global 500+ Vector Icon Picker Modal */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        selectedIconName={iconTarget?.currentVal}
        onSelectIcon={handleIconSelected}
        title="Search 500+ Vector Icons for Element"
      />
    </div>
  );
};
