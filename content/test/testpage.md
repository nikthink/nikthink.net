---
date: '2025-04-23T15:00:00-04:00'
draft: false
title: 'Test page'
---
a test page to test that markdown and other functionalities gets built correctly.

<!--more-->

### Text
testing **bold** text.  
testing _italic_ text.  
testing `inline_code` text.  

```
this is a           code block,
with same line length in chars.
```

here is a 3 line quote:

> And the Lord said unto Joshua, Fear not, neither be thou dismayed:
> take all the people of war with thee, and arise, go up to Ai:
> see, I have given into thy hand the king of Ai, and his people, and his city, and his land

back to regular text.

### Real code block
```typescript
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type GetInferenceHelpers } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "../server/trpc/router/_app";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});

/**
 * Inference helpers
 * @example type HelloOutput = RouterTypes['example']['hello']['output']
 **/
export type RouterTypes = GetInferenceHelpers<AppRouter>;
```
