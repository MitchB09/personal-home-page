export type Item = {
  guid: string
  title: string
  link: string
  description: string
  pubDate: string
}

export type RssFeed = {
  title: string,
  link: string,
  description	: string,
  item: Item[]
}

export type RssData = {
  channel: RssFeed,
}

export type Payload = {
  id: string,
  title: string,
  rssUrl: string,
  lastUpdated?: number,
  rssData?: RssData,
}

export type RssSubscription = {
  title: string,
  url: string,
}

export type AddFeedForm = {
  url: string
}