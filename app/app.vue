<template>
  <UApp>
    <div class="font-sans text-gray-800 dark:text-gray-100">

      <!-- ✨ HERO ---------------------------------------------------- -->
      <UMotion
        tag="header"
        class="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 animate-gradient-x"
        :initial="motionInit"
        :enter="motionIn"
      >
        <!-- Décor flou -->
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
            Générateur de cartons de&nbsp;Loto&nbsp;FALC
          </h1>

          <p class="mx-auto mb-10 max-w-2xl text-lg md:text-2xl text-gray-700 dark:text-gray-300">
            Créez instantanément des feuilles de loto faciles à lire et à comprendre.
          </p>

          <UButton color="primary" size="lg" icon="i-heroicons-play" @click="scrollToForm">
            Commencer
          </UButton>
        </UContainer>

        <!-- Indicateur de scroll -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <UIcon name="i-heroicons-chevron-double-down" size="32" />
        </div>
      </UMotion>

      <!-- 💡 DESCRIPTION --------------------------------------------- -->
      <UMotion
        tag="section"
        class="py-24 lg:py-36 bg-white/90 dark:bg-gray-950/90 backdrop-blur"
        v-motion="sectionMotion"
      >
        <UContainer>
          <UCard
            class="relative overflow-hidden rounded-3xl shadow-xl
                   bg-white/80 dark:bg-gray-800/70 ring-1 ring-primary/10
                   p-10 md:p-14"
          >
            <!-- Decorative blob -->
            <div class="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl"/>

            <div class="grid md:grid-cols-2 gap-12 items-center">
              <!-- LEFT -->
              <div class="space-y-6">
                <div class="text-7xl">🧠</div>

                <h2 class="text-3xl font-extrabold leading-tight">
                  Qu’est-ce que le&nbsp;Loto&nbsp;FALC&nbsp;?
                </h2>

                <p class="text-gray-700 dark:text-gray-300">
                  Un format simplifié pour une accessibilité universelle.
                </p>

                <UButton
                  color="primary"
                  size="lg"
                  icon="i-heroicons-play"
                  @click="scrollToForm"
                >
                  Générer vos cartons
                </UButton>
              </div>

              <!-- RIGHT -->
              <div class="space-y-8">
                <ul class="space-y-4">
                  <li class="flex gap-3">
                    <UIcon name="i-heroicons-chat-bubble-left-right" class="h-6 w-6 text-primary shrink-0" />
                    <span>Langage simple, phrases courtes.</span>
                  </li>
                  <li class="flex gap-3">
                    <UIcon name="i-heroicons-cube-transparent" class="h-6 w-6 text-primary shrink-0" />
                    <span>Présentation aérée et logique.</span>
                  </li>
                  <li class="flex gap-3">
                    <UIcon name="i-heroicons-squares-2x2" class="h-6 w-6 text-primary shrink-0" />
                    <span>Nombres accompagnés de pictogrammes.</span>
                  </li>
                  <li class="flex gap-3">
                    <UIcon name="i-heroicons-paint-brush" class="h-6 w-6 text-primary shrink-0" />
                    <span>Couleurs contrastées pour une meilleure lisibilité.</span>
                  </li>
                </ul>

                <UCallout
                  icon="i-heroicons-sparkles"
                  title="L’inclusion, c’est aussi du fun 🎉"
                  color="primary"
                  class="mt-2"
                >
                  Grâce au FALC, même les personnes en situation de handicap cognitif peuvent profiter pleinement du jeu.
                </UCallout>
              </div>
            </div>
          </UCard>
        </UContainer>
      </UMotion>

      <!-- 📝 FORMULAIRE ----------------------------------------------- -->
      <UMotion
        tag="section"
        id="generator-form"
        class="py-24 lg:py-36"
        v-motion="sectionMotion"
      >
        <div class="relative py-8 px-4 max-w-xl mx-auto">
          <!-- Blob décoratif -->
          <div class="absolute -top-4 -right-10 w-40 h-40 bg-primary/30 opacity-50 blur-3xl rounded-full pointer-events-none"/>
          
          <!-- Carte formulaire -->
          <UCard variant="soft" class="relative flex flex-col items-center space-y-6 p-6 rounded-xl shadow-md">
            <h2 class="text-2xl font-bold text-center text-white">
              Générer vos cartons
            </h2>

            <p class="text-sm text-gray-200 text-center">
              Choisissez le nombre de cartons FALC et lancez la génération&nbsp;:
            </p>

            <UForm :state="formState" class="w-full flex flex-col items-center gap-4" @submit.prevent="generate">
              <UFormField name="count" label="Nombre de cartons" class="w-full">
                <UInputNumber v-model.number="formState.tickets" :min="1" :max="50" class="w-full" />
              </UFormField>

              <UButton
                type="submit"
                color="primary"
                size="lg"
                :loading="generating"
                class="w-full font-semibold flex items-center justify-center gap-2"
              >
                <UIcon name="material-symbols:auto-awesome" class="text-xl" />
                Générer les cartons&nbsp;!
              </UButton>

              <UProgress
                v-show="generating"
                :value="progress"
                :max="total"
                class="h-2 rounded"
              />
            </UForm>

            <!-- Feedback -->
            <div
              v-if="generationDone"
              class="w-full text-center text-green-400 mt-2"
            >
              ✅ {{ generatedCount }} {{ generatedCount === 1 ? 'carton' : 'cartons' }} généré{{ generatedCount === 1 ? '' : 's' }} avec succès&nbsp;!
            </div>
          </UCard>
        </div>
      </UMotion>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { createPdfBrowser } from '../utils/pdf-browser'
