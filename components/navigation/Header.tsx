"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  X,
  Menu,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { colors, surfaces } from '@/lib/theme'
import type {
  NavigationIcon,
  NavigationMenuItem,
  NavigationDropdownConfig,
  NavigationDropdownGroup,
} from '@/lib/types/navigation'
import { headerNavigationConfig } from './header-config'

const NAVIGATION_CONFIG: NavigationMenuItem[] = headerNavigationConfig

interface NavItemProps {
  href: string
  icon: NavigationIcon
  children: React.ReactNode
}

const NavItem = ({ href, icon, children }: NavItemProps) => (
  <div className="nav-item">
    <Link href={href} className={cn("flex items-center", surfaces.button.nav)}>
      {React.createElement(icon, { className: "text-md mr-2", strokeWidth: 2.5, size: 20 })}
      {children}
    </Link>
  </div>
);

interface DropdownNavItemProps {
  id: string
  href: string
  icon: NavigationIcon
  children: React.ReactNode
  dropdownContent: React.ReactNode
  isMobile?: boolean
  isOpen?: boolean
  onOpenChange?: (id: string | null, immediate?: boolean) => void
}

const DropdownNavItem = ({ id, href, icon, children, dropdownContent, isMobile = false, isOpen = false, onOpenChange }: DropdownNavItemProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange?.(null, true);
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isOpen, onOpenChange]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      onOpenChange?.(id, true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isMobile) {
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget instanceof Node && dropdownRef.current?.contains(relatedTarget)) {
        return;
      }
      onOpenChange?.(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      onOpenChange?.(isOpen ? null : id, true);
    }
  };

  return (
    <div
      className="nav-item relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        onClick={isMobile ? handleClick : undefined}
        className={cn("flex items-center justify-between w-full", surfaces.button.nav)}
      >
        <span className="flex items-center flex-1">
          {React.createElement(icon, { className: "text-md mr-2", strokeWidth: 2.5, size: 20 })}
          <span>{children}</span>
        </span>
        <ChevronDown className={`ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} size={16} />
      </Link>
      {isOpen && (
        <>
          {!isMobile && <div className="absolute left-0 top-full w-full h-1 z-50" />}
          <div className={isMobile ? 'relative w-full mt-2 ml-5 pr-4' : 'absolute left-0 mt-1 z-50 flex'}>
            {dropdownContent}
          </div>
        </>
      )}
    </div>
  );
};

interface NestedDropdownItemProps {
  children: React.ReactNode
  nestedContent: React.ReactNode
  icon: NavigationIcon
  isMobile?: boolean
  itemKey: string
  activeNested: string | null
  onNestedChange: (key: string | null, immediate?: boolean) => void
}

const NestedDropdownItem = ({ children, nestedContent, icon: Icon, isMobile = false, itemKey, activeNested, onNestedChange }: NestedDropdownItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isOpen = activeNested === itemKey;

  const handleMouseEnter = () => {
    if (!isMobile) {
      onNestedChange(itemKey, true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isMobile) {
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget instanceof Node && itemRef.current?.contains(relatedTarget)) {
        return;
      }
      onNestedChange(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      onNestedChange(isOpen ? null : itemKey, true);
    }
  };

  if (isMobile) {
    return (
      <div
        className="relative"
        ref={itemRef}
      >
        <button
          onClick={handleClick}
          className={cn("flex items-center justify-between w-full text-left px-4 py-3 text-sm", surfaces.button.dropdownItem)}
        >
          <span className="flex items-center flex-1">
            <Icon className="mr-3" strokeWidth={2.5} size={18} />
            {children}
          </span>
          <ChevronRight className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} strokeWidth={2.5} size={18} />
        </button>
        {isOpen && (
          <div className="relative mt-2 ml-5 pr-4 space-y-1">
            {nestedContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center justify-between w-full text-left px-4 py-3 text-sm",
          isOpen ? "bg-gray-700/40 text-white" : surfaces.button.dropdownItem
        )}
      >
        <span className="flex items-center flex-1">
          <Icon className="mr-3" strokeWidth={2.5} size={18} />
          {children}
        </span>
        <ChevronDown className={`transform transition-transform duration-200 ${isOpen ? '-rotate-90' : ''}`} strokeWidth={2.5} size={18} />
      </button>
      {isOpen && (
        <>
          <div className="absolute left-full top-0 w-4 h-full z-50" />
          <div
            className={cn(
              "absolute left-full top-0 ml-1 w-64 z-50",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200",
              surfaces.panel.dropdown
            )}
            onMouseEnter={() => onNestedChange(itemKey, true)}
            onMouseLeave={(e) => {
              const relatedTarget = e.relatedTarget as Node | null;
              if (relatedTarget instanceof Node && itemRef.current?.contains(relatedTarget)) return;
              onNestedChange(null);
            }}
          >
            {nestedContent}
          </div>
        </>
      )}
    </div>
  );
};

const renderNestedGroups = (groups: NavigationDropdownGroup[], isMobile: boolean) => {
  const hasAnyTitle = groups.some(group => group.title);

  return (
    <div className={hasAnyTitle ? 'py-2' : ''}>
      {groups.map((group, index) => (
        <div key={group.title || `group-${index}`}>
          {group.title && (
            <div
              className={cn(
                "text-[11px] uppercase tracking-wide",
                isMobile ? 'px-4 pt-1 pb-2' : 'px-5 pt-2 pb-2'
              )}
              style={{ color: colors.text.muted }}
            >
              {group.title}
            </div>
          )}
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center text-sm",
                isMobile ? 'px-4 py-2.5' : 'px-5 py-3',
                surfaces.button.dropdownItem
              )}
              {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {React.createElement(link.icon, { className: 'mr-3', strokeWidth: 2.5, size: 18 })}
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

const renderDropdownContent = (config: NavigationDropdownConfig, isMobile: boolean, activeNested: string | null, onNestedChange: (key: string | null, immediate?: boolean) => void) => (
  <div className={cn(isMobile ? 'w-full' : cn('w-64', surfaces.panel.dropdown))}>
    {config.items.map((item) => {
      if (item.type === 'link') {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 text-sm",
              isMobile ? 'py-2.5' : 'py-3',
              surfaces.button.dropdownItem
            )}
            onMouseEnter={() => {
              if (!isMobile && activeNested) {
                onNestedChange(null, true);
              }
            }}
          >
            {React.createElement(item.icon, { className: 'mr-3', strokeWidth: 2.5, size: 18 })}
            {item.label}
          </Link>
        )
      }

      return (
        <NestedDropdownItem
          key={`nested-${item.label}`}
          itemKey={`nested-${item.label}`}
          icon={item.icon}
          isMobile={isMobile}
          activeNested={activeNested}
          onNestedChange={onNestedChange}
          nestedContent={renderNestedGroups(item.groups, isMobile)}
        >
          {item.label}
        </NestedDropdownItem>
      )
    })}
  </div>
)

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeNested, setActiveNested] = useState<string | null>(null);
  const [showDesktopOverlay, setShowDesktopOverlay] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayOpenFrameRef = useRef<number | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nestedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveDropdown(null);
      setActiveNested(null);
    }
  };

  const handleDropdownChange = (id: string | null, immediate: boolean = false) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current);
      nestedTimeoutRef.current = null;
    }

    if (id !== null || immediate) {
      setActiveDropdown(id);
      setActiveNested(null);
    } else {
      dropdownTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
        setActiveNested(null);
        dropdownTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleNestedChange = (key: string | null, immediate: boolean = false) => {
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current);
      nestedTimeoutRef.current = null;
    }

    if (key !== null || immediate) {
      setActiveNested(key);
    } else {
      nestedTimeoutRef.current = setTimeout(() => {
        setActiveNested(null);
        nestedTimeoutRef.current = null;
      }, 300);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (overlayOpenFrameRef.current !== null) {
        cancelAnimationFrame(overlayOpenFrameRef.current);
        overlayOpenFrameRef.current = null;
      }
      if (overlayCloseTimeoutRef.current !== null) {
        clearTimeout(overlayCloseTimeoutRef.current);
        overlayCloseTimeoutRef.current = null;
      }
      setOverlayVisible(false);
      setShowDesktopOverlay(false);
    } else if (activeDropdown) {
      if (overlayCloseTimeoutRef.current !== null) {
        clearTimeout(overlayCloseTimeoutRef.current);
        overlayCloseTimeoutRef.current = null;
      }
      setShowDesktopOverlay(true);
      overlayOpenFrameRef.current = requestAnimationFrame(() => {
        setOverlayVisible(true);
        overlayOpenFrameRef.current = null;
      });
    } else {
      if (overlayOpenFrameRef.current !== null) {
        cancelAnimationFrame(overlayOpenFrameRef.current);
        overlayOpenFrameRef.current = null;
      }
      setOverlayVisible(false);
      overlayCloseTimeoutRef.current = setTimeout(() => {
        setShowDesktopOverlay(false);
        overlayCloseTimeoutRef.current = null;
      }, 300);
    }

    return () => {
      if (overlayOpenFrameRef.current !== null) {
        cancelAnimationFrame(overlayOpenFrameRef.current);
        overlayOpenFrameRef.current = null;
      }
      if (overlayCloseTimeoutRef.current !== null) {
        clearTimeout(overlayCloseTimeoutRef.current);
        overlayCloseTimeoutRef.current = null;
      }
    };
  }, [activeDropdown, isMobile]);

  return (
    <>
      {showDesktopOverlay && (
        <div
          className={cn(
            'fixed inset-0 z-30 pointer-events-none transition-all duration-300 opacity-0 backdrop-blur-none',
            overlayVisible && 'opacity-100 backdrop-blur-sm'
          )}
          aria-hidden="true"
        />
      )}
      <header className={cn(surfaces.panel.overlay, "sticky top-0 z-50 border-b")}>
        {isOpen && (
          <div
            className="fixed inset-0 backdrop-blur-md z-40 lg:hidden"
            onClick={toggleMenu}
          />
        )}
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center relative z-50">
          <Link
            href="/"
            className={cn(
              "text-2xl font-bold transition-all duration-300 hover:glow",
              "hover:text-white"
            )}
            style={{ color: colors.text.body }}
          >
            aidan.so
          </Link>
          <button
            onClick={toggleMenu}
            className="lg:hidden focus:outline-hidden"
            style={{ color: colors.text.body }}
          >
            {isOpen ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
          </button>
          <ul className={cn(
            "flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4",
            "absolute lg:static w-full lg:w-auto left-0 lg:left-auto top-full lg:top-auto",
            "px-2 py-4 lg:p-0 transition-all duration-300 ease-in-out z-50",
            "lg:bg-transparent",
            isOpen ? 'flex' : 'hidden lg:flex'
          )}
          style={{ backgroundColor: isMobile ? colors.backgrounds.cardSolid : undefined }}
          >
            {NAVIGATION_CONFIG.map((item) => {
              if (item.type === 'link') {
                return (
                  <NavItem key={item.id} href={item.href} icon={item.icon}>
                    {item.label}
                  </NavItem>
                )
              }

              return (
                <DropdownNavItem
                  key={item.id}
                  id={item.id}
                  href={item.href}
                  icon={item.icon}
                  dropdownContent={renderDropdownContent(item.dropdown, isMobile, activeNested, handleNestedChange)}
                  isMobile={isMobile}
                  isOpen={activeDropdown === item.id}
                  onOpenChange={handleDropdownChange}
                >
                  {item.label}
                </DropdownNavItem>
              )
            })}
          </ul>
        </nav>
      </header>
    </>
  );
}
