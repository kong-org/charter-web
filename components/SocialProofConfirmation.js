import Box from "./core/Box";
import Button from './core/Button';


const generateTweet = () => {
  const str = `I've ratified the kong.land Founding Charter.`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURI(str)}`);
}

export default function SocialProofConfirmation({ closeModal }) {
    return (
      <Box
        title={<p className="text-center"> Your signature has been recorded. </p>}
        includeBorder={false}
        content={
            <div className="mt-8 mb-6">
                <p className="font-mono mx-6 mb-6">
                  The $CITIZENs of KONG Land thank you for your service and support in ratifying this charter.
                </p>
                
                <div className="mt-12 mb-3 text-center">
                  <Button
                  primary
                  onClick={generateTweet}>
                    Share
                  </Button>
                </div>
               
                <div className="text-center">
                  <button
                    className="font-mono underline font-light text-gray-400"
                    onClick={closeModal}>
                      Close
                  </button>
                </div>
          </div>}
      />
    );
  }
