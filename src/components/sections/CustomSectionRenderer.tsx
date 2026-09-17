import React from 'react';
import { CustomSection, SectionElement } from '../../types/doctor';
import { DynamicIcon } from '../icons/DynamicIcon';
import { ExternalLink, Info, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface CustomSectionRendererProps {
  section: CustomSection;
  onOpenBooking?: () => void;
}

export const CustomSectionRenderer: React.FC<CustomSectionRendererProps> = ({
  section,
  onOpenBooking,
}) => {
  if (!section.isVisible) return null;

  // Background style computation
  let bgClasses = 'bg-white text-slate-900 border-b border-slate-200/80';
  let customStyle: React.CSSProperties = {};

  if (section.backgroundColor === 'slate') {
    bgClasses = 'bg-slate-50 text-slate-900 border-b border-slate-200';
  } else if (section.backgroundColor === 'sky') {
    bgClasses = 'bg-sky-50 text-sky-950 border-b border-sky-100';
  } else if (section.backgroundColor === 'dark') {
    bgClasses = 'bg-slate-950 text-white border-b border-slate-900';
  } else if (section.backgroundColor === 'custom' && section.customBgHex) {
    bgClasses = 'border-b border-slate-200/50';
    customStyle.backgroundColor = section.customBgHex;
    if (section.textColor === 'light') {
      bgClasses += ' text-white';
    } else {
      bgClasses += ' text-slate-900';
    }
  }

  // Padding computation
  const paddingClasses =
    section.paddingY === 'none'
      ? 'py-0'
      : section.paddingY === 'small'
      ? 'py-8 sm:py-12'
      : section.paddingY === 'large'
      ? 'py-20 sm:py-28'
      : 'py-14 sm:py-20';

  // Container width
  const containerClasses =
    section.containerWidth === 'narrow'
      ? 'max-w-4xl'
      : section.containerWidth === 'wide'
      ? 'max-w-7xl'
      : section.containerWidth === 'full'
      ? 'max-w-none px-4 sm:px-6'
      : 'max-w-6xl';

  // Header alignment
  const headerAlignClasses =
    section.headerAlign === 'center'
      ? 'text-center mx-auto'
      : section.headerAlign === 'right'
      ? 'text-right ml-auto'
      : 'text-left';

  return (
    <section
      id={`section-${section.id}`}
      className={`${bgClasses} ${paddingClasses} relative transition-colors`}
      style={customStyle}
    >
      <div className={`${containerClasses} mx-auto px-4 sm:px-6 lg:px-8`}>
        
        {/* Section Header */}
        {(section.title || section.subtitle) && (
          <div className={`mb-10 max-w-3xl ${headerAlignClasses}`}>
            {section.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p
                className={`text-sm sm:text-base mt-2.5 leading-relaxed ${
                  section.backgroundColor === 'dark' || section.textColor === 'light'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                {section.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Section Elements Stack */}
        <div className="space-y-6">
          {section.elements.map((el) => (
            <ElementItem key={el.id} element={el} onOpenBooking={onOpenBooking} isDark={section.backgroundColor === 'dark' || section.textColor === 'light'} />
          ))}
        </div>

      </div>
    </section>
  );
};

// ----------------------------------------------------------------------
// Sub-component: Individual Element Renderer
// ----------------------------------------------------------------------
interface ElementItemProps {
  element: SectionElement;
  onOpenBooking?: () => void;
  isDark?: boolean;
}

const ElementItem: React.FC<ElementItemProps> = ({ element, onOpenBooking, isDark }) => {
  const alignClass =
    element.align === 'center'
      ? 'text-center flex flex-col items-center justify-center'
      : element.align === 'right'
      ? 'text-right flex flex-col items-end justify-end'
      : 'text-left flex flex-col items-start justify-start';

  // 1. Heading Element
  if (element.type === 'heading') {
    const level = element.headingLevel || 'h2';
    const text = element.headingText || 'Section Heading';
    const colorStyle = element.headingColor ? { color: element.headingColor } : undefined;

    if (level === 'h1') {
      return (
        <div className={alignClass}>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={colorStyle}>
            {text}
          </h1>
        </div>
      );
    }
    if (level === 'h3') {
      return (
        <div className={alignClass}>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={colorStyle}>
            {text}
          </h3>
        </div>
      );
    }
    if (level === 'h4') {
      return (
        <div className={alignClass}>
          <h4 className="text-lg font-bold tracking-tight" style={colorStyle}>
            {text}
          </h4>
        </div>
      );
    }
    return (
      <div className={alignClass}>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={colorStyle}>
          {text}
        </h2>
      </div>
    );
  }

  // 2. Text / Paragraph Element
  if (element.type === 'text') {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    }[element.textSize || 'base'];

    const weightClass = element.isBold ? 'font-bold' : 'font-normal';
    const italicClass = element.isItalic ? 'italic' : '';
    const colorStyle = element.textColor ? { color: element.textColor } : undefined;

    return (
      <div className={alignClass}>
        <div
          className={`leading-relaxed max-w-3xl ${sizeClasses} ${weightClass} ${italicClass} ${
            !element.textColor && (isDark ? 'text-slate-300' : 'text-slate-600')
          }`}
          style={colorStyle}
        >
          {element.textContent?.split('\n').map((para, i) => (
            <p key={i} className="mb-2 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // 3. Button / CTA Element
  if (element.type === 'button') {
    const variant = element.buttonVariant || 'primary';
    const sizeClasses = {
      sm: 'px-3.5 py-2 text-xs font-semibold rounded-lg',
      md: 'px-5 py-3 text-sm font-semibold rounded-xl',
      lg: 'px-7 py-4 text-base font-bold rounded-2xl',
    }[element.buttonSize || 'md'];

    let variantClasses = 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20';
    let btnStyle: React.CSSProperties = {};

    if (variant === 'secondary') {
      variantClasses = 'bg-slate-800 hover:bg-slate-900 text-white shadow-xs';
    } else if (variant === 'emerald') {
      variantClasses = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20';
    } else if (variant === 'amber') {
      variantClasses = 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20';
    } else if (variant === 'danger') {
      variantClasses = 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20';
    } else if (variant === 'outline') {
      variantClasses = 'border-2 border-sky-600 text-sky-700 hover:bg-sky-50';
    } else if (variant === 'ghost') {
      variantClasses = 'text-sky-700 hover:bg-sky-50';
    } else if (variant === 'custom') {
      variantClasses = 'shadow-md';
      if (element.buttonCustomBg) btnStyle.backgroundColor = element.buttonCustomBg;
      if (element.buttonCustomTextColor) btnStyle.color = element.buttonCustomTextColor;
    }

    const handleClick = (e: React.MouseEvent) => {
      if (element.buttonLink === '#book' || element.buttonLink === '#booking') {
        e.preventDefault();
        onOpenBooking?.();
      }
    };

    const content = (
      <span className="inline-flex items-center gap-2">
        {element.buttonIcon && (
          <DynamicIcon name={element.buttonIcon} className="w-4 h-4 shrink-0" />
        )}
        <span>{element.buttonLabel || 'Learn More'}</span>
      </span>
    );

    return (
      <div className={alignClass}>
        {element.buttonLink ? (
          <a
            href={element.buttonLink}
            onClick={handleClick}
            target={element.openInNewTab ? '_blank' : undefined}
            rel={element.openInNewTab ? 'noopener noreferrer' : undefined}
            className={`inline-flex items-center justify-center transition-all cursor-pointer ${sizeClasses} ${variantClasses}`}
            style={btnStyle}
          >
            {content}
          </a>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className={`inline-flex items-center justify-center transition-all cursor-pointer ${sizeClasses} ${variantClasses}`}
            style={btnStyle}
          >
            {content}
          </button>
        )}
      </div>
    );
  }

  // 4. Image Element
  if (element.type === 'image') {
    if (!element.imageBase64) return null;

    const maxWidthClass = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      full: 'w-full',
    }[element.imageMaxWidth || 'md'];

    const roundedClass = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full',
    }[element.imageRounded || 'xl'];

    const imgEl = (
      <img
        src={element.imageBase64}
        alt={element.imageAlt || 'Practice Photo'}
        className={`w-full h-auto object-cover ${roundedClass} shadow-md border border-slate-200/80`}
        referrerPolicy="no-referrer"
      />
    );

    return (
      <div className={alignClass}>
        <div className={maxWidthClass}>
          {element.imageLinkUrl ? (
            <a
              href={element.imageLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              {imgEl}
            </a>
          ) : (
            imgEl
          )}
          {element.imageCaption && (
            <p className="text-xs text-slate-500 mt-2 italic text-center">
              {element.imageCaption}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 5. Custom Button with HTML Code / Raw HTML Embed
  if (element.type === 'html') {
    const rawHtml = element.customHtml || '';
    return (
      <div className={alignClass}>
        <div
          className="custom-html-block w-full"
          dangerouslySetInnerHTML={{ __html: rawHtml }}
        />
      </div>
    );
  }

  // 6. Feature Card
  if (element.type === 'card') {
    return (
      <div className={alignClass}>
        <div className="w-full max-w-xl p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            {element.cardIcon && (
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                <DynamicIcon name={element.cardIcon} className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-bold text-slate-900">{element.cardTitle}</h4>
                {element.cardBadge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase tracking-wider">
                    {element.cardBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {element.cardDescription}
              </p>
              {element.cardLink && (
                <a
                  href={element.cardLink}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 mt-3"
                >
                  <span>Learn more</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. Alert / Notice Box
  if (element.type === 'alert') {
    const variant = element.alertVariant || 'info';
    let alertClasses = 'bg-sky-50 border-sky-200 text-sky-950';
    let Icon = Info;

    if (variant === 'warning') {
      alertClasses = 'bg-amber-50 border-amber-200 text-amber-950';
      Icon = AlertTriangle;
    } else if (variant === 'success') {
      alertClasses = 'bg-emerald-50 border-emerald-200 text-emerald-950';
      Icon = CheckCircle;
    } else if (variant === 'emergency') {
      alertClasses = 'bg-rose-50 border-rose-200 text-rose-950';
      Icon = ShieldAlert;
    }

    return (
      <div className={alignClass}>
        <div className={`w-full max-w-2xl p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 ${alertClasses}`}>
          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            {element.alertTitle && (
              <h5 className="text-sm font-bold tracking-tight">{element.alertTitle}</h5>
            )}
            <p className="text-xs mt-1 leading-relaxed opacity-90">{element.alertMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // 8. Divider / Spacer
  if (element.type === 'divider') {
    const style = element.dividerStyle || 'line';
    const height = element.dividerHeight || 32;

    if (style === 'line') {
      return (
        <div className="w-full" style={{ padding: `${height / 2}px 0` }}>
          <hr className="border-slate-200" />
        </div>
      );
    }
    if (style === 'dots') {
      return (
        <div
          className="w-full flex items-center justify-center gap-2 text-slate-300"
          style={{ padding: `${height / 2}px 0` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      );
    }
    return <div style={{ height: `${height}px` }} />;
  }

  // 9. Badge / Pill Tag
  if (element.type === 'badge') {
    const colorClasses = {
      sky: 'bg-sky-100 text-sky-800 border-sky-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rose: 'bg-rose-100 text-rose-800 border-rose-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      slate: 'bg-slate-100 text-slate-800 border-slate-200',
    }[element.badgeColor || 'sky'];

    return (
      <div className={alignClass}>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}
        >
          {element.badgeIcon && (
            <DynamicIcon name={element.badgeIcon} className="w-3.5 h-3.5" />
          )}
          <span>{element.badgeText || 'Badge'}</span>
        </span>
      </div>
    );
  }

  return null;
};
