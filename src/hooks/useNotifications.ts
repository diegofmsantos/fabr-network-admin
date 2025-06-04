import { create } from 'zustand'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))

    // Auto remove após duration (padrão 5s)
    const duration = notification.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      }, duration)
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
  clearAll: () => set({ notifications: [] })
}))

export const useNotifications = () => {
  const { addNotification } = useNotificationStore()

  return {
    success: (title: string, message: string) =>
      addNotification({ type: 'success', title, message }),
    error: (title: string, message: string) =>
      addNotification({ type: 'error', title, message, duration: 8000 }),
    warning: (title: string, message: string) =>
      addNotification({ type: 'warning', title, message }),
    info: (title: string, message: string) =>
      addNotification({ type: 'info', title, message }),
  }
}