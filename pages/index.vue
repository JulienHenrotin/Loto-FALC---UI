<template>
  <!-- SEO meta tags -->
  <Head>
    <title>Loto FALC Ticket Generator | Free PDF Tool</title>
    <meta name="description" content="Create bingo sheets that are easy to read and understand in seconds." />
  </Head>

  <div class="font-sans">
    <!-- Hero Section -->
    <Motion
      tag="section"
      class="min-h-screen flex items-center justify-center text-center bg-gray-50"
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
      appear>
      <UContainer>
        <h1 class="text-5xl lg:text-7xl font-bold tracking-tight">
          Loto FALC Ticket Generator
        </h1>
        <p class="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Create bingo sheets that are easy to read and understand in seconds.
        </p>
        <UButton aria-label="Get Started" class="mt-8" @click="scrollToGenerator">
          Get Started
        </UButton>
      </UContainer>
    </Motion>

    <!-- What is Loto FALC Section -->
    <section class="py-24 lg:py-36 bg-white">
      <UContainer>
        <h2 class="text-3xl font-bold flex items-center mb-6">
          <UIcon name="i-heroicons-light-bulb" class="text-primary-500 mr-2" />
          What is Loto FALC?
        </h2>
        <div class="prose dark:prose-invert">
          <p>
            FALC (Facile à Lire et à Comprendre) aims to make information
            accessible to everyone. It simplifies language and uses visual cues
            to help readers focus on the essentials.
          </p>
        </div>
        <ul class="list-disc pl-5 space-y-2 mt-4">
          <li
            v-for="(item, index) in principles"
            :key="index"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }">
            {{ item }}
          </li>
        </ul>
      </UContainer>
    </section>

    <!-- Generator Form Section -->
    <section id="generator" class="py-24 lg:py-36 bg-gray-50">
      <UContainer>
        <div
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.95 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <UForm @submit.prevent="onSubmit" class="space-y-6">
              <UFormGroup label="Number of tickets" name="grids">
                <UInput
                  aria-label="Number of tickets"
                  v-model.number="form.grids"
                  type="number"
                  min="1"
                  max="100" />
              </UFormGroup>
              <div class="space-y-4">
                <UButton
                  type="submit"
                  color="primary"
                  class="w-full sm:w-auto"
                  :loading="generating"
                  aria-label="Generate PDF">
                  Generate PDF
                </UButton>
                <UProgress
                  v-if="generating"
                  class="h-2 rounded"
                  :value="progress"
                  :max="1" />
                <UAlert
                  v-if="progress === 1 && !generating"
                  icon="i-heroicons-check-circle"
                  color="green"
                  title="PDF ready!" />
              </div>
            </UForm>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Motion } from '@vueuse/motion'

// ? Form state
const form = ref({ grids: 20 })
const generating = ref(false)
const progress = ref(0)

// ! Scroll helper
function scrollToGenerator() {
  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })
}

// ! Handle form submission
async function onSubmit() {
  generating.value = true
  progress.value = 0

  const { generatePdf } = await import('~/pdf-browser')
  const pdfBytes = await generatePdf(form.value.grids, (p: number) => {
    progress.value = p
  })

  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'loto-falc.pdf'
  link.click()
  URL.revokeObjectURL(url)

  generating.value = false
  progress.value = 1
}

// ? List of FALC principles for display
const principles = [
  'Use simple words and short sentences.',
  'Present information in a logical order.',
  'Support text with pictograms or images.',
  'Focus on one idea at a time.'
]
</script>
