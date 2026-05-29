<script setup lang="ts">
import { ArrowLeft, Key, Plus, User } from '@iconoir/vue'
import { computed, ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

import CircleSpinner from '@/assets/spinner/circle-spinner.vue'
import { Switch } from '@/components/common'
import FormInput from '@/components/common/form-input.vue'
import FormWrapper from '@/components/common/form-wrapper.vue'

import { POKEMON_CONTEXT } from '../config'
import type { usePokemon } from '../hooks/use-pokemon'

const route = useRoute()
const router = useRouter()

const TABS = [
  { id: 'profile', label: 'Profil' },
  { id: 'password', label: 'Ubah Sandi' },
] as const

const activeTab = ref<(typeof TABS)[number]['id']>('profile')
const activeTabIndex = computed(() => TABS.findIndex(tab => tab.id === activeTab.value))

const { currentProfilePosition } = inject(POKEMON_CONTEXT) as ReturnType<typeof usePokemon>
</script>

<template>
  <div
    class="fixed sm:absolute flex inset-0 bg-white z-3 rounded-xl overflow-hidden transition-transform duration-300"
    :class="currentProfilePosition"
  >
    <FormWrapper
      class="flex flex-col min-w-full p-4 pb-0 h-full transition-transform duration-300"
      :style="{ transform: `translateX(-${activeTabIndex * 100}%)` }"
    >
      <div class="flex gap-4 items-center justify-between">
        <button
          class="flex items-center font-semibold text-fill-1 xs:text-lg group shrink-0"
          @click="router.push({ query: { ...route.query, is_profile: undefined } })"
        >
          <i
            class="w-7 h-7 rounded-full grid place-items-center group-hover:bg-fill-0/20 group-active:bg-fill-0/40
              transition duration-300 -translate-x-1"
          >
            <ArrowLeft class="h-4 w-auto text-fill-1 stroke-4" />
          </i>
          <span class="ml-1">{{ TABS[activeTabIndex].label }}</span>
        </button>
        <button
          class="h-9 font-semibold grid place-items-center rounded-full bg-rose-200 text-slate-800 hover:bg-rose-300/80
            active:bg-rose-300 transition duration-300 px-4 disabled:opacity-50 shrink-0"
        >
          Simpan
        </button>
      </div>
      <div class="py-5 flex flex-col gap-5 items-center border-b-4 border-slate-200">
        <div class="w-36 h-36 bg-slate-200 rounded-full grid place-items-center relative">
          <User class="text-slate-500 stroke-2 w-24 h-24" />
          <label
            class="w-13.5 h-13.5 rounded-full grid place-items-center bg-rose-400 hover:bg-rose-500 transition-colors
              duration-300 active:bg-rose-600 absolute bottom-0 right-0 border-5 border-white"
          >
            <input
              accept="image/*"
              type="file"
              name="profile-picture"
              class="hidden"
              @click="({ target }: any) => (target.value = null)"
            />
            <CircleSpinner />
            <Plus class="text-white w-9 h-9 stroke-3" />
          </label>
        </div>
        <FormInput id="name" name="name" placeholder="Masukkan namamu ..." class="w-full lg:max-w-9/10">
          <template #prefix>
            <User class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
          </template>
        </FormInput>
      </div>
      <div class="flex-1 flex flex-col justify-between min-h-0">
        <div class="flex-1 overflow-y-auto min-h-0">
          <b class="block mt-6 xs:text-lg font-bold">Autentikasi</b>
          <div class="mt-4 flex items-center justify-between gap-6 border-b-2 border-slate-200 pb-2.5">
            <div>
              <b class="text-sm xs:text-base font-semibold">Login dengan Biometrik</b>
              <p class="text-xs xs:text-sm">Aktivasi fitur login dengan biometrik.</p>
            </div>
            <Switch id="biometric" name="biometric" />
          </div>
          <div class="mt-4 flex items-center justify-between gap-6 border-b-2 border-slate-200 pb-2.5">
            <div>
              <b class="text-sm xs:text-base font-semibold">Login dengan 2FA</b>
              <p class="text-xs xs:text-sm">Aktivasi perlindungan ekstra dengan permintaan kode OTP tiap kali login.</p>
            </div>
            <Switch id="2fa" name="2fa" />
          </div>
        </div>
        <div class="flex justify-center items-center h-14 shrink-0">
          <div class="flex p-1 bg-slate-100 rounded-full relative w-full h-10">
            <button
              v-for="tab in TABS"
              :key="tab.id"
              type="button"
              class="relative z-1 flex-1 h-full text-sm font-bold transition-colors duration-300"
              :class="activeTab === tab.id ? 'text-fill-1' : 'text-slate-500'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
            <div
              class="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300"
              :style="{
                left: `calc(${(activeTabIndex * 100) / TABS.length}% + 4px)`,
                width: `calc(${100 / TABS.length}% - 8px)`,
              }"
            />
          </div>
        </div>
      </div>
    </FormWrapper>
    <FormWrapper
      class="flex flex-col min-w-full p-4 pb-0 h-full transition-transform duration-300"
      :style="{ transform: `translateX(-${activeTabIndex * 100}%)` }"
    >
      <div class="flex gap-4 items-center justify-between">
        <button
          class="flex items-center font-semibold text-fill-1 xs:text-lg group shrink-0"
          @click="router.push({ query: { ...route.query, is_profile: undefined } })"
        >
          <i
            class="w-7 h-7 rounded-full grid place-items-center group-hover:bg-fill-0/20 group-active:bg-fill-0/40
              transition duration-300 -translate-x-1"
          >
            <ArrowLeft class="h-4 w-auto text-fill-1 stroke-4" />
          </i>
          <span class="ml-1">{{ TABS[activeTabIndex].label }}</span>
        </button>
        <button
          class="h-9 font-semibold grid place-items-center rounded-full bg-rose-200 text-slate-800 hover:bg-rose-300/80
            active:bg-rose-300 transition duration-300 px-4 disabled:opacity-50 shrink-0"
        >
          Simpan
        </button>
      </div>
      <div class="flex-1 overflow-y-auto mt-6">
        <div class="flex flex-col gap-5">
          <FormInput
            id="current_password"
            name="current_password"
            type="password"
            label="Kata Sandi Sekarang"
            placeholder="Masukkan kata sandi sekarang ..."
          >
            <template #prefix>
              <Key class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
            </template>
          </FormInput>
          <FormInput
            id="new_password"
            name="new_password"
            type="password"
            label="Kata Sandi Baru"
            placeholder="Masukkan kata sandi baru ..."
          >
            <template #prefix>
              <Key class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
            </template>
          </FormInput>
          <FormInput
            id="confirm_password"
            name="confirm_password"
            type="password"
            label="Konfirmasi Kata Sandi Baru"
            placeholder="Ulangi kata sandi baru ..."
          >
            <template #prefix>
              <Key class="h-4.5 w-4.5 stroke-3 *:stroke-slate-500/90" />
            </template>
          </FormInput>
        </div>
      </div>
      <div class="flex justify-center items-center h-14 shrink-0">
        <div class="flex p-1 bg-slate-100 rounded-full relative w-full h-10">
          <button
            v-for="tab in TABS"
            :key="tab.id"
            type="button"
            class="relative z-1 flex-1 h-full text-sm font-bold transition-colors duration-300"
            :class="activeTab === tab.id ? 'text-fill-1' : 'text-slate-500'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
          <div
            class="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300"
            :style="{
              left: `calc(${(activeTabIndex * 100) / TABS.length}% + 4px)`,
              width: `calc(${100 / TABS.length}% - 8px)`,
            }"
          />
        </div>
      </div>
    </FormWrapper>
  </div>
</template>
