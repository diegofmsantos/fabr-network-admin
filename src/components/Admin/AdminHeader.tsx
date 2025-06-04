"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Search, Menu, User, LogOut, Settings } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'error'
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Novo jogo finalizado',
    message: 'Flamengo 28 x 14 Vasco - Classificação atualizada',
    time: '5 min atrás',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Campeonato iniciado',
    message: 'Brasileirão 2025 foi iniciado com sucesso',
    time: '1 hora atrás',
    read: true,
    type: 'success'
  }
]

export const AdminHeader: React.FC = () => {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard'
    if (pathname.includes('/campeonatos/criar')) return 'Criar Campeonato'
    if (pathname.includes('/campeonatos')) return 'Campeonatos'
    if (pathname.includes('/dashboard')) return 'Estatísticas'
    return 'Admin'
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="lg:pl-64">
      <div className="flex h-16 flex-shrink-0 border-b border-gray-700 bg-[#272731] lg:border-none">
        {/* Mobile menu button */}
        <button
          type="button"
          className="border-r border-gray-700 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#63E300] lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search section */}
        <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:px-8">
          <div className="flex flex-1 items-center">
            <h1 className="text-2xl font-semibold text-white">
              {getPageTitle()}
            </h1>
          </div>

          <div className="ml-4 flex items-center md:ml-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="block w-full rounded-md bg-[#1C1C24] border-gray-700 pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#63E300] focus:ring-[#63E300]"
              />
            </div>

            {/* Notifications */}
            <div className="relative ml-3">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-full bg-[#1C1C24] p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#63E300] focus:ring-offset-2 focus:ring-offset-[#272731] transition-colors"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-400 text-center text-xs font-medium leading-4 text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-[#272731] py-1 shadow-lg ring-1 ring-gray-700 ring-opacity-50 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Notificações</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-[#63E300] hover:text-[#50B800] transition-colors"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-400">
                        Nenhuma notificação
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`cursor-pointer px-4 py-3 hover:bg-[#1C1C24] transition-colors ${!notification.read ? 'bg-[#1C1C24]' : ''
                            }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-400">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="ml-2 mt-1 h-2 w-2 rounded-full bg-[#63E300]"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative ml-3">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex max-w-xs items-center rounded-full bg-[#1C1C24] text-sm focus:outline-none focus:ring-2 focus:ring-[#63E300] focus:ring-offset-2 focus:ring-offset-[#272731]"
              >
                <div className="h-8 w-8 rounded-full bg-[#63E300] flex items-center justify-center">
                  <User className="h-5 w-5 text-black" />
                </div>
              </button>
              {/* User dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#272731] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1C1C24] hover:text-white transition-colors"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Perfil
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1C1C24] hover:text-white transition-colors"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Configurações
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1C1C24] hover:text-white transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sair
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}