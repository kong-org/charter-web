import {fetchSignatures, compareSigs} from "../../arweaveFns";

const CANONICAL = process.env.CANONICAL || "1HhgIhjmE724U6SHVVhtIFLxGlCLy_h0O4SkA3IDhPY";

let cursor = null;
let sigs = [];

// Iterate through results, append signatures, stop when we get to the end.
async function fetchUntilEnd() {
    let newCursor = cursor
    let newSigs = await fetchSignatures(CANONICAL, cursor)
    
    if (newSigs.length > 0) {
      sigs.push(...newSigs)
      newCursor = newSigs.pop()["CURSOR"];
    }

    if (newCursor != cursor) {
      cursor = newCursor;
      await fetchUntilEnd()
    } else {
      return
    }

}

// See https://github.com/snapshot-labs/snapshot-strategies/blob/master/src/strategies/api-post/examples.json for expected JSON format
export default async (req, res) => {
    if (req.method === 'POST') {

        await fetchUntilEnd()
        const returnAddrs = compareSigs(req.body.addresses, sigs)
        
        res.status(200).json({ score: returnAddrs })
      } else {
        res.status(400).json({ error: 'expecting POST' })
      }

}
