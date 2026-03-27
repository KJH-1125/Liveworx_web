import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const defaults: IconProps = {
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Icon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      {children}
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </Icon>
  )
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 18L18 6M6 6l12 12" />
    </Icon>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.75 19.5L8.25 12l7.5-7.5" />
    </Icon>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </Icon>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </Icon>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </Icon>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </Icon>
  )
}

export function DashboardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </Icon>
  )
}

// 메뉴 아이콘
export function ClipboardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 5.25A2.25 2.25 0 0111.25 3h1.5A2.25 2.25 0 0115 5.25M9 5.25A2.25 2.25 0 006.75 7.5v11.25A2.25 2.25 0 009 21h6a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0015 5.25M9 5.25h6" />
    </Icon>
  )
}

export function ArchiveIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </Icon>
  )
}

export function CogIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m4.894 5.718L12 12M5.106 6.215L12 12" />
    </Icon>
  )
}

export function TruckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-5.25v5.25m0 0H2.25m12.75 0h3.75m-3.75 0V8.625c0-.621-.504-1.125-1.125-1.125H13.5m-3.75 6.75V8.625c0-.621-.504-1.125-1.125-1.125H6m0 0H2.25m4.5-3h9.75" />
    </Icon>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </Icon>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </Icon>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </Icon>
  )
}

export function FolderIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </Icon>
  )
}

export function FileIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </Icon>
  )
}

export function BuildingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </Icon>
  )
}

// icon name → component 매핑
export const iconMap: Record<string, React.ComponentType<IconProps>> = {
  clipboard: ClipboardIcon,
  archive: ArchiveIcon,
  cog: CogIcon,
  truck: TruckIcon,
  settings: SettingsIcon,
  dashboard: DashboardIcon,
  folder: FolderIcon,
  file: FileIcon,
  building: BuildingIcon,
}
