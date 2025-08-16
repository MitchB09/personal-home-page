export const mockEvent = {
  resource: "/1",
  path: "/1",
  httpMethod: "GET",
  headers: {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.5",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-ASN": "855",
    "CloudFront-Viewer-Country": "CA",
    Host: "769fi9t619.execute-api.us-east-1.amazonaws.com",
    priority: "u=0, i",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0",
    Via: "2.0 dc19ea23f7171b69f0ee587ccd8e6c16.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "76em_xK8yPe9LOw3qHOQHApOVJ0_H_qF-7Ju8L4WInfgHX_ELOqR4Q==",
    "X-Amzn-Trace-Id": "Root=1-689e9317-32ca43407e6eeb493646851d",
    "X-Forwarded-For": "142.162.20.208, 15.158.17.165",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https",
  },
  multiValueHeaders: {
    Accept: ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"],
    "Accept-Encoding": ["gzip, deflate, br, zstd"],
    "Accept-Language": ["en-US,en;q=0.5"],
    "CloudFront-Forwarded-Proto": ["https"],
    "CloudFront-Is-Desktop-Viewer": ["true"],
    "CloudFront-Is-Mobile-Viewer": ["false"],
    "CloudFront-Is-SmartTV-Viewer": ["false"],
    "CloudFront-Is-Tablet-Viewer": ["false"],
    "CloudFront-Viewer-ASN": ["855"],
    "CloudFront-Viewer-Country": ["CA"],
    Host: ["769fi9t619.execute-api.us-east-1.amazonaws.com"],
    priority: ["u=0, i"],
    "sec-fetch-dest": ["document"],
    "sec-fetch-mode": ["navigate"],
    "sec-fetch-site": ["none"],
    "sec-fetch-user": ["?1"],
    "upgrade-insecure-requests": ["1"],
    "User-Agent": [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0",
    ],
    Via: ["2.0 dc19ea23f7171b69f0ee587ccd8e6c16.cloudfront.net (CloudFront)"],
    "X-Amz-Cf-Id": ["76em_xK8yPe9LOw3qHOQHApOVJ0_H_qF-7Ju8L4WInfgHX_ELOqR4Q=="],
    "X-Amzn-Trace-Id": ["Root=1-689e9317-32ca43407e6eeb493646851d"],
    "X-Forwarded-For": ["142.162.20.208, 15.158.17.165"],
    "X-Forwarded-Port": ["443"],
    "X-Forwarded-Proto": ["https"],
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: { id: ["1", "2", "3"] },
  pathParameters: {
    id: "1",
  },
  stageVariables: null,
  requestContext: {
    resourceId: "88tk12b9kb",
    resourcePath: "/",
    httpMethod: "GET",
    extendedRequestId: "PUvrvF_rIAMEJ4Q=",
    requestTime: "15/Aug/2025:01:53:27 +0000",
    path: "/dev",
    accountId: "791956792554",
    protocol: "HTTP/1.1",
    stage: "dev",
    domainPrefix: "769fi9t619",
    requestTimeEpoch: 1755222807518,
    requestId: "1a0ec5ad-274b-4123-ab19-149d8b6c6409",
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: "142.162.20.208",
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0",
      user: null,
    },
    domainName: "769fi9t619.execute-api.us-east-1.amazonaws.com",
    deploymentId: "mzenah",
    apiId: "769fi9t619",
  },
  body: null,
  isBase64Encoded: false,
};

export const mockContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "",
  functionVersion: "",
  invokedFunctionArn: "",
  memoryLimitInMB: "",
  awsRequestId: "",
  logGroupName: "",
  logStreamName: "",
  getRemainingTimeInMillis: function (): number {
    throw new Error("Function not implemented.");
  },
  done: function (error?: Error, result?: any): void {
    throw new Error("Function not implemented.");
  },
  fail: function (error: Error | string): void {
    throw new Error("Function not implemented.");
  },
  succeed: function (messageOrObject: any): void {
    throw new Error("Function not implemented.");
  },
};

export const mockListResult = [
  {
    lastUpdated: 1755315036471,
    id: "1",
    rssUrl: "https://news.ycombinator.com/rss",
    title: "Hacker News",
  },
  {
    lastUpdated: 1755315036131,
    id: "2",
    rssUrl: "https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick",
    title: "CBC | New Brunswick News",
  },
];

export const mockYCombinatorResult = {
  lastUpdated: 1755222787311,
  rssData: {
    channel: {
      link: "https://news.ycombinator.com/",
      description: "Links for the intellectually curious, ranked by readers.",
      item: [
        {
          link: "https://www.colincornaby.me/2025/08/your-mac-game-is-probably-rendering-blurry/",
          description:
            '<a href="https://news.ycombinator.com/item?id=44906305">Comments</a>',
          comments: "https://news.ycombinator.com/item?id=44906305",
          title: "Blurry rendering of games on Mac",
          pubDate: "Thu, 14 Aug 2025 22:11:47 +0000",
        },
      ],
    },
  },
};

export const mockCbcResult = {
  lastUpdated: 1755315036131,
  rssData: {
    channel: {
      image: {
        title: "CBC | New Brunswick News",
        link: "https://www.cbc.ca/news/canada/new-brunswick/?cmp=rss",
        url: "https://www.cbc.ca/rss/image/cbc_144.gif",
      },
      copyright:
        "Copyright: (C) Canadian Broadcasting Corporation, http://www.cbc.ca/aboutcbc/discover/termsofuse.html#Rss",
      item: [
        {
          link: "https://www.cbc.ca/news/canada/new-brunswick/wildfires-friday-august-15-2025-1.7609743?cmp=rss",
          description:
            "<img src='https://i.cbc.ca/1.7609963.1755268973!/fileImage/httpImage/image.jpeg_gen/derivatives/16x9_620/oldfield-road-fire-wednesday.jpeg' alt='A fire burning above the treetops ' width='620' height='349' title='The Oldfield Road fire, pictured on Wednesday and shared with CBC News on Friday, is still out of control and grew slightly since Thursday.'/><p>Residents of Lavillette, about 20 kilometres northwest of Esgenoôpetitj First Nation, should be ready to leave their homes on short notice, the New Brunswick Emergency Measures Organization says.</p>",
          guid: 1.7609743,
          title:
            "Evacuation advisory issued for northeast N.B. community, several fires out of control",
          category: "News/Canada/New Brunswick",
          pubDate: "Fri, 15 Aug 2025 06:34:43 EDT",
          "cbc:authorName": "Savannah Awde",
        },
      ],
      docs: "https://www.cbc.ca/rss",
      lastBuildDate: "Fri, 15 Aug 2025 19:42:50 EDT",
      link: "https://www.cbc.ca/news/canada/new-brunswick/?cmp=rss",
      description: "FOR PERSONAL USE ONLY",
      title: "CBC | New Brunswick News",
    },
  },
  id: "2",
  rssUrl: "https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick",
};
