export type Item = {
  guid: string
  title: string
  link: string
  description: string
  pubDate: string
}

export type RssFeed = {
  //document: Document
  title: string
  url: string
  items?: Item[]
}

export type NewsProps = {
  url: string
}