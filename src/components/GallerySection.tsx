import React, { useState } from 'react';
import { DoctorProfile, GalleryItem } from '../types/doctor';
import { Camera, Eye, X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { EditableElement } from './visual-builder/EditableElement';
import { useVisualBuilder } from './visual-builder/VisualBuilderContext';

interface GallerySectionProps {
  profile: DoctorProfile;
  onUpdateProfile?: (profile: DoctorProfile) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ profile, onUpdateProfile }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const { isVisualEditMode } = useVisualBuilder();

  const update = (patch: Partial<DoctorProfile>) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, ...patch });
    }
  };

  const alignClass =
    profile.galleryAlign === 'center'
      ? 'text-center items-center'
      : profile.galleryAlign === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const handleAddPhoto = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: 'Clinical Facility Suite',
      caption: 'Advanced consultation and diagnostic suite with state-of-the-art medical technology.',
      category: 'Facility',
      imageBase64: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
    };
    update({ gallery: [...(profile.gallery || []), newItem] });
  };

  const handleDeletePhoto = (id: string) => {
    update({ gallery: (profile.gallery || []).filter((g) => g.id !== id) });
  };

  if (!profile.gallery || profile.gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className={`max-w-3xl flex flex-col ${alignClass}`}>
            <EditableElement
              id="galleryBadge"
              label="Gallery Section Badge"
              type="badge"
              value={profile.galleryBadge || 'Facility Tour & Technological Infrastructure'}
              alignment={profile.galleryAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { galleryBadge: value } : {}),
                  ...(alignment !== undefined ? { galleryAlign: alignment } : {}),
                });
              }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-semibold mb-3 border border-sky-100">
                <Camera className="w-3.5 h-3.5 text-sky-600" />
                <span>{profile.galleryBadge || 'Facility Tour & Technological Infrastructure'}</span>
              </div>
            </EditableElement>

            <EditableElement
              id="galleryTitle"
              label="Gallery Section Title"
              type="heading"
              value={profile.galleryTitle || 'Our Heart Center & Clinical Suites'}
              alignment={profile.galleryAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { galleryTitle: value } : {}),
                  ...(alignment !== undefined ? { galleryAlign: alignment } : {}),
                });
              }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {profile.galleryTitle || 'Our Heart Center & Clinical Suites'}
              </h2>
            </EditableElement>

            <EditableElement
              id="gallerySubtitle"
              label="Gallery Section Subtitle"
              type="text"
              value={
                profile.gallerySubtitle ||
                'Tour our Fifth Avenue clinical practice, diagnostic catheterization laboratories, and private consultation environments.'
              }
              alignment={profile.galleryAlign || 'left'}
              onUpdate={({ value, alignment }) => {
                update({
                  ...(value !== undefined ? { gallerySubtitle: value } : {}),
                  ...(alignment !== undefined ? { galleryAlign: alignment } : {}),
                });
              }}
            >
              <p className="text-slate-600 text-base sm:text-lg mt-3">
                {profile.gallerySubtitle ||
                  'Tour our Fifth Avenue clinical practice, diagnostic catheterization laboratories, and private consultation environments.'}
              </p>
            </EditableElement>
          </div>

          {isVisualEditMode && (
            <button
              type="button"
              onClick={handleAddPhoto}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility Photo</span>
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.gallery.map((item, idx) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-end aspect-4/3 sm:aspect-square"
            >
              {isVisualEditMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhoto(item.id);
                  }}
                  className="absolute top-2 right-2 z-20 p-1.5 bg-rose-950/90 hover:bg-rose-900 text-rose-300 rounded-lg shadow-md cursor-pointer"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Image with direct Base64 Data String src */}
              <img
                src={item.imageBase64}
                alt={item.title}
                onClick={() => !isVisualEditMode && setSelectedPhoto(item)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />

              {/* Card Bottom Meta */}
              <div className="relative p-4 text-white z-10">
                <EditableElement
                  id={`galleryCat-${item.id}`}
                  label="Photo Category"
                  type="badge"
                  value={item.category}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newGal = [...profile.gallery];
                      newGal[idx] = { ...newGal[idx], category: value };
                      update({ gallery: newGal });
                    }
                  }}
                >
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-600/90 text-white mb-1.5 backdrop-blur-xs">
                    {item.category}
                  </span>
                </EditableElement>

                <EditableElement
                  id={`galleryTitle-${item.id}`}
                  label="Photo Title"
                  type="heading"
                  value={item.title}
                  onUpdate={({ value }) => {
                    if (value !== undefined) {
                      const newGal = [...profile.gallery];
                      newGal[idx] = { ...newGal[idx], title: value };
                      update({ gallery: newGal });
                    }
                  }}
                >
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                </EditableElement>

                <EditableElement
                  id={`galleryCaption-${item.id}`}
                  label="Photo Caption & Image URL"
                  type="card"
                  value={item.caption}
                  secondaryValue={item.imageBase64}
                  onUpdate={({ value, secondaryValue }) => {
                    const newGal = [...profile.gallery];
                    newGal[idx] = {
                      ...newGal[idx],
                      ...(value !== undefined ? { caption: value } : {}),
                      ...(secondaryValue !== undefined ? { imageBase64: secondaryValue } : {}),
                    };
                    update({ gallery: newGal });
                  }}
                >
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.caption}</p>
                </EditableElement>

                {!isVisualEditMode && (
                  <div
                    onClick={() => setSelectedPhoto(item)}
                    className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Click to expand view</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Photo Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.imageBase64}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 text-white bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedPhoto.title}</h3>
                  <p className="text-sm text-slate-300 mt-1">{selectedPhoto.caption}</p>
                </div>

                <div className="text-xs text-slate-400 shrink-0 font-mono">
                  Base64 Firestore Streamed Asset
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
