'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn, surfaces } from '@/lib/theme'

type DialogContextValue = {
  onClose: () => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext(caller: string): DialogContextValue {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error(`${caller} must be used within a <Dialog />`)
  }

  return context
}

interface DialogRootProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  /**
   * Close the dialog when ESC is pressed.
   * @default true
   */
  closeOnEscape?: boolean
  /**
   * Close the dialog when the backdrop is clicked.
   * @default true
   */
  closeOnBackdrop?: boolean
  /**
   * ID of the element labeling the dialog (for accessibility).
   */
  ariaLabelledBy?: string
  /**
   * ID of the element describing the dialog content (for accessibility).
   */
  ariaDescribedBy?: string
  /**
   * Custom classes for the flex container that centers the dialog.
   */
  containerClassName?: string
  /**
   * Custom classes for the backdrop element.
   */
  backdropClassName?: string
}

const DialogRoot = ({
  isOpen,
  onClose,
  children,
  closeOnEscape = true,
  closeOnBackdrop = true,
  ariaLabelledBy,
  ariaDescribedBy,
  containerClassName,
  backdropClassName
}: DialogRootProps) => {
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  return (
    <DialogContext.Provider value={{ onClose }}>
      <>
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
            backdropClassName
          )}
          onClick={closeOnBackdrop ? onClose : undefined}
          aria-hidden="true"
          data-slot="dialog-backdrop"
        />

        <div
          className={cn(
            'pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4',
            containerClassName
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          data-slot="dialog-container"
          onClick={closeOnBackdrop ? onClose : undefined}
        >
          {children}
        </div>
      </>
    </DialogContext.Provider>
  )
}

DialogRoot.displayName = 'Dialog'

type DialogContentSize = 'md' | 'lg' | 'xl'

const contentSizes: Record<DialogContentSize, string> = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: DialogContentSize
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, size = 'lg', onClick, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          surfaces.panel.overlay,
          'pointer-events-auto relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-gray-700/60 p-6 sm:p-8',
          contentSizes[size],
          className
        )}
        onClick={(event) => {
          event.stopPropagation()
          onClick?.(event)
        }}
        data-slot="dialog-content"
        {...rest}
      >
        {children}
      </div>
    )
  }
)

DialogContent.displayName = 'DialogContent'

interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ className?: string; size?: number }>
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, children, icon: Icon = X, ...rest }, ref) => {
    const { onClose } = useDialogContext('DialogClose')

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClose}
        className={cn(
          'absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200',
          className
        )}
        aria-label="Close dialog"
        data-slot="dialog-close"
        {...rest}
      >
        {children ?? <Icon size={20} />}
      </button>
    )
  }
)

DialogClose.displayName = 'DialogClose'

const DialogHeader = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mb-6 space-y-2 text-gray-100', className)}
    data-slot="dialog-header"
    {...rest}
  />
)

DialogHeader.displayName = 'DialogHeader'

const DialogTitle = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn('text-2xl font-bold text-gray-100', className)}
    data-slot="dialog-title"
    {...rest}
  />
)

DialogTitle.displayName = 'DialogTitle'

const DialogDescription = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn('text-sm leading-relaxed text-gray-300', className)}
    data-slot="dialog-description"
    {...rest}
  />
)

DialogDescription.displayName = 'DialogDescription'

const DialogBody = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('space-y-6', className)}
    data-slot="dialog-body"
    {...rest}
  />
)

DialogBody.displayName = 'DialogBody'

const DialogFooter = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-6 flex flex-wrap justify-end gap-2', className)}
    data-slot="dialog-footer"
    {...rest}
  />
)

DialogFooter.displayName = 'DialogFooter'

const DialogActions = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-wrap items-center gap-2', className)}
    data-slot="dialog-actions"
    {...rest}
  />
)

DialogActions.displayName = 'DialogActions'

export const Dialog = Object.assign(DialogRoot, {
  Content: DialogContent,
  Close: DialogClose,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Actions: DialogActions
})

export type {
  DialogRootProps,
  DialogContentProps,
  DialogCloseProps,
  DialogContentSize
}
