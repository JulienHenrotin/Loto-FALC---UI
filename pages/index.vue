<template>
  <div class="p-4 space-y-4">
    <UCard class="max-w-md mx-auto">
      <form @submit.prevent="generate">
        <div class="space-y-4">
          <UFormGroup label="Nombre de grilles" name="count">
            <UInput v-model.number="requestedGrids" type="number" min="1" />
          </UFormGroup>
          <UButton type="submit" :loading="generating">Générer le PDF</UButton>
        </div>
      </form>
      <div v-if="generating" class="mt-4">
        <progress class="w-full" :value="progress" :max="total" />
      </div>
      <div v-if="downloadUrl" class="mt-4 text-center">
        <a :href="downloadUrl" download="grilles.pdf" class="underline text-blue-600">Télécharger le PDF</a>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { generateGridRandom, addBlack } from '../utils/generateGrid'
import { createPdfBrowser } from '../utils/pdf-browser'

const requestedGrids = ref(4)
const generating = ref(false)
const progress = ref(0)
const total = ref(0)
const downloadUrl = ref('')

async function generate() {
  generating.value = true
  progress.value = 0
  const rows = 3
  const cols = 5

  const numberOfSheets = Math.ceil(requestedGrids.value / 4)
  total.value = numberOfSheets * 4
  const grids: number[][][] = []

  for (let i = 0; i < total.value; i++) {
    let grid = generateGridRandom(rows, cols)
    grid = addBlack(grid)
    grids.push(grid)
    progress.value = i + 1
    await nextTick()
  }

  const pdfBytes = await createPdfBrowser(grids)
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  downloadUrl.value = URL.createObjectURL(blob)
  generating.value = false
}
</script>