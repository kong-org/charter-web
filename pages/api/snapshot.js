import {fetchSignatures, compareSigs} from "../../arweaveFns";

const CANONICAL = process.env.CANONICAL || "hZ4YLIvvMpQwjjayyKVgn1UQzqzOW-BrQxheOfmLw9M";

// See https://github.com/snapshot-labs/snapshot-strategies/blob/master/src/strategies/api-post/examples.json for expected JSON format
export default async (req, res) => {
    if (req.method === 'POST') {
        const maybeSigs = await fetchSignatures(CANONICAL)
        const returnAddrs = compareSigs(req.body.addresses, maybeSigs)
        res.status(200).json({ score: returnAddrs })
      } else {
        res.status(400).json({ error: 'expecting POST' })
      }

}
