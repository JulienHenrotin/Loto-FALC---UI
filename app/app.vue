<template>
  <UApp>
    <div class="font-sans text-gray-800 dark:text-gray-100">

      <!-- ✨ Hero  ------------------------------------------------------- -->
      <UMotion
        tag="header"
        class="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 animate-gradient-x"
        :initial="motionInit"
        :enter="motionIn"
      >
        <!-- decorative blobs -->
        <div class="pointer-events-none absolute inset-0 -z-10">
          <div
            v-motion
            :initial="{ opacity: 0, scale: .8, x: -150, y: -120 }"
            :enter="{ opacity: .15, scale: 1, x: 0, y: 0, transition: { duration: 2 } }"
            class="absolute aspect-square w-[48rem] rounded-full bg-primary blur-3xl"
          />
        </div>

        <UContainer class="text-center">
          <h1 class="mb-6 font-extrabold text-5xl md:text-7xl leading-tight">
            Loto FALC Ticket Generator
          </h1>

          <p class="mx-auto mb-10 max-w-2xl text-lg md:text-2xl text-gray-700 dark:text-gray-300">
            Instantly create easy‑to‑read bingo sheets for inclusive events.
          </p>

          <UButton color="primary" size="lg" icon="i-heroicons-play" @click="scrollToForm">
            Get Started
          </UButton>
        </UContainer>

        <!-- scroll hint -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <UIcon name="i-heroicons-chevron-double-down" size="32" />
        </div>
      </UMotion>

      <!-- 💡 What is FALC ------------------------------------------------ -->
      <UMotion tag="section" class="py-24 lg:py-36 bg-white dark:bg-gray-900"
        v-motion="sectionMotion"
      >
        <UContainer class="prose dark:prose-invert">
          <h2 class="flex items-center gap-2">
            <UIcon name="i-heroicons-light-bulb" class="text-primary" />
            What is Loto FALC ?
          </h2>

          <p>
            FALC (French:&nbsp;<em>Facile À Lire et à Comprendre</em>) makes information more
            accessible through plain language and clear visuals. Our generator follows those
            guidelines so everyone can enjoy the game.
          </p>

          <ul>
            <li>Short, simple sentences.</li>
            <li>Logical information order.</li>
            <li>Supporting pictograms for each number.</li>
            <li>High‑contrast colours for better readability.</li>
          </ul>
        </UContainer>
      </UMotion>

      <!-- 📝 Generator form ---------------------------------------------- -->
      <UMotion tag="section" id="generator-form" class="py-24 lg:py-36"
        v-motion="sectionMotion"
      >
        <UContainer class="max-w-xl">
          <!-- hover pop effect -->
          <div class="rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-10 transition hover:scale-[1.02]">
            <h3 class="mb-6 text-2xl font-semibold text-center">
              Generate your tickets
            </h3>

            <UForm :state="formState" @submit.prevent="generate" class="space-y-6">
              <UFormGroup label="Number of tickets" name="tickets">
                <UInput
                  v-model.number="formState.tickets"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  placeholder="20"
                  aria-label="Number of tickets"
                />
              </UFormGroup>

              <UButton type="submit" color="primary" class="w-full" :loading="generating">
                Generate PDF
              </UButton>

              <UProgress
                v-show="generating"
                :value="progress"
                :max="total"
                class="h-2 rounded"
              />

              <div v-if="downloadUrl" class="text-center">
                <UAlert color="success" icon="i-heroicons-check-circle" class="mb-4">
                  PDF ready! Click to download again if needed.
                </UAlert>
                <UButton
                  :href="downloadUrl"
                  target="_blank"
                  download="loto-falc.pdf"
                  color="primary"
                  icon="i-heroicons-arrow-down-tray"
                >
                  Download PDF
                </UButton>
              </div>
            </UForm>
          </div>
        </UContainer>
      </UMotion>
    </div>
  </UApp>
</template>

<script setup lang="ts">
// ? basic reactivity
import { ref, nextTick } from 'vue'

// ? your existing helpers
import { createPdfBrowser } from '../utils/pdf-browser'
import { generateGridRandom, addBlack } from '../utils/generateGrid'

// form data
const requestedGrids = ref(20)
const formState = reactive({ tickets: 20 })

// generation state
const generating  = ref(false)
const progress    = ref(0)
const total       = ref(0)
const downloadUrl = ref<string | null>(null)

// ! hero motion presets
const motionInit = { opacity: 0, y: 40 }
const motionIn   = { opacity: 1, y: 0, transition: { duration: .8 } }
const sectionMotion = {
  initial: { opacity: 0, y: 40 },
  enter:   { opacity: 1, y: 0, transition: { duration: .6, delay: .1 } }
}

// scroll helper
function scrollToForm () {
  document.getElementById('generator-form')?.scrollIntoView({ behavior: 'smooth' })
}

// main generator
async function generate () {
  generating.value = true
  progress.value   = 0
  total.value = Math.max(1, formState.tickets)

  const rows = 3, cols = 5
  const grids: number[][][] = []

  for (let i = 0; i < total.value; i++) {
    grids.push(addBlack(generateGridRandom(rows, cols)))
    progress.value = i + 1
    await nextTick()                  // let UI paint
  }

  const bytes = await createPdfBrowser(grids)
  const blob  = new Blob([bytes], { type: 'application/pdf' })
  downloadUrl.value = URL.createObjectURL(blob)

  // automatically trigger download
  triggerDownload(downloadUrl.value)

  generating.value = false
}

// auto‑download helper
function triggerDownload (url: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = 'loto-falc.pdf'
  link.rel = 'noopener'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)            // libère l’objet
}
</script>

<style scoped>
/* gradient animation already defined earlier */
@keyframes gradient-x {
  0%,100% { background-position: 0% 50%; }
  50%     { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 10s ease infinite;
}
</style>
