import fs from 'fs-extra'
import { resolve } from 'path'
import type { Plugin } from 'vite'

import { HERO_CONFIG, PAGE_METAS } from './src/constants/plugin'

type TRoute = {
  path: string
  title: string
  description: string
  ogImage?: string
}

const routes: TRoute[] = Object.entries(PAGE_METAS)
  .filter(([path]) => !path.includes('[id]'))
  .map(([path, meta]) => ({
    path,
    ...(meta as Omit<TRoute, 'path'>),
  }))

export function prerender(): Plugin {
  let baseUrl = 'http://localhost:3000'

  return {
    name: 'vite-plugin-prerender',
    apply: 'build',

    configResolved(config) {
      baseUrl = process.env.VITE_BASE_URL || config.env.VITE_BASE_URL
    },

    closeBundle: {
      sequential: true,
      async handler() {
        const distPath = resolve(process.cwd(), 'dist')
        const assetsPath = resolve(distPath, 'assets')

        let indexHtml = await fs.readFile(resolve(distPath, 'index.html'), 'utf-8')

        const detectHeroImages = async (
          routePath: string,
        ): Promise<{
          srcset: string
          mainSrc: string
          sizes: string
        } | null> => {
          if (Object.keys(HERO_CONFIG).length === 0) return null
          const config: {
            imageName: string
            expectedWidths: number[]
            sizes?: string
          } = HERO_CONFIG[routePath as keyof typeof HERO_CONFIG]
          if (!config) return null
          if (!config.sizes) return { mainSrc: config.imageName, srcset: '', sizes: '' }

          try {
            const files = await fs.readdir(assetsPath)
            const heroFiles = files.filter(file => file.includes(config.imageName) && file.endsWith('.webp'))

            if (heroFiles.length === 0) {
              return null
            }

            const heroData = await Promise.all(
              heroFiles.map(async file => {
                const filePath = resolve(assetsPath, file)
                const stats = await fs.stat(filePath)

                const widthPatterns = [
                  /\.w(\d+)/, // .w412 or .w550
                  /-w(\d+)/, // -w412 or -w550
                  /_(\d+)w/, // _412w or _550w
                  /\.(\d{3,4})w/, // .412w or .550w
                ]

                let width: number | null = null

                for (const pattern of widthPatterns) {
                  const match = file.match(pattern)
                  if (match) {
                    width = parseInt(match[1])
                    break
                  }
                }

                if (!width) {
                  const sortedExpected = [...config.expectedWidths].sort((a, b) => a - b)
                  const fileIndex = heroFiles
                    .map(f => ({ name: f, size: fs.statSync(resolve(assetsPath, f)).size }))
                    .sort((a, b) => a.size - b.size)
                    .findIndex(f => f.name === file)

                  width = sortedExpected[fileIndex] || sortedExpected[sortedExpected.length - 1]
                }

                return { file, width: width!, size: stats.size }
              }),
            )

            heroData.sort((a, b) => a.width - b.width)
            const srcset = heroData.map(h => `/assets/${h.file} ${h.width}w`).join(', ')
            const mainSrc = `/assets/${heroData[heroData.length - 1].file}`

            return { srcset, mainSrc, sizes: config.sizes }
          } catch {
            return null
          }
        }

        const injectMetaTags = async (html: string, route: TRoute, fullUrl: string, fullOgImage: string) => {
          let result = html

          result = result.replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
          result = result.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
          result = result.replace(/<meta\s+property=["']twitter:[^"']+["'][^>]*>/gi, '')
          result = result.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)

          let metaTags = `
    <meta name="description" content="${route.description}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${fullOgImage}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:site_name" content="Komlabs" />
    <meta property="og:locale" content="id_ID" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${route.title}" />
    <meta property="twitter:description" content="${route.description}" />
    <meta property="twitter:image" content="${fullOgImage}" />
    <meta property="twitter:url" content="${fullUrl}" />
    <link rel="canonical" href="${fullUrl}" />`

          const heroImages = await detectHeroImages(route.path)

          if (heroImages) {
            let preloadTag = `
    <link rel="preload" as="image" href="${heroImages.mainSrc}" fetchpriority="high" />`
            if (heroImages.sizes)
              preloadTag = `
    <link rel="preload" as="image" href="${heroImages.mainSrc}" imagesrcset="${heroImages.srcset}" imagesizes="${heroImages.sizes}" fetchpriority="high" />`
            metaTags += preloadTag
          }

          result = result.replace('</head>', `${metaTags}\n  </head>`)
          return result
        }

        for (const route of routes) {
          const fullUrl = `${baseUrl}${route.path}`
          const fullOgImage = route.ogImage?.startsWith('http') ? route.ogImage : `${baseUrl}${route.ogImage}`
          const processedHtml = await injectMetaTags(indexHtml, route, fullUrl, fullOgImage)

          if (route.path === '/') {
            const filePath = resolve(distPath, 'index.html')
            await fs.writeFile(filePath, processedHtml)
          } else {
            const cleanPath = route.path.slice(1)
            if (cleanPath.includes('/')) {
              const pathParts = cleanPath.split('/')
              const folderPath = pathParts.slice(0, -1).join('/')
              const fileName = pathParts[pathParts.length - 1]

              const fullFolderPath = resolve(distPath, folderPath)
              await fs.ensureDir(fullFolderPath)

              const folderExists = await fs.pathExists(fullFolderPath)
              if (!folderExists) {
                throw new Error(`Failed to create folder: ${fullFolderPath}`)
              }

              const htmlFileName = `${fileName}.html`
              const filePath = resolve(fullFolderPath, htmlFileName)
              await fs.writeFile(filePath, processedHtml)
            } else {
              const htmlFileName = `${cleanPath}.html`
              const filePath = resolve(distPath, htmlFileName)
              await fs.writeFile(filePath, processedHtml)
            }
          }
        }
      },
    },
  }
}
