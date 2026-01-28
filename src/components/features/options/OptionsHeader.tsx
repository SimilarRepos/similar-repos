import { i18n } from '#imports'
import logo from '@/assets/icons/logo-128.png'

interface OptionsHeaderProps {
  className?: string
}

export function OptionsHeader({ className }: OptionsHeaderProps) {
  const handleClick = () => {
    window.location.hash = '#/'
  }

  return (
    <header
      className={`flex w-full sticky top-0 h-13 bg-primary/90 shadow-md transition-shadow border-0 group items-center p-3 text-lg ${className || ''}`}
    >
      <div className="flex items-center cursor-pointer" onClick={handleClick}>
        <img className="w-9 h-9 rounded" src={logo} alt="logo" />
        <span className="ml-2 text-accent font-semibold">
          {i18n.t('options.header.title')}
        </span>
      </div>
    </header>
  )
}
