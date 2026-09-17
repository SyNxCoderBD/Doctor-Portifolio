import React, { useState, useMemo } from 'react';
import { ICON_CATALOG, ICON_CATEGORIES } from './iconCatalog';
import { DynamicIcon } from './DynamicIcon';
import { Search, X, Check } from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIconName?: string;
  onSelectIcon: (iconName: string) => void;
  title?: string;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  selectedIconName,
  onSelectIcon,
  title = 'Browse & Select Vector Icon',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredIcons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const seenNames = new Set<string>();
    const results: typeof ICON_CATALOG = [];

    for (const item of ICON_CATALOG) {
      const matchCategory =
        activeCategory === 'All' || item.category === activeCategory;
      if (!matchCategory) continue;

      if (q) {
        const matchName = item.name.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchTags) continue;
      }

      if (!seenNames.has(item.name)) {
        seenNames.add(item.name);
        results.push(item);
      }
    }
    return results;
  }, [searchQuery, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <DynamicIcon name={selectedIconName || 'Sparkles'} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">{title}</h3>
              <p className="text-xs text-slate-400">
                Search over 500+ prebuilt vector icons for buttons, cards, badges & sections
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Categories */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons by keyword (e.g. heart, doctor, phone, arrow, check, star, calendar)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {ICON_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{filteredIcons.length}</strong> matching vector icons
            </span>
            {selectedIconName && (
              <span>
                Current: <strong className="font-mono text-sky-700">{selectedIconName}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
          {filteredIcons.map((icon, idx) => {
            const isSelected = selectedIconName === icon.name;
            return (
              <button
                key={`${icon.category}-${icon.name}-${idx}`}
                type="button"
                onClick={() => {
                  onSelectIcon(icon.name);
                  onClose();
                }}
                className={`group flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500 text-sky-800'
                    : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-slate-700 hover:text-sky-900'
                }`}
                title={`${icon.name} (${icon.category})`}
              >
                <div className="w-8 h-8 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <DynamicIcon name={icon.name} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium truncate w-full text-center tracking-tight">
                  {icon.name}
                </span>

                {isSelected && (
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}

          {filteredIcons.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No icons matching &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try another search term or select &apos;All&apos; category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400">Click any icon to apply immediately.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
