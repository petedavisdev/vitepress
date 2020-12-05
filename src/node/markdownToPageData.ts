import path from 'path'
import matter from 'gray-matter'
import { createMarkdownRenderer, MarkdownOptions } from './markdown/markdown'
import { deeplyParseHeader } from './utils/parseHeader'
import { HeadConfig, PageData } from '../../types/shared'

export function createMarkdownToPageData(
  root: string,
  options: MarkdownOptions = {}
) {
  const md = createMarkdownRenderer(options)

  return (src: string, file: string, lastUpdated: number) => {
    file = path.relative(root, file)

    const { content, data: frontmatter } = matter(src)
    const { data } = md.render(content)

    // TODO validate data.links?

    // inject page data
    const pageData: PageData = {
      title: inferTitle(frontmatter, content),
      description: inferDescription(frontmatter),
      frontmatter,
      headers: data.headers,
      relativePath: file.replace(/\\/g, '/'),
      lastUpdated
    }

    return pageData
  }
}

const inferTitle = (frontmatter: any, content: string) => {
  if (frontmatter.home) {
    return 'Home'
  }
  if (frontmatter.title) {
    return deeplyParseHeader(frontmatter.title)
  }
  const match = content.match(/^\s*#+\s+(.*)/m)
  if (match) {
    return deeplyParseHeader(match[1].trim())
  }
  return ''
}

const inferDescription = (frontmatter: Record<string, any>) => {
  if (!frontmatter.head) {
    return ''
  }

  return getHeadMetaContent(frontmatter.head, 'description') || ''
}

const getHeadMetaContent = (
  head: HeadConfig[],
  name: string
): string | undefined => {
  if (!head || !head.length) {
    return undefined
  }

  const meta = head.find(([tag, attrs = {}]) => {
    return tag === 'meta' && attrs.name === name && attrs.content
  })

  return meta && meta[1].content
}
