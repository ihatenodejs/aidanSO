'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { X, Menu, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { colors, surfaces } from '@/lib/theme'
import type {
  NavigationIcon,
  NavigationMenuItem,
  NavigationDropdownConfig,
  NavigationDropdownGroup
} from '@/lib/types/navigation'
import { headerNavigationConfig } from '../../lib/config/header'

const NAVIGATION_CONFIG: NavigationMenuItem[] = headerNavigationConfig

interface NavItemProps {
  href: string
  icon: NavigationIcon
  children: React.ReactNode
  onClick?: () => void
}

const NavItem = ({ href, icon, children, onClick }: NavItemProps) => (
  <div className="nav-item">
    <Link
      href={href}
      onClick={onClick}
      className={cn('flex items-center', surfaces.button.nav)}
    >
      {React.createElement(icon, {
        className: 'text-md mr-2',
        strokeWidth: 2.5,
        size: 20
      })}
      {children}
    </Link>
  </div>
)

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

const DropdownNavItem = ({
  id,
  href,
  icon,
  children,
  dropdownContent,
  isMobile = false,
  isOpen = false,
  onOpenChange
}: DropdownNavItemProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onOpenChange?.(null, true)
      }
    }

    if (isMobile && isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobile, isOpen, onOpenChange])

  const handleMouseEnter = () => {
    if (!isMobile) {
      onOpenChange?.(id, true)
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isMobile) {
      const relatedTarget = e.relatedTarget as Node | null
      if (
        relatedTarget instanceof Node &&
        dropdownRef.current?.contains(relatedTarget)
      ) {
        return
      }
      onOpenChange?.(null)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      e.stopPropagation()
      onOpenChange?.(isOpen ? null : id, true)
    }
  }

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
        className={cn(
          'flex w-full items-center justify-between',
          surfaces.button.nav
        )}
      >
        <span className="flex flex-1 items-center">
          {React.createElement(icon, {
            className: 'text-md mr-2',
            strokeWidth: 2.5,
            size: 20
          })}
          <span>{children}</span>
        </span>
        <ChevronDown
          className={`ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2.5}
          size={16}
        />
      </Link>
      {isOpen && (
        <>
          {!isMobile && (
            <div className="absolute top-full left-0 z-50 h-1 w-full" />
          )}
          <div
            className={
              isMobile
                ? 'relative mt-2 ml-5 w-full pr-4'
                : 'absolute left-0 z-50 mt-1 flex'
            }
          >
            {dropdownContent}
          </div>
        </>
      )}
    </div>
  )
}

interface NestedDropdownItemProps {
  children: React.ReactNode
  nestedContent: React.ReactNode
  icon: NavigationIcon
  isMobile?: boolean
  itemKey: string
  activeNested: string | null
  onNestedChange: (key: string | null, immediate?: boolean) => void
}

const NestedDropdownItem = ({
  children,
  nestedContent,
  icon: Icon,
  isMobile = false,
  itemKey,
  activeNested,
  onNestedChange
}: NestedDropdownItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const isOpen = activeNested === itemKey

  const handleMouseEnter = () => {
    if (!isMobile) {
      onNestedChange(itemKey, true)
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isMobile) {
      const relatedTarget = e.relatedTarget as Node | null
      if (
        relatedTarget instanceof Node &&
        itemRef.current?.contains(relatedTarget)
      ) {
        return
      }
      onNestedChange(null)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      e.stopPropagation()
      onNestedChange(isOpen ? null : itemKey, true)
    }
  }

  if (isMobile) {
    return (
      <div className="relative" ref={itemRef}>
        <button
          onClick={handleClick}
          className={cn(
            'flex w-full items-center justify-between px-4 py-3 text-left text-sm',
            surfaces.button.dropdownItem
          )}
        >
          <span className="flex flex-1 items-center">
            <Icon className="mr-3" strokeWidth={2.5} size={18} />
            {children}
          </span>
          <ChevronRight
            className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            strokeWidth={2.5}
            size={18}
          />
        </button>
        {isOpen && (
          <div className="relative mt-2 ml-5 space-y-1 pr-4">
            {nestedContent}
          </div>
        )}
      </div>
    )
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
          'flex w-full items-center justify-between px-4 py-3 text-left text-sm',
          isOpen ? 'bg-gray-700/40 text-white' : surfaces.button.dropdownItem
        )}
      >
        <span className="flex flex-1 items-center">
          <Icon className="mr-3" strokeWidth={2.5} size={18} />
          {children}
        </span>
        <ChevronDown
          className={`transform transition-transform duration-200 ${isOpen ? '-rotate-90' : ''}`}
          strokeWidth={2.5}
          size={18}
        />
      </button>
      {isOpen && (
        <>
          <div className="absolute top-0 left-full z-50 h-full w-4" />
          <div
            className={cn(
              'absolute top-0 left-full z-50 ml-1 w-64',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200',
              surfaces.panel.dropdown
            )}
            onMouseEnter={() => onNestedChange(itemKey, true)}
            onMouseLeave={(e) => {
              const relatedTarget = e.relatedTarget as Node | null
              if (
                relatedTarget instanceof Node &&
                itemRef.current?.contains(relatedTarget)
              )
                return
              onNestedChange(null)
            }}
          >
            {nestedContent}
          </div>
        </>
      )}
    </div>
  )
}

const renderNestedGroups = (
  groups: NavigationDropdownGroup[],
  isMobile: boolean,
  onLinkClick?: () => void
) => {
  const hasAnyTitle = groups.some((group) => group.title)

  return (
    <div className={hasAnyTitle ? 'py-2' : ''}>
      {groups.map((group, index) => (
        <div key={group.title || `group-${index}`}>
          {group.title && (
            <div
              className={cn(
                'text-[11px] tracking-wide uppercase',
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
              onClick={onLinkClick}
              className={cn(
                'flex items-center text-sm',
                isMobile ? 'px-4 py-2.5' : 'px-5 py-3',
                surfaces.button.dropdownItem
              )}
              {...(link.external && {
                target: '_blank',
                rel: 'noopener noreferrer'
              })}
            >
              {React.createElement(link.icon, {
                className: 'mr-3',
                strokeWidth: 2.5,
                size: 18
              })}
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

const renderDropdownContent = (
  config: NavigationDropdownConfig,
  isMobile: boolean,
  activeNested: string | null,
  onNestedChange: (key: string | null, immediate?: boolean) => void,
  onLinkClick?: () => void
) => (
  <div
    className={cn(isMobile ? 'w-full' : cn('w-64', surfaces.panel.dropdown))}
  >
    {config.items.map((item) => {
      if (item.type === 'link') {
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center px-4 text-sm',
              isMobile ? 'py-2.5' : 'py-3',
              surfaces.button.dropdownItem
            )}
            onMouseEnter={() => {
              if (!isMobile && activeNested) {
                onNestedChange(null, true)
              }
            }}
          >
            {React.createElement(item.icon, {
              className: 'mr-3',
              strokeWidth: 2.5,
              size: 18
            })}
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
          nestedContent={renderNestedGroups(item.groups, isMobile, onLinkClick)}
        >
          {item.label}
        </NestedDropdownItem>
      )
    })}
  </div>
)

interface HeaderProps {
  onMobileMenuChange?: (isOpen: boolean) => void
}

export default function Header({ onMobileMenuChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activeNested, setActiveNested] = useState<string | null>(null)
  const [showDesktopOverlay, setShowDesktopOverlay] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const overlayCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const overlayOpenFrameRef = useRef<number | null>(null)

  const toggleMenu = useCallback(() => {
    setIsOpen((previous) => {
      if (previous) {
        setActiveDropdown(null)
        setActiveNested(null)
      }
      return !previous
    })
  }, [])

  const handleDropdownChange = useCallback((id: string | null) => {
    setActiveDropdown(id)
    setActiveNested(null)
  }, [])

  const handleNestedChange = useCallback((key: string | null) => {
    setActiveNested(key)
  }, [])

  const closeMenu = useCallback(() => {
    if (isMobile && isOpen) {
      setIsOpen(false)
    }
    setActiveDropdown(null)
    setActiveNested(null)
  }, [isMobile, isOpen])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    onMobileMenuChange?.(isOpen)
  }, [isOpen, onMobileMenuChange])

  useEffect(() => {
    let visibilityTimeout: ReturnType<typeof setTimeout> | null = null

    if (isMobile) {
      if (overlayOpenFrameRef.current !== null) {
        cancelAnimationFrame(overlayOpenFrameRef.current)
        overlayOpenFrameRef.current = null
      }
      if (overlayCloseTimeoutRef.current !== null) {
        clearTimeout(overlayCloseTimeoutRef.current)
        overlayCloseTimeoutRef.current = null
      }
      visibilityTimeout = setTimeout(() => {
        setOverlayVisible(false)
        setShowDesktopOverlay(false)
      }, 0)
    } else if (activeDropdown) {
      if (overlayCloseTimeoutRef.current !== null) {
        clearTimeout(overlayCloseTimeoutRef.current)
        overlayCloseTimeoutRef.current = null
      }
      visibilityTimeout = setTimeout(() => {
        setShowDesktopOverlay(true)
      }, 0)
      overlayOpenFrameRef.current = requestAnimationFrame(() => {
        setOverlayVisible(true)
        overlayOpenFrameRef.current = null
      })
    } else {
      if (overlayOpenFrameRef.current !== null) {
        cancelAnimationFrame(overlayOpenFrameRef.current)
        overlayOpenFrameRef.current = null
      }
      visibilityTimeout = setTimeout(() => {
        setOverlayVisible(false)
      }, 0)
      overlayCloseTimeoutRef.current = setTimeout(() => {
        setShowDesktopOverlay(false)
        overlayCloseTimeoutRef.current = null
      }, 300)
    }

    return () => {
      if (visibilityTimeout !== null) {
        clearTimeout(visibilityTimeout)
      }
      if (overlayOpenFrameRef.current !== null) {
        cancelAnimationFrame(overlayOpenFrameRef.current)
        overlayOpenFrameRef.current = null
      }
      if (overlayCloseTimeoutRef.current !== null) {
        clearTimeout(overlayCloseTimeoutRef.current)
        overlayCloseTimeoutRef.current = null
      }
    }
  }, [activeDropdown, isMobile])

  return (
    <>
      {showDesktopOverlay && (
        <div
          className={cn(
            'pointer-events-none fixed inset-0 z-30 opacity-0 backdrop-blur-none transition-all duration-300',
            overlayVisible && 'opacity-100 backdrop-blur-sm'
          )}
          aria-hidden="true"
        />
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-md lg:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
      <header
        className={cn(surfaces.panel.overlay, 'sticky top-0 z-50 border-b')}
      >
        <nav className="relative flex items-center justify-between px-4 py-4">
          <Link
            href="/"
            className={cn(
              'hover:glow text-2xl font-bold transition-all duration-300',
              'hover:text-white'
            )}
            style={{ color: colors.text.body }}
          >
            aidan.so
          </Link>
          <button
            onClick={toggleMenu}
            className="focus:outline-hidden lg:hidden"
            style={{ color: colors.text.body }}
          >
            {isOpen ? (
              <X className="text-2xl" />
            ) : (
              <Menu className="text-2xl" />
            )}
          </button>
          <ul
            className={cn(
              'flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4',
              'absolute top-full left-0 w-full lg:static lg:top-auto lg:left-auto lg:w-auto',
              'z-50 px-2 py-4 transition-all duration-300 ease-in-out lg:p-0',
              'lg:bg-transparent',
              isOpen ? 'flex' : 'hidden lg:flex'
            )}
            style={{
              backgroundColor: isMobile
                ? colors.backgrounds.cardSolid
                : undefined
            }}
          >
            {NAVIGATION_CONFIG.map((item) => {
              if (item.type === 'link') {
                return (
                  <NavItem
                    key={item.id}
                    href={item.href}
                    icon={item.icon}
                    onClick={closeMenu}
                  >
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
                  dropdownContent={renderDropdownContent(
                    item.dropdown,
                    isMobile,
                    activeNested,
                    handleNestedChange,
                    closeMenu
                  )}
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
  )
}
