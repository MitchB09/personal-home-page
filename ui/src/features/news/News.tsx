import type { JSX } from "react"
import { useEffect, useState } from "react"

import axios from "axios"

const url = "https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick"

export const News = (): JSX.Element => {
  const [data, setData] = useState<string>("")

  useEffect(() => {
    void axios
      .get<string>(url)
      .then(response => { setData(response.data) })
  }, [])

  const xmlDoc = new DOMParser().parseFromString(data, "text/xml")
  console.dir(xmlDoc);

  return <>News</>
}
