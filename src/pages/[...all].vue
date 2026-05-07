<template>
  <div
    style="view-transition-name: layout-content"
    class="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-5 lg:gap-7 py-5 sm:py-7 lg:py-9"
  >
    <div class="w-3/4 grid place-items-center">
      <img
        alt="not-found"
        class="grayscale"
        fetchPriority="high"
        height="430"
        loading="eager"
        src="https://res.cloudinary.com/dxa4bdtdx/image/upload/notfound_iav02l.avif"
        width="370"
      />
    </div>
    <p class="font-bold text-3xl text-center text-fighting-1">404 Not Found</p>
    <router-link
      class="group bg-fighting-1 min-h-12 rounded-3xl px-5 flex items-center gap-2 text-white whitespace-nowrap
        font-semibold"
      to="/"
    >
      Kembali ke Beranda
      <img
        alt="arrow"
        class="w-0 h-auto group-hover:w-7 group-active:w-7 transition-all duration-500 grayscale"
        height="28"
        loading="eager"
        src="https://res.cloudinary.com/dxa4bdtdx/image/upload/arrow-sec-right_cj6d34.svg"
        width="28"
      />
    </router-link>
  </div>
</template>
