import globby from 'globby'

export type CollectionsConfig = Record<string, string>

// TODO: get PageData for each page
const resolveCollectionPages = async (root: string, folder: string) => {
  const pages = await globby(['*.md'], {
    cwd: root + folder,
    ignore: ['node_modules']
  })

  const routePaths = pages.map(
    (page) => `${folder}/${page.replace(/\.md$/, '')}`
  )

  return routePaths
}

export function resolveCollections(
  collectionsConfig: CollectionsConfig,
  root: string
) {
  const collectionsData: Record<string, any> = {}

  Object.entries(collectionsConfig).forEach(
    async ([name, folder]) =>
      (collectionsData[name] = await resolveCollectionPages(root, folder))
  )

  return collectionsData
}
