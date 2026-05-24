<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'

import { FOOTER_MENUS } from '@/constants/layout'
import { focusById } from '@/utils/general'

const { replace } = useRouter()
const route = useRoute()

const currentRoute = computed(() => route)

const isCenter = (idx: number) => idx === Math.ceil(FOOTER_MENUS.length / 2) - 1
const isSelected = (name: string) => {
  const { query, path } = currentRoute.value
  return query.page === name.toLowerCase() || (path === '/' && !query.page && name === FOOTER_MENUS[0].name)
}
const noCenter = computed(() => (route.query.page === 'wilayah' && !route.query.region_p) || route.query.is_profile)

const handleUpdateMenu = (idx: number, name: string) => {
  if (isCenter(idx)) {
    const { filter, ...query } = route.query
    if (!filter) {
      replace({ path: '/', query: { ...query, filter: 'true' } })
      focusById('search-p')
      return
    }
    return replace({ path: '/', query })
  }
  replace({ path: '/', query: { page: name.toLowerCase() } })
}
</script>

<template>
  <main>
    <footer
      style="view-transition-name: layout-footer"
      class="fixed sm:hidden bottom-0 bg-white shadow-blur-y-inv-1 shadow-gray-200 w-full px-mobile rounded-t-5 z-10"
    >
      <div class="flex items-center justify-around h-13 xs:h-15">
        <button
          v-for="(menu, idx) in FOOTER_MENUS"
          :key="menu.name"
          :class="[
            'relative flex items-center justify-center gap-x-4 flex-col w-full group',
            isCenter(idx) ? `-translate-y-6 xs:-translate-y-6.5 ${noCenter ? 'hidden' : ''}` : 'xs:translate-y-2',
          ]"
          @click="handleUpdateMenu(idx, menu.name)"
        >
          <i
            :class="[
              'duration-300',
              isCenter(idx)
                ? `w-15 h-15 xs:w-17 xs:h-17 rounded-full grid place-items-center bg-fighting-1 group-hover:bg-fill-1/90
                  group-active:bg-fill-1 border-4 border-white/60 transition-colors shadow-blur-4 shadow-fighting-0`
                : 'xs:translate-y-0 transition-transform',
              { 'xs:-translate-y-2!': isSelected(menu.name) },
            ]"
          >
            <component
              :is="menu.icon"
              :class="[
                'h-auto',
                isCenter(idx)
                  ? 'w-6.5 xs:w-8 text-white'
                  : `w-5 xs:w-6 text-slate-500 group-hover:text-slate-600 transition-colors duration-300
                    group-hover:*:stroke-2 *:transition-all *:duration-300`,
                { 'text-fill-1! *:stroke-2!': isSelected(menu.name) },
              ]"
            />
          </i>
          <span
            :class="[
              'text-fighting-1 group-disabled:text-normal-1! transition-all duration-300 hidden xs:inline',
              isCenter(idx)
                ? '-translate-y-5.25 xs:translate-y-1 text-base font-bold'
                : 'text-xs font-semibold opacity-0 -translate-y-2',
              { 'opacity-100 -translate-y-1.5!': isSelected(menu.name) },
            ]"
          >
            {{ menu.name }}
          </span>
        </button>
      </div>
    </footer>
    <div class="flex-1 overflow-hidden" style="view-transition-name: layout-content">
      <router-view />
    </div>
  </main>
</template>
