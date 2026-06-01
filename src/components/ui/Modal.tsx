import React from "react";
import Button from "./Button";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300">
      <div className={`w-full ${sizes[size]} animate-in fade-in zoom-in-95 duration-200`}>
        <Card className="border-1.5 border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between border-b border-brand-light pb-4">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-btn hover:bg-brand-light text-brand-muted hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-border"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </CardHeader>

          <CardContent className="py-4 text-brand-text max-h-[70vh] overflow-y-auto">
            {children}
          </CardContent>

          {footerActions && (
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-light">
              {footerActions}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Modal;
