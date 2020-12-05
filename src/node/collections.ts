import fs from 'fs-extra'
import globby from 'globby'
import { createMarkdownToPageData } from './markdownToPageData'
import { MarkdownOptions } from './markdown/markdown'

export type CollectionsConfig = Record<string, string>

const resolveCollectionPages = async (
  root: string,
  folder: string,
  markdown: MarkdownOptions | undefined
) => {
  const files = await globby(['*.md'], {
    cwd: root + folder,
    ignore: ['node_modules']
  })

  const markdownToPageData = createMarkdownToPageData(root, markdown)

  return files.map(async (file) => {
    const content = await fs.readFile(file, 'utf-8')
    const lastUpdated = (await fs.stat(file)).mtimeMs
    return markdownToPageData(content, file, lastUpdated)
  })
}

export function resolveCollections(
  collectionsConfig: CollectionsConfig,
  root: string,
  markdown: MarkdownOptions | undefined
) {
  const collectionsData: Record<string, any> = {}

  Object.entries(collectionsConfig).forEach(
    async ([name, folder]) =>
      (collectionsData[name] = await resolveCollectionPages(
        root,
        folder,
        markdown
      ))
  )

  return collectionsData
}
