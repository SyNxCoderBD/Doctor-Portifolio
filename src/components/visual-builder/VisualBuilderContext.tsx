import React, { createContext, useContext, useState, useCallback } from 'react';
import { DoctorProfile } from '../../types/doctor';
import { updateDoctorProfile } from '../../firebase/firestoreService';
import { SPECIALTY_PRESETS } from '../../data/specialtyPresets';

export interface EditableTarget {
  id: string;
  label: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'badge' | 'card' | 'stat' | 'section';
  sectionId?: string;
  value: string;
  secondaryValue?: string;
  imageUrl?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textColor?: string;
  iconName?: string;
  buttonLink?: string;
  buttonVariant?: string;
  onUpdate: (patch: {
    value?: string;
    secondaryValue?: string;
    imageUrl?: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textColor?: string;
    iconName?: string;
    buttonLink?: string;
    buttonVariant?: string;
    [key: string]: any;
  }) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

interface VisualBuilderContextType {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  isVisualEditMode: boolean;
  setIsVisualEditMode: (active: boolean) => void;
  toggleVisualEditMode: () => void;
  selectedTarget: EditableTarget | null;
  selectTarget: (target: EditableTarget | null) => void;
  isPresetsModalOpen: boolean;
  setIsPresetsModalOpen: (open: boolean) => void;
  openPresetsModal: () => void;
  isIconPickerOpen: boolean;
  setIsIconPickerOpen: (open: boolean) => void;
  iconPickerTarget: { iconName?: string; onSelect: (iconName: string) => void } | null;
  openIconPicker: (currentIcon: string | undefined, onSelect: (iconName: string) => void) => void;
  applySpecialtyPreset: (presetId: string) => void;
  saveToFirestore: () => Promise<void>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (changed: boolean) => void;
  openAdminLoginModal: () => void;
}

const VisualBuilderContext = createContext<VisualBuilderContextType | null>(null);

export const useVisualBuilder = () => {
  const ctx = useContext(VisualBuilderContext);
  if (!ctx) {
    throw new Error('useVisualBuilder must be used within a VisualBuilderProvider');
  }
  return ctx;
};

interface VisualBuilderProviderProps {
  children: React.ReactNode;
  profile: DoctorProfile;
  onUpdateProfile: (updated: DoctorProfile) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onOpenAdminLogin?: () => void;
}

export const VisualBuilderProvider: React.FC<VisualBuilderProviderProps> = ({
  children,
  profile,
  onUpdateProfile,
  onShowToast,
  onOpenAdminLogin,
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('doctor_admin_auth') === 'true';
  });
  const [isVisualEditMode, setIsVisualEditMode] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<EditableTarget | null>(null);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState<boolean>(false);
  const [iconPickerTarget, setIconPickerTarget] = useState<{
    iconName?: string;
    onSelect: (iconName: string) => void;
  } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const setIsAdminLoggedIn = useCallback((status: boolean) => {
    setIsAdminLoggedInState(status);
    if (!status) {
      setIsVisualEditMode(false);
      setSelectedTarget(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('doctor_admin_auth');
      }
    }
  }, []);

  const openAdminLoginModal = useCallback(() => {
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    }
  }, [onOpenAdminLogin]);

  const toggleVisualEditMode = useCallback(() => {
    if (!isAdminLoggedIn) {
      onShowToast(
        'info',
        'Admin Login Required',
        'Please enter your admin passcode in the administrative panel to unlock the Visual Builder.'
      );
      if (onOpenAdminLogin) {
        onOpenAdminLogin();
      }
      return;
    }
    setIsVisualEditMode((prev) => !prev);
  }, [isAdminLoggedIn, onOpenAdminLogin, onShowToast]);

  const openPresetsModal = useCallback(() => {
    if (!isAdminLoggedIn) {
      onShowToast(
        'info',
        'Admin Login Required',
        'Please log in to the admin panel to apply specialty presets.'
      );
      if (onOpenAdminLogin) {
        onOpenAdminLogin();
      }
      return;
    }
    setIsPresetsModalOpen(true);
  }, [isAdminLoggedIn, onOpenAdminLogin, onShowToast]);

  const selectTarget = useCallback((target: EditableTarget | null) => {
    setSelectedTarget(target);
  }, []);

  const openIconPicker = useCallback(
    (currentIcon: string | undefined, onSelect: (iconName: string) => void) => {
      setIconPickerTarget({ iconName: currentIcon, onSelect });
      setIsIconPickerOpen(true);
    },
    []
  );

  const applySpecialtyPreset = useCallback(
    (presetId: string) => {
      const preset = SPECIALTY_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      const merged: DoctorProfile = {
        ...profile,
        ...preset.profileData,
        lastUpdated: new Date().toISOString(),
      };

      onUpdateProfile(merged);
      setHasUnsavedChanges(true);
      setIsPresetsModalOpen(false);
      setSelectedTarget(null);
      onShowToast(
        'success',
        `Applied Preset: ${preset.name}`,
        `The entire website has been transformed into ${preset.doctorName}'s practice. Click "Save Changes" to publish.`
      );
    },
    [profile, onUpdateProfile, onShowToast]
  );

  const saveToFirestore = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateDoctorProfile(profile);
      setHasUnsavedChanges(false);
      onShowToast(
        'success',
        'Website Changes Saved Live',
        'All texts, alignments, sections, and preset customizations are now published to Firestore.'
      );
    } catch (err: any) {
      console.error('Error saving in visual builder:', err);
      onShowToast(
        'error',
        'Save Failed',
        'Unable to persist changes to Firestore. Check connection or console.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [profile, onShowToast]);

  return (
    <VisualBuilderContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isVisualEditMode,
        setIsVisualEditMode,
        toggleVisualEditMode,
        selectedTarget,
        selectTarget,
        isPresetsModalOpen,
        setIsPresetsModalOpen,
        openPresetsModal,
        isIconPickerOpen,
        setIsIconPickerOpen,
        iconPickerTarget,
        openIconPicker,
        applySpecialtyPreset,
        saveToFirestore,
        isSaving,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        openAdminLoginModal,
      }}
    >
      {children}
    </VisualBuilderContext.Provider>
  );
};
