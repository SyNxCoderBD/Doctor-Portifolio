import React from 'react';
import { useVisualBuilder, EditableTarget } from './VisualBuilderContext';
import { Edit2 } from 'lucide-react';

interface EditableElementProps {
  id: string;
  label: string;
  type?: 'heading' | 'text' | 'button' | 'image' | 'badge' | 'card' | 'stat' | 'section';
  value: string;
  secondaryValue?: string;
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
  className?: string;
  children: React.ReactNode;
}

export const EditableElement: React.FC<EditableElementProps> = ({
  id,
  label,
  type = 'text',
  value,
  secondaryValue,
  alignment = 'left',
  fontSize,
  fontWeight,
  textColor,
  iconName,
  buttonLink,
  buttonVariant,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  className = '',
  children,
}) => {
  const { isVisualEditMode, selectedTarget, selectTarget, setHasUnsavedChanges } =
    useVisualBuilder();

  if (!isVisualEditMode) {
    return <div className={className}>{children}</div>;
  }

  const isSelected = selectedTarget?.id === id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectTarget({
      id,
      label,
      type,
      value,
      secondaryValue,
      alignment,
      fontSize,
      fontWeight,
      textColor,
      iconName,
      buttonLink,
      buttonVariant,
      onUpdate: (patch) => {
        onUpdate(patch);
        setHasUnsavedChanges(true);
      },
      onMoveUp,
      onMoveDown,
      onDuplicate,
      onDelete,
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group/editable transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-emerald-500 ring-offset-2 rounded-lg bg-emerald-50/20'
          : 'hover:ring-2 hover:ring-sky-400 hover:ring-offset-1 rounded-lg'
      } ${className}`}
      title={`Click to edit ${label}`}
    >
      {/* Visual Hover Badge */}
      <span
        className={`absolute -top-3 left-2 z-30 pointer-events-none hidden group-hover/editable:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs transition-opacity ${
          isSelected
            ? 'bg-emerald-600 text-white'
            : 'bg-sky-600 text-white'
        }`}
      >
        <Edit2 className="w-2.5 h-2.5" />
        <span>{label}</span>
      </span>

      {children}
    </div>
  );
};
