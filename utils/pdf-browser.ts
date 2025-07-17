import { PDFDocument, PDFPage, StandardFonts } from 'pdf-lib'
import { getRandomObject } from './colorsManagement'

async function fetchImageByNumber(number: number): Promise<Uint8Array | undefined> {
  try {
    const response = await fetch(`/picto2/${number}.png`)
    if (!response.ok) return undefined
    const arrayBuffer = await response.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  } catch (error) {
    console.error(`Error fetching image for number ${number}:`, error)
    return undefined
  }
}

export async function createPdfBrowser(grids: number[][][]) {
  const pdfDoc = await PDFDocument.create()
  const pageWidth = 1190.55
  const pageHeight = 841.89

  for (let pageIndex = 0; pageIndex < grids.length; pageIndex += 4) {
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    let currentX = 50
    let currentY = 700

    for (let gridIndex = 0; gridIndex < 4; gridIndex++) {
      const grid = grids[pageIndex + gridIndex]
      if (grid) {
        if (gridIndex > 0 && gridIndex % 2 === 0) {
          currentX = 50
          currentY -= 400
        }
        await generateTable(page, grid, currentX, currentY, pdfDoc)
        currentX += 600
      }
    }
  }

  return pdfDoc.save()
}

async function generateTable(page: PDFPage, grid: number[][], startX: number, startY: number, pdfDoc: PDFDocument) {
  const colors = getRandomObject()
  const cellWidth = 529 / 5
  const cellHeight = 362 / 3
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const adjustedStartY = startY + cellHeight

  for (let row = 0; row < 3 && row < grid.length; row++) {
    const y = startY - row * cellHeight
    const rowData = grid[row]
    if (!rowData) continue;
    for (let col = 0; col < 5 && col < rowData.length; col++) {
      const x = startX + col * cellWidth
      const cellValue = rowData[col]
      if (cellValue === 0) {
        page.drawRectangle({
          x,
          y,
          width: cellWidth,
          height: cellHeight,
          color: colors.couleurBGsecondary
        })
      } else {
        if (cellValue !== undefined) {
          const imageBytes = await fetchImageByNumber(cellValue)
          if (imageBytes) {
            const image = await pdfDoc.embedPng(imageBytes)
            const scaledWidth = cellWidth - 30
            const scaledHeight = cellHeight - 30
            const scaledImage = image.scaleToFit(scaledWidth, scaledHeight)
            page.drawImage(image, {
              x: x + (cellWidth - scaledImage.width) / 2,
              y: y + (cellHeight - scaledImage.height) / 2 + 5,
              width: scaledImage.width,
              height: scaledImage.height
            })
          }
        }
        if (cellValue !== undefined) {
          page.drawText(cellValue.toString(), {
            x: x + cellWidth / 2 - 10,
            y: y + 10,
            size: 20,
            color: colors.couleurText,
            font: helveticaBoldFont
          })
        }
      }
    }
  }

  const lineColor = colors.couleurBorder
  const lineThickness = 5
  const lineBorderThickness = 7

  for (let col = 0; col <= 5; col++) {
    const x = startX + col * cellWidth
    page.drawLine({
      start: { x: x, y: adjustedStartY },
      end: { x: x, y: adjustedStartY - 3 * cellHeight },
      color: lineColor,
      thickness: col === 0 || col === 5 ? lineBorderThickness : lineThickness
    })
  }

  for (let row = 0; row <= 3; row++) {
    const y = adjustedStartY - row * cellHeight
    page.drawLine({
      start: { x: startX, y: y },
      end: { x: startX + 5 * cellWidth, y: y },
      color: lineColor,
      thickness: row === 0 || row === 3 ? lineBorderThickness : lineThickness
    })
  }
}