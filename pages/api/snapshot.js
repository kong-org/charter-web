import {fetchSignatures, compareSigs} from "../../arweaveFns";

const CANONICAL = process.env.CANONICAL || "1HhgIhjmE724U6SHVVhtIFLxGlCLy_h0O4SkA3IDhPY";

// See https://github.com/snapshot-labs/snapshot-strategies/blob/master/src/strategies/api-post/examples.json for expected JSON format
export default async (req, res) => {
    if (req.method === 'POST') {
        const maybeSigs = await fetchSignatures(CANONICAL, null, 500)
        const returnAddrs = compareSigs(req.body.addresses, maybeSigs)
        res.status(200).json({ score: returnAddrs })
      } else {
        res.status(400).json({ error: 'expecting POST' })
      }

}
