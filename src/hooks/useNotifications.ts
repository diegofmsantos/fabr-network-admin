// src/hooks/useNotifications.ts
import { Notification } from '@/types'
import { useState, useCallback } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      duration: notification.duration || 5000,
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remover após o tempo especificado
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, newNotification.duration)
    }

    return newNotification.id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Métodos de conveniência
  const success = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration })
  }, [addNotification])

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration: duration || 8000 })
  }, [addNotification])

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration })
  }, [addNotification])

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration })
  }, [addNotification])

  // Log no console para desenvolvimento
  const logNotification = useCallback((notification: Notification) => {
    const emoji = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }

    console.log(`${emoji[notification.type]} ${notification.title}`, notification.message || '')
  }, [])

  // Usar console.log como fallback simples por enquanto
  const successWithLog = useCallback((title: string, message?: string, duration?: number) => {
    console.log(`✅ ${title}`, message || '')
    return success(title, message, duration)
  }, [success])

  const errorWithLog = useCallback((title: string, message?: string, duration?: number) => {
    console.error(`❌ ${title}`, message || '')
    return error(title, message, duration)
  }, [error])

  const warningWithLog = useCallback((title: string, message?: string, duration?: number) => {
    console.warn(`⚠️ ${title}`, message || '')
    return warning(title, message, duration)
  }, [warning])

  const infoWithLog = useCallback((title: string, message?: string, duration?: number) => {
    console.log(`ℹ️ ${title}`, message || '')
    return info(title, message, duration)
  }, [info])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success: successWithLog,
    error: errorWithLog,
    warning: warningWithLog,
    info: infoWithLog,
  }
}