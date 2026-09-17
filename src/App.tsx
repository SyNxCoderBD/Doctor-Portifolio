import React, { useState, useEffect } from 'react';
import { DoctorProfile, MedicalService, CustomSection } from './types/doctor';
import { DEFAULT_DOCTOR_DATA } from './data/defaultDoctorData';
import { subscribeDoctorProfile } from './firebase/firestoreService';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ClinicScheduleSection } from './components/ClinicScheduleSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { CustomSectionRenderer } from './components/sections/CustomSectionRenderer';
import { VisualBuilderProvider } from './components/visual-builder/VisualBuilderContext';
import { VisualEditorToolbar } from './components/visual-builder/VisualEditorToolbar';
import { FloatingPropertyInspector } from './components/visual-builder/FloatingPropertyInspector';
import { SpecialtyPresetsModal } from './components/visual-builder/SpecialtyPresetsModal';
import { IconPickerModal } from './components/visual-builder/IconPickerModal';

export default function App() {
  const [profile, setProfile] = useState<DoctorProfile>(DEFAULT_DOCTOR_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notification helper
  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Real-time Firestore sync on mount
  useEffect(() => {
    const unsubscribe = subscribeDoctorProfile(
      (updatedProfile) => {
        setProfile(updatedProfile);
      },
      (error) => {
        console.warn('Firestore subscription notice (running with robust defaults):', error);
      }
    );

    // Support #admin hash in URL for quick entry
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sync website title & favicon icon dynamically with document head
  useEffect(() => {
    if (profile.websiteTitle) {
      document.title = profile.websiteTitle;
    } else if (profile.name) {
      document.title = `${profile.name} - ${profile.title}`;
    }

    if (profile.websiteIconBase64) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = profile.websiteIconBase64;
    }
  }, [profile.websiteTitle, profile.websiteIconBase64, profile.name, profile.title]);

  const handleOpenBookingForService = (service: MedicalService) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setSelectedService(null);
    setIsBookingOpen(true);
  };

  const handleUpdateProfile = (updated: DoctorProfile) => {
    setProfile(updated);
  };

  return (
    <VisualBuilderProvider
      profile={profile}
      onUpdateProfile={handleUpdateProfile}
      onShowToast={showToast}
    >
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
        {/* Visual Editor Top Toolbar */}
        <VisualEditorToolbar onOpenAdminModal={() => setIsAdminOpen(true)} />

        {/* Sticky Top Header Navigation */}
        <Header
          profile={profile}
          onOpenBooking={handleOpenGeneralBooking}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Main Content Sections - Arranged Dynamically via Unified Section Order */}
        <main className="flex-1">
          {(() => {
            const defaultBaseOrder = ['hero', 'about', 'services', 'schedule', 'gallery', 'testimonials'];
            const customSectionIds = (profile.customSections || []).map((s) => s.id);
            const rawOrder =
              profile.sectionOrder && profile.sectionOrder.length > 0
                ? profile.sectionOrder
                : ['hero', 'about', 'services', ...customSectionIds, 'schedule', 'gallery', 'testimonials'];

            const allKnownIds = [...defaultBaseOrder, ...customSectionIds];
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

            return activeOrder.map((sectionId) => {
              if (sectionId === 'hero') {
                return profile.visibility?.hero !== false ? (
                  <HeroSection
                    key="hero"
                    profile={profile}
                    onOpenBooking={handleOpenGeneralBooking}
                    onUpdateProfile={handleUpdateProfile}
                  />
                ) : null;
              }

              if (sectionId === 'about') {
                return profile.visibility?.about !== false ? (
                  <AboutSection
                    key="about"
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                ) : null;
              }

              if (sectionId === 'services') {
                return profile.visibility?.services !== false ? (
                  <ServicesSection
                    key="services"
                    profile={profile}
                    onSelectService={handleOpenBookingForService}
                    onUpdateProfile={handleUpdateProfile}
                  />
                ) : null;
              }

              if (sectionId === 'schedule') {
                return profile.visibility?.schedule !== false ? (
                  <ClinicScheduleSection
                    key="schedule"
                    profile={profile}
                    onShowToast={showToast}
                    onUpdateProfile={handleUpdateProfile}
                  />
                ) : null;
              }

              if (sectionId === 'gallery') {
                return profile.visibility?.gallery !== false ? (
                  <GallerySection
                    key="gallery"
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                ) : null;
              }

              if (sectionId === 'testimonials') {
                return profile.visibility?.testimonials !== false ? (
                  <TestimonialsSection
                    key="testimonials"
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                ) : null;
              }

              // Custom Section
              const customSection = profile.customSections?.find((s) => s.id === sectionId);
              if (customSection && customSection.isVisible !== false) {
                return (
                  <CustomSectionRenderer
                    key={customSection.id}
                    section={customSection}
                    onOpenBooking={handleOpenGeneralBooking}
                  />
                );
              }

              return null;
            });
          })()}
        </main>

        {/* Trust & Clinical Practice Footer */}
        <Footer
          profile={profile}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Floating In-Page Visual Property Inspector */}
        <FloatingPropertyInspector />

        {/* 12+ Medical Specialties Presets Switcher Modal */}
        <SpecialtyPresetsModal />

        {/* Icon Picker Modal */}
        <IconPickerModal />

        {/* Consultation Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          profile={profile}
          preselectedService={selectedService}
          onShowToast={showToast}
        />

        {/* Password-Gated Administrative CMS Panel */}
        {isAdminOpen && (
          <AdminDashboard
            profile={profile}
            onClose={() => {
              setIsAdminOpen(false);
              if (window.location.hash === '#admin') {
                window.history.replaceState(null, '', ' ');
              }
            }}
            onShowToast={showToast}
          />
        )}

        {/* Floating Micro-Interaction Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </VisualBuilderProvider>
  );
}
