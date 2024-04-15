import { cx } from 'class-variance-authority'
import type { CxOptions } from 'class-variance-authority'
import {
  createTailwindMerge,
  getDefaultConfig
} from 'tailwind-merge'
import type { RecursiveKeyValuePair } from 'tailwindcss/types/config'

import tailwindConfig from '~/../tailwind.config'

function getAllColorsName(
  obj: RecursiveKeyValuePair<string, string>,
  path: string = ''
): string[] {
  const paths: string[] = []
  for (const key in obj) {
    const newPath = path ? `${ path }-${ key }` : key
    if (typeof obj[key] === 'object') {
      // @ts-expect-error all object keys are strings
      paths.push(...getAllColorsName(obj[key], newPath))
    } else {
      paths.push(newPath)
    }
  }
  return paths
}

const twMerge = createTailwindMerge(() => {
  const config = getDefaultConfig()
  if (
    typeof tailwindConfig.theme?.fontSize !== 'function' &&
    tailwindConfig.theme?.fontSize
  ) {
    // @ts-expect-error config is not read-only
    config.classGroups['font-size'] = [
      { text: Object.keys(tailwindConfig.theme.fontSize) }
    ]
  }
  if (
    typeof tailwindConfig.theme?.colors !== 'function' &&
    tailwindConfig.theme?.colors
  ) {
    // @ts-expect-error config is not read-only
    config.theme.colors = getAllColorsName(tailwindConfig.theme.colors)
  }
  return config
})

export function cn(...inputs: CxOptions) {
  return twMerge(cx(...inputs))
}
