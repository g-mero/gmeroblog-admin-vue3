


export type MenuItem = MenuItemWithChild | MenuItemWithTo

export interface MenuItemWithTo {
  title: string
  icon: string
  to: string
  rank: number
  children?: undefined
}

export interface MenuItemWithChild {
  title: string
  icon?: string
  rank: number
  to?: undefined
  children: MenuItemWithTo[]
}


