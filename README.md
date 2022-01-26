# charter-web

`charter-web` is adapted from `interdependence-web` from [verses-xyz](https://github.com/verses-xyz). We've removed functions relating to forking for a simple document signing app that stores offchain signatures on Arweave.

You can use `charter-web` for DAO members to ratify a document prior to being allowed to vote in Snapshot. We've added an `/api/snapshot` endpoint which accepts `POST` requests structured according to the `api-post` [Snapshot strategy](https://github.com/snapshot-labs/snapshot-strategies/tree/master/src/strategies/api-post). The endpoint will return a list of scores corresponding to address who have or have not signed the charter. Use `api-post` through the `membership` strategy to gate votes based on two factors (in the case of KONG Land, holding a $CITIZEN NFT and signing the charter).

## Running the application locally:

```
npm install
npm run dev
```

## Deploying:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## Modifying the Charter:

- See `charter.json` for example JSON format
- Upload to Arweave via [arkb](https://github.com/textury/arkb)
- Set CANONICAL in `.env.local` to the resulting Arweave transaction ID (not the document URI)

```
yarn global add arkb
arkb deploy charter.json --tag-name charter_doc_type --tag-value charter --wallet ARWEAVE_KEY_FILE
```

## Testing the Snapshot Endpoint:

```
curl --location --request POST 'http://localhost:3000/api/snapshot' \
--header 'Content-Type: application/json' \
--data-raw '{
  "network": "1",
  "addresses": [
    "0x3c4B8C52Ed4c29eE402D9c91FfAe1Db2BAdd228D",
    "0xd649bACfF66f1C85618c5376ee4F38e43eE53b63",
    "0x726022a9fe1322fA9590FB244b8164936bB00489",
    "0xc6665eb39d2106fb1DBE54bf19190F82FD535c19",
    "0x6ef2376fa6e12dabb3a3ed0fb44e4ff29847af68"
  ],
  "snapshot": 11437846
}'
```

...should respond with:

```
{
    "score": [
        {
            "score": 0,
            "address": "0x3c4B8C52Ed4c29eE402D9c91FfAe1Db2BAdd228D"
        },
        {
            "score": 0,
            "address": "0xd649bACfF66f1C85618c5376ee4F38e43eE53b63"
        },
        {
            "score": 0,
            "address": "0x726022a9fe1322fA9590FB244b8164936bB00489"
        },
        {
            "score": 0,
            "address": "0xc6665eb39d2106fb1DBE54bf19190F82FD535c19"
        },
        {
            "score": 0,
            "address": "0x6ef2376fa6e12dabb3a3ed0fb44e4ff29847af68"
        }
    ]
}
```

Add an address used to sign the address to the array above and the score should change to `1`.


This website is based on the Next.js + Tailwind CSS Example, using [Tailwind CSS](https://tailwindcss.com/) [(v2.2)](https://blog.tailwindcss.com/tailwindcss-2-2). It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).
