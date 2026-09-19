import { useMemo } from 'react'
import { toast } from 'sonner'

type NotificationId = string | number

// Todas as mutations do painel chamam este hook. Os avisos são exibidos pelo
// <Toaster /> do sonner montado em app/layout.tsx.
export function useNotifications() {
  return useMemo(() => {
    const success = (title: string, message?: string, duration?: number): NotificationId =>
      toast.success(title, { description: message, duration })

    const error = (title: string, message?: string, duration?: number): NotificationId => {
      console.error(`❌ ${title}`, message || '')
      return toast.error(title, { description: message, duration: duration ?? 8000 })
    }

    const warning = (title: string, message?: string, duration?: number): NotificationId =>
      toast.warning(title, { description: message, duration })

    const info = (title: string, message?: string, duration?: number): NotificationId =>
      toast.info(title, { description: message, duration })

    return { success, error, warning, info }
  }, [])
}
