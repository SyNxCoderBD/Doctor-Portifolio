import React, { useState, useEffect, useRef } from 'react';
import { useVisualBuilder } from './VisualBuilderContext';
import { compressImageFile } from '../../utils/imageCompressor';
import { DynamicIcon } from '../icons/DynamicIcon';
import {
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Sparkles,
  Type,
  Check,
  Upload,
  Image as ImageIcon,
  Save,
  RefreshCw,
  Eye,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const MEDICAL_STOCK_PRESETS = [
  {
    name: 'Doctor Portrait',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Female Physician',
    url: 'https://images.unsplash.com/photo-1594824813583-0599c92fa321?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Operating Suite',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Consultation Office',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cardiac Monitoring',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
  },
];

export const FloatingPropertyInspector: React.FC = () => {
  const {
    selectedTarget,
    selectTarget,
    openIconPicker,
    saveToFirestore,
    isSaving,
    setHasUnsavedChanges,
  } = useVisualBuilder();

  // Local draft states to isolate editing inside the menu first without glitching the page
  const [draftValue, setDraftValue] = useState<string>('');
  const [draftSecondaryValue, setDraftSecondaryValue] = useState<string>('');
  const [draftAlignment, setDraftAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [draftIconName, setDraftIconName] = useState<string>('');
  const [draftImageUrl, setDraftImageUrl] = useState<string>('');
  const [draftButtonLink, setDraftButtonLink] = useState<string>('');
  const [draftButtonVariant, setDraftButtonVariant] = useState<string>('primary');
  const [hasPendingDraft, setHasPendingDraft] = useState<boolean>(false);
  const [hasAppliedToPreview, setHasAppliedToPreview] = useState<boolean>(false);
  const [isCompressingImage, setIsCompressingImage] = useState<boolean>(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastTargetIdRef = useRef<string | null>(null);

  // Sync draft state whenever a new target is selected
  useEffect(() => {
    if (selectedTarget) {
      lastTargetIdRef.current = selectedTarget.id;
      setDraftValue(selectedTarget.value || '');
      setDraftSecondaryValue(selectedTarget.secondaryValue || '');
      setDraftAlignment(selectedTarget.alignment || 'left');
      setDraftIconName(selectedTarget.iconName || '');
      setDraftButtonLink(selectedTarget.buttonLink || '');
      setDraftButtonVariant(selectedTarget.buttonVariant || 'primary');

      // Determine image URL
      const initialImg =
        selectedTarget.type === 'image'
          ? selectedTarget.value
          : selectedTarget.imageUrl ||
            (selectedTarget.value &&
            (selectedTarget.value.startsWith('data:image') ||
              selectedTarget.value.startsWith('http'))
              ? selectedTarget.value
              : '');
      setDraftImageUrl(initialImg || '');

      setHasPendingDraft(false);
      setHasAppliedToPreview(false);
      setImageUploadError(null);
    }
  }, [selectedTarget?.id]);

  if (!selectedTarget) return null;

  const {
    label,
    type,
    onUpdate,
    onMoveUp,
    onMoveDown,
    onDuplicate,
    onDelete,
    id: targetId,
  } = selectedTarget;

  // Determine element capabilities
  const isImageType =
    type === 'image' ||
    Boolean(draftImageUrl) ||
    targetId.toLowerCase().includes('image') ||
    targetId.toLowerCase().includes('headshot') ||
    targetId.toLowerCase().includes('photo') ||
    targetId.toLowerCase().includes('logo') ||
    targetId.toLowerCase().includes('certificate') ||
    label.toLowerCase().includes('photo') ||
    label.toLowerCase().includes('image') ||
    label.toLowerCase().includes('headshot') ||
    label.toLowerCase().includes('icon base64') ||
    (draftValue.startsWith('data:image') || draftValue.startsWith('http'));

  const hasIconCapability =
    draftIconName !== '' ||
    selectedTarget.iconName !== undefined ||
    type === 'badge' ||
    type === 'card' ||
    type === 'stat' ||
    type === 'button' ||
    targetId.toLowerCase().includes('icon') ||
    targetId.toLowerCase().includes('stat') ||
    targetId.toLowerCase().includes('service');

  // Handle local text change strictly in the visual menu
  const handleLocalTextChange = (val: string) => {
    setDraftValue(val);
    setHasPendingDraft(true);
    setHasAppliedToPreview(false);
  };

  const handleLocalSecondaryChange = (val: string) => {
    setDraftSecondaryValue(val);
    setHasPendingDraft(true);
    setHasAppliedToPreview(false);
  };

  const handleLocalAlignmentChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    setDraftAlignment(align);
    setHasPendingDraft(true);
    setHasAppliedToPreview(false);
  };

  // Apply changes to the live PREVIEW (React state on page, not Firebase)
  const applyChangesToPreview = () => {
    const finalValue = isImageType && draftImageUrl ? draftImageUrl : draftValue;

    onUpdate({
      value: finalValue,
      secondaryValue: draftSecondaryValue !== undefined ? draftSecondaryValue : undefined,
      alignment: draftAlignment,
      iconName: draftIconName || undefined,
      imageUrl: draftImageUrl || undefined,
      buttonLink: draftButtonLink || undefined,
      buttonVariant: draftButtonVariant || undefined,
    });

    setHasUnsavedChanges(true);
    setHasPendingDraft(false);
    setHasAppliedToPreview(true);
  };

  // Save changes to Firestore
  const handleSaveToCloud = async () => {
    if (hasPendingDraft) {
      applyChangesToPreview();
    }
    await saveToFirestore();
  };

  // Image Upload handler with client-side canvas compression
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError(null);
    setIsCompressingImage(true);

    try {
      const result = await compressImageFile(file, 900, 0.75);
      setDraftImageUrl(result.base64);
      setDraftValue(result.base64);
      setHasPendingDraft(true);
      setHasAppliedToPreview(false);
    } catch (err: any) {
      console.error('Image compression failed:', err);
      setImageUploadError(err.message || 'Image compression failed.');
    } finally {
      setIsCompressingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectPresetStock = (url: string) => {
    setDraftImageUrl(url);
    setDraftValue(url);
    setHasPendingDraft(true);
    setHasAppliedToPreview(false);
  };

  return (
    <div
      id="floating-property-inspector"
      className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Inspector Header */}
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Type className="w-4 h-4 text-sky-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block leading-none">
              Visual Editor Menu
            </span>
            <h4 className="text-xs font-bold text-white truncate mt-0.5" title={label}>
              {label}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => selectTarget(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Visual Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Controls */}
      <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
        {/* Status Indicator Banner */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200 text-[11px]">
          <span className="text-slate-600 font-medium">Preview Status:</span>
          {hasPendingDraft ? (
            <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Draft in Menu
            </span>
          ) : hasAppliedToPreview ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Applied to Preview
            </span>
          ) : (
            <span className="text-slate-500 font-semibold">Synced</span>
          )}
        </div>

        {/* IMAGE EDITING SECTION (If element is or has image) */}
        {isImageType && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>Image / Photo Media</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Editable</span>
            </div>

            {/* Thumbnail Preview */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
                {draftImageUrl ? (
                  <img
                    src={draftImageUrl}
                    alt="Preview Thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[11px] font-semibold text-slate-700 truncate">
                  {draftImageUrl?.startsWith('data:') ? 'Custom Uploaded Image' : draftImageUrl || 'No Image Set'}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isCompressingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{isCompressingImage ? 'Compressing...' : 'Upload Photo'}</span>
                  </button>
                  {draftImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraftImageUrl('');
                        setDraftValue('');
                        setHasPendingDraft(true);
                      }}
                      className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {imageUploadError && (
              <p className="text-[11px] text-rose-600 font-medium">{imageUploadError}</p>
            )}

            {/* Direct Image URL input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Or Direct Image URL (Unsplash/Web link):
              </label>
              <input
                type="text"
                value={draftImageUrl}
                onChange={(e) => {
                  setDraftImageUrl(e.target.value);
                  setDraftValue(e.target.value);
                  setHasPendingDraft(true);
                  setHasAppliedToPreview(false);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            {/* Quick Clinical Presets */}
            <div>
              <span className="block text-[10px] font-bold text-slate-500 mb-1.5">
                Quick Medical Photo Presets:
              </span>
              <div className="grid grid-cols-2 gap-1">
                {MEDICAL_STOCK_PRESETS.map((stock) => (
                  <button
                    key={stock.name}
                    type="button"
                    onClick={() => handleSelectPresetStock(stock.url)}
                    className="p-1.5 text-left rounded-lg bg-white hover:bg-sky-50 hover:border-sky-300 border border-slate-200 text-[10px] font-medium text-slate-700 truncate cursor-pointer transition-colors"
                    title={stock.name}
                  >
                    {stock.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ICON PICKER SECTION (If element has or can have an icon) */}
        {hasIconCapability && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Element Vector Icon</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">500+ Library</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                  <DynamicIcon name={draftIconName || 'HeartPulse'} className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {draftIconName || 'Default Icon'}
                  </span>
                  <span className="text-[10px] text-slate-500">Selected Lucide Icon</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  openIconPicker(draftIconName, (chosen) => {
                    setDraftIconName(chosen);
                    if (type === 'badge' && !draftValue) {
                      setDraftValue(chosen);
                    }
                    setHasPendingDraft(true);
                    setHasAppliedToPreview(false);
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>Change Icon</span>
              </button>
            </div>
          </div>
        )}

        {/* TEXT EDITING SECTION */}
        {!isImageType && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Content / Text Value
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                {draftValue.length} characters
              </span>
            </div>

            {type === 'heading' || draftValue.length < 80 ? (
              <input
                type="text"
                value={draftValue}
                onChange={(e) => handleLocalTextChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyChangesToPreview();
                  }
                }}
                placeholder="Enter text..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs font-medium text-slate-900 shadow-xs"
              />
            ) : (
              <textarea
                rows={4}
                value={draftValue}
                onChange={(e) => handleLocalTextChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    applyChangesToPreview();
                  }
                }}
                placeholder="Enter text..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs leading-relaxed text-slate-900 shadow-xs"
              />
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              Press Enter or click &quot;Apply to Preview&quot; to test changes on the page.
            </p>
          </div>
        )}

        {/* Secondary Value (e.g. Subtitle, Description) */}
        {draftSecondaryValue !== undefined && !isImageType && (
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Secondary Description / Subtext
            </label>
            <textarea
              rows={3}
              value={draftSecondaryValue}
              onChange={(e) => handleLocalSecondaryChange(e.target.value)}
              placeholder="Secondary text..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs leading-relaxed text-slate-900 shadow-xs"
            />
          </div>
        )}

        {/* Alignment Control */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Alignment
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleLocalAlignmentChange('left')}
              className={`p-1.5 rounded-lg flex items-center justify-center gap-1 font-semibold transition-all cursor-pointer ${
                draftAlignment === 'left'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span className="text-[10px]">Left</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocalAlignmentChange('center')}
              className={`p-1.5 rounded-lg flex items-center justify-center gap-1 font-semibold transition-all cursor-pointer ${
                draftAlignment === 'center'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
              <span className="text-[10px]">Center</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocalAlignmentChange('right')}
              className={`p-1.5 rounded-lg flex items-center justify-center gap-1 font-semibold transition-all cursor-pointer ${
                draftAlignment === 'right'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
              <span className="text-[10px]">Right</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocalAlignmentChange('justify')}
              className={`p-1.5 rounded-lg flex items-center justify-center gap-1 font-semibold transition-all cursor-pointer ${
                draftAlignment === 'justify'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Justify"
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span className="text-[10px]">Justify</span>
            </button>
          </div>
        </div>

        {/* Button Properties (If element is a button) */}
        {type === 'button' && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-sky-600" />
                <span>Button Target Link / Anchor</span>
              </label>
              <input
                type="text"
                placeholder="#booking, #services, tel:..., mailto:..."
                value={draftButtonLink}
                onChange={(e) => {
                  setDraftButtonLink(e.target.value);
                  setHasPendingDraft(true);
                  setHasAppliedToPreview(false);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Button Style Variant
              </label>
              <select
                value={draftButtonVariant}
                onChange={(e) => {
                  setDraftButtonVariant(e.target.value);
                  setHasPendingDraft(true);
                  setHasAppliedToPreview(false);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              >
                <option value="primary">Sky Blue (Primary Solid)</option>
                <option value="secondary">Slate Gray (Subtle Solid)</option>
                <option value="outline">Clean Outline (Bordered)</option>
                <option value="emerald">Emerald Green (Success)</option>
                <option value="amber">Warm Amber</option>
                <option value="danger">Rose Red</option>
              </select>
            </div>
          </div>
        )}

        {/* Re-order / Arrange Controls */}
        {(onMoveUp || onMoveDown || onDuplicate || onDelete) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {onMoveUp && (
                <button
                  type="button"
                  onClick={onMoveUp}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                  title="Move Item Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
              {onMoveDown && (
                <button
                  type="button"
                  onClick={onMoveDown}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                  title="Move Item Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              )}
              {onDuplicate && (
                <button
                  type="button"
                  onClick={onDuplicate}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                  title="Duplicate Item"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Remove Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Footer: Apply to Preview & Save Changes to Cloud */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          {/* Apply to Preview Button */}
          <button
            type="button"
            id="inspector-apply-preview-btn"
            onClick={applyChangesToPreview}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              hasPendingDraft
                ? 'bg-sky-600 hover:bg-sky-700 text-white ring-2 ring-sky-300 animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${hasPendingDraft ? 'animate-spin' : ''}`} />
            <span>Apply to Preview</span>
          </button>

          {/* Save to Cloud Button */}
          <button
            type="button"
            id="inspector-save-cloud-btn"
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 px-0.5">
          <span>Edits occur safely in menu first</span>
          <button
            type="button"
            onClick={() => selectTarget(null)}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};
