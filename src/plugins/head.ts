import { watch } from '@vue/runtime-core'
import { useRoute } from 'vue-router'

import { getHeadProps } from '@/constants/plugin'
import { getByAny } from '@/utils/general'

type THeadProps = {
  title: string
  description: string
  ogImage: string
  keywords: string
}

export function useHead() {
  const { path, query } = useRoute()

  const updateHead = () => {
    let currentPath = path
    if (Object.keys(query).length && Object.keys(query)[0] !== '*') {
      const arrPath = path.split('/')
      const idLocation = arrPath.findIndex(p => p === Object.values(query)[0])
      arrPath[idLocation] = '[id]'
      currentPath = arrPath.join('/')
    }
    const { title, description, keywords, ogImage } = getHeadProps(currentPath) as THeadProps
    const href = window.location.href

    const fragment = document.createDocumentFragment()
    document.title = title

    let canonical = getByAny('link[rel="canonical"]') as HTMLLinkElement
    if (canonical) {
      canonical.href = href
    } else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = href
      fragment.appendChild(canonical)
    }

    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let meta = getByAny(`meta[${attr}="${name}"]`)

      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, name)
        fragment.appendChild(meta)
      }

      meta.setAttribute('content', content)
    }

    updateMeta('description', description)
    updateMeta('keywords', keywords)

    updateMeta('og:type', 'website', true)
    updateMeta('og:title', title, true)
    updateMeta('og:description', description, true)
    updateMeta('og:image', ogImage, true)
    updateMeta('og:site_name', 'Komlabs', true)
    updateMeta('og:locale', 'id_ID', true)
    updateMeta('og:url', href, true)

    updateMeta('twitter:title', title, true)
    updateMeta('twitter:description', description, true)
    updateMeta('twitter:image', ogImage, true)
    updateMeta('twitter:card', 'summary_large_image', true)
    updateMeta('twitter:url', href, true)

    if (fragment.children.length > 0) {
      document.head.appendChild(fragment)
    }
  }

  watch(() => path, updateHead, { immediate: true })
}
