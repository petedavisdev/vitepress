import globby from 'globby'

export type CollectionsConfig = Record<string, string>

// TODO: get PageData for each page
const resolveCollectionPages = async (root: string, folder: string) =>
  await globby(['*.md'], { cwd: root + folder, ignore: ['node_modules'] })

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
