import React from 'react';

export default function DeviceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-6 pt-16 md:pt-20 pb-6 md:pb-10">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
