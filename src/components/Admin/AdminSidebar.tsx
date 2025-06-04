"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  Trophy, 
  Calendar, 
  BarChart3, 
  Settings, 
  Users, 
  Home,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  href: string
  icon: any
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: Home
  },
  {
    id: 'campeonatos',
    label: 'Campeonatos',
    href: '/admin/campeonatos',
    icon: Trophy,
    children: [
      {
        id: 'campeonatos-list',
        label: 'Listar',
        href: '/admin/campeonatos',
        icon: Trophy
      },
      {
        id: 'campeonatos-criar',
        label: 'Criar Novo',
        href: '/admin/campeonatos/criar',
        icon: Trophy
      }
    ]
  },
  {
    id: 'dashboard-stats',
    label: 'Estatísticas',
    href: '/admin/dashboard',
    icon: BarChart3
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    href: '/admin/configuracoes',
    icon: Settings
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
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium rounded-md transition-colors
              ${active 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${active 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/assets/logo-fabr-color.png"
              alt="FABR Network Admin"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {sidebarItems.map(item => renderSidebarItem(item))}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin</p>
              <p className="text-xs font-medium text-gray-500">FABR Network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}