import globby from 'globby'

export interface CollectionConfig {
  name: string
  folder: string
  fields: string[]
}

const resolveCollectionPages = async (root: string, folder: string) =>
  await globby(['*.md'], { cwd: root + folder, ignore: ['node_modules'] })

export async function resolveCollections(
  collectionsConfig: CollectionConfig[],
  root: string
) {
  const collectionData = Promise.all(
    collectionsConfig
      // remove any collection config without name and folder
      .filter((collection) => {
        return (
          typeof collection.name === 'string' &&
          typeof collection.folder === 'string'
        )
      })
      // add pageData for each page in the collection
      .map(async (collection) => {
        return [
          collection.name,
          await resolveCollectionPages(root, collection.folder)
        ]
      })
  )

  return Object.fromEntries(await collectionData)
}