import { generateGridRandom, addBlack } from '../utils/generateGrid'

/* ---------- state -------------------------------------------------- */
const formState      = reactive({ tickets: 20 })
const generating     = ref(false)
const progress       = ref(0)
const total          = ref(0)
const downloadUrl    = ref<string | null>(null)
const generationDone = ref(false)
const generatedCount = ref(0)   // <-- nombre figé au moment de la génération

/* ---------- animations ------------------------------------------- */
const motionInit = { opacity: 0, y: 40 }
const motionIn   = { opacity: 1, y: 0, transition: { duration: .8 } }
const sectionMotion = {
  initial: { opacity: 0, y: 40 },
  enter:   { opacity: 1, y: 0, transition: { duration: .6, delay: .1 } }
}

/* ---------- helpers --------------------------------------------- */
function scrollToForm () {
  document.getElementById('generator-form')?.scrollIntoView({ behavior: 'smooth' })
}

/* ---------- generation ------------------------------------------ */
async function generate () {
  generationDone.value = false
  generating.value     = true
  progress.value       = 0
  total.value          = Math.max(1, formState.tickets)

  const rows = 3, cols = 5
  const grids: number[][][] = []

  for (let i = 0; i < total.value; i++) {
    grids.push(addBlack(generateGridRandom(rows, cols)))
    progress.value = i + 1
    await nextTick() // laisse le temps à l'UI d'actualiser
  }

  const bytes = await createPdfBrowser(grids)
  const blob  = new Blob([bytes], { type: 'application/pdf' })
  downloadUrl.value = URL.createObjectURL(blob)

  triggerDownload(downloadUrl.value)

  generating.value     = false
  generatedCount.value = formState.tickets  // <-- on fige la valeur
  generationDone.value = true
}

/* déclenche le téléchargement et libère l'URL */
function triggerDownload (url: string) {
  const link = document.createElement('a')
  link.href        = url
  link.download    = 'loto-falc.pdf'
  link.rel         = 'noopener'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
@keyframes gradient-x {
  0%,100% { background-position: 0% 50%; }
  50%     { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 10s ease infinite;
}
</style>
