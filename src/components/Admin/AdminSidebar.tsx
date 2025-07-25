"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Trophy, BarChart3, Home, ChevronDown, ChevronRight } from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  href: string
  icon: any
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
 
  {
    id: 'superliga',
    label: 'Superliga',
    href: '/admin/superliga',
    icon: Trophy,
    children: [
      {
        id: 'superliga-list',
        label: 'Gerenciar',
        href: '/admin/superliga', 
        icon: Trophy
      },
      {
        id: 'superliga-criar',
        label: 'Criar Nova',
        href: '/admin/superliga/criar',
        icon: Trophy
      }
    ]
  }
]

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['campeonatos'])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.href)

    return (
      <div key={item.id} className=''>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-left text-md font-medium rounded-md transition-colors duration-300 hover:bg-[#373740]
              ${active ? 'bg-[#373740] text-[#63E300]' : 'text-gray-300 hover:bg-[#373740] hover:text-[#63E300]'
              }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center px-3 py-2 text-md font-medium rounded-md transition-colors
              ${active
                ? 'bg-[#373740] text-[#63E300]'
                : 'text-gray-300 hover:bg-[#373740] hover:text-[#63E300]'
              }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            <Icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 xl:pt-8">
      <div className="flex flex-col flex-grow bg-[#272731] border-r border-gray-700 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo-fabr-color.png"
              alt="FABR Network Admin"
              width={150}
              height={40}
              className="h-16 w-auto"
            />
          </Link>
        </div>

        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {sidebarItems.map(item => renderSidebarItem(item))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#1C1C24] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#63E300]">Admin</p>
              <p className="text-xs font-medium text-[#63E300]">FABR Network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}