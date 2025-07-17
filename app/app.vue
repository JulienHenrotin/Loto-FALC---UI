<template>
  <UApp>
    <div class="font-sans">
      <!-- Hero Section -->
      <UMotion
        tag="section"
        class="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 animate-gradient-x"
        :initial="initial"
        :enter="enter"
      >
        <h1 class="font-bold text-4xl lg:text-6xl">Loto FALC Ticket Generator</h1>
        <p class="mt-4 text-lg lg:text-2xl text-gray-600 dark:text-gray-300">
          Instantly create easy-to-read bingo sheets.
        </p>
        <UButton
          color="primary"
          icon="i-heroicons-play"
          class="mt-8"
          @click="scrollToForm"
        >
          Get Started
        </UButton>
      </UMotion>

      <!-- What is Loto FALC Section -->
      <UMotion
        tag="section"
        class="py-20 lg:py-32 bg-white dark:bg-gray-900"
        :initial="initial"
        :enter="enter"
      >
        <UContainer>
          <h2 class="text-2xl lg:text-3xl font-bold flex items-center">
            <UIcon name="i-heroicons-light-bulb" class="text-primary inline mr-2" />
            What is Loto FALC?
          </h2>
          <div class="prose dark:prose-invert mt-4">
            <p>
              FALC makes information easier to read and understand through simple language and clear visuals.
            </p>
            <ul>
              <li v-for="(item, i) in principles" :key="i" class="mt-2">
                {{ item }}
              </li>
            </ul>
          </div>
        </UContainer>
      </UMotion>

      <!-- Generator Form Section -->
      <UMotion
        tag="section"
        id="generator-form"
        class="py-20 lg:py-32"
        :initial="initial"
        :enter="enter"
      >
        <UContainer>
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <UForm @submit.prevent="generate" class="space-y-6">
              <UFormGroup label="Number of tickets" name="grids">
                <UInput
                  v-model.number="requestedGrids"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  placeholder="20"
                  aria-label="Number of tickets"
                />
              </UFormGroup>
              <UButton type="submit" color="primary" :loading="generating">
                Generate PDF
              </UButton>
              <UProgress
                v-show="generating"
                class="h-2 rounded"
                :value="progress"
                :max="total"
              />
              <UAlert
                v-if="downloadUrl"
                color="green"
                icon="i-heroicons-check-circle"
                title="PDF ready!"
              />
            </UForm>
          </div>
        </UContainer>
      </UMotion>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { createPdfBrowser } from '../utils/pdf-browser'
import { generateGridRandom, addBlack } from '../utils/generateGrid'

const requestedGrids = ref(20)
const generating = ref(false)
const progress = ref(0)
const total = ref(0)
const downloadUrl = ref<string | null>(null)

const initial = { opacity: 0, y: 40 }
const enter = { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }

const principles = [
  'Use simple language and short sentences.',
  'Present information in a logical order.',
  'Support text with images or pictograms.'
]

async function generate() {
  generating.value = true
  progress.value = 0
  const rows = 3, cols = 5
  const numberOfSheets = Math.ceil(requestedGrids.value / 4)
  total.value = numberOfSheets * 4
  const grids: number[][][] = []

  for (let i = 0; i < total.value; i++) {
    let g = generateGridRandom(rows, cols)
    g = addBlack(g)
    grids.push(g)
    progress.value = i + 1
    await nextTick()
  }

  const bytes = await createPdfBrowser(grids)
  const blob = new Blob([bytes], { type: 'application/pdf' })
  downloadUrl.value = URL.createObjectURL(blob)
  generating.value = false
}

function scrollToForm() {
  document.getElementById('generator-form')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
@keyframes gradient-x {
  0%,100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 8s ease infinite;
}
</style>
