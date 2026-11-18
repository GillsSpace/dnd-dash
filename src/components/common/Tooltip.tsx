import React, { useState, useId } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  Placement,
} from '@floating-ui/react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  delay?: number;
  className?: string;
  maxWidth?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 120,
  className = '',
  maxWidth = 'max-w-md',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const { refs, floatingStyles, context } = useFloating({
    open: !disabled && isOpen,
    onOpenChange: (open) => {
      if (!disabled) setIsOpen(open);
    },
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ fallbackAxisSideDirection: 'start', padding: 8 }),
      shift({ padding: 8 }),
    ],
  });

  const hover = useHover(context, { delay: { open: delay, close: 100 }, move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`inline-flex items-center cursor-help ${className}`}
      >
        {children}
      </span>
      {isOpen && (
        <FloatingPortal>
          <div
            id={id}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={`z-50 ${maxWidth} rounded-lg bg-slate-900/95 border border-amber-500/40 p-3.5 text-xs text-slate-100 shadow-2xl backdrop-blur-md pointer-events-none transition-opacity duration-150 animate-in fade-in-0 zoom-in-95`}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
