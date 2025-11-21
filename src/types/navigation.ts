/**
 * Navigation type definitions
 */

/**
 * Navigation item type
 */
export interface NavigationItem {
  id: string
  label: string
  icon: string
  path: string
  active?: boolean
  badge?: number
}

/**
 * Sidebar navigation structure
 */
export type SidebarNavigation = NavigationItem[]

