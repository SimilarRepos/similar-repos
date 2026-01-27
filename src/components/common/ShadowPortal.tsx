import * as React from 'react'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import themeCss from '@/assets/tailwind/theme.css?inline'
import { useElement } from '@/hooks/useElement'

interface Props {
  selector: string // 宿主选择器
  className?: string // 注入容器的类名
  position?: 'prepend' | 'append'
  injetStyle?: boolean
  rootClassName?: string
  children: React.ReactNode
}

export const ShadowPortal: React.FC<Props> = ({
  selector,
  className,
  position = 'append',
  injetStyle = false,
  rootClassName = '',
  children,
  ...rest
}) => {
  const targetElement = useElement(selector)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)

  useLayoutEffect(() => {
    if (!targetElement) {
      return
    }

    const existingId = `${className || 'default'}`
    if (targetElement.querySelector(`#${existingId}`))
      return

    const host = document.createElement('div')
    host.id = existingId
    host.style.cssText = `width:100%;height:100%;`
    if (className)
      host.className = className

    const shadow = host.attachShadow({ mode: 'open' })

    if (injetStyle) {
      const style = shadow.ownerDocument.createElement('style')
      style.textContent = themeCss
      shadow.appendChild(style)
    }

    // 挂载
    if (position === 'prepend') {
      targetElement.insertBefore(host, targetElement.firstChild)
    }
    else {
      targetElement.appendChild(host)
    }

    setShadowRoot(shadow)

    return () => {
      host.remove()
    }
  }, [targetElement, className, position, injetStyle])

  if (!shadowRoot)
    return null

  return createPortal(
    <div className={`sr-portal-root ${rootClassName}`} {...rest}>
      {children}
    </div>,
    shadowRoot as unknown as Element,
  )
}
