import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { generateSignature, signCharter } from "../arweaveFns";
import { useConnect, useSigner } from "wagmi";
import Modal from "react-modal";
import Button from "./core/Button";
import Box from "./core/Box";
import ScaleLoader from "react-spinners/ScaleLoader";
import VerificationPopUp from "./VerificationPopup";
import SocialProofPopup from "./SocialProofPopup";
import SocialProofConfirmation from "./SocialProofConfirmation";
import MetaMaskIcon from "./core/icons/MetaMaskIcon";
import WalletConnectIcon from "./core/icons/WalletConnectIcon";
import { data } from "autoprefixer";

Modal.setAppElement("#__next");
Modal.defaultStyles.overlay.backgroundColor = "#555555aa";

const customStyles = {
  content: {
    top: "10vh",
    left: "10vw",
    right: "auto",
    bottom: "auto",
    width: "80vw",
    marginRight: "-50%",
    borderColor: "black",
    borderRadius: "0",
    padding: "0",
  },
};

export function DisplayedError({ displayedError }) {
  return (
    <>
      {displayedError && (
        <div className="mt-7 text-center font-mono text-sm text-red-700">
          {displayedError || (
            <>
              Wallet not connected/found. Please install{" "}
              <a
                className="underline"
                target="_blank"
                href="https://metamask.io/download.html"
              >
                Metamask
              </a>{" "}
              or another Web3 wallet provider.
            </>
          )}
        </div>
      )}
    </>
  );
}

function SignScreen({
  handleSubmit,
  onSubmit,
  setValue,
  register,
  displayedError,
  loading,
  walletName,
}) {
  const [
    {
      data: { connected, connector, loading: loadingWalletInfo },
    },
  ] = useConnect();
  return (
    <div className="w-full h-full bg-black">
      <form className="w-full font-body pb-4">
        <div className="w-full font-mono font-bold text-center py-4 bg-black text-white border-b border-kong-border">
          Sign the Charter
        </div>
        <div className="pt-7 pb-4 px-8 bg-black">
          <p className="font-mono text-white">Enter your name to sign:</p>
          <div className="mt-6">
            <input
              className="input-placeholder text-white font-mono border border-kong-border bg-black focus:outline-none w-full px-4 py-5"
              type="text"
              {...register("name")}
              autoComplete="off"
              autoFocus
              placeholder="Your name or alias"
            />
            <input
              className="input-placeholder text-white font-mono border-b border-l border-r border-kong-border bg-black focus:outline-none w-full px-4 py-4"
              type="text"
              {...register("handle")}
              autoComplete="off"
              placeholder="Your Twitter username"
            />
          </div>
          <div className="mt-2 flex space-x-4 justify-center">
            {!loadingWalletInfo && !connected && (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("wallet", "MetaMask");
                    handleSubmit(onSubmit)();
                  }}
                  disabled={!window.ethereum}
                  className={
                    "flex my-5 text-white text-sm sm:text-base font-mono items-center" +
                    (window.ethereum ? "" : " opacity-60")
                  }
                  primary
                >
                  <div className="mr-2">Sign With</div>
                  <MetaMaskIcon />
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("wallet", "WalletConnect");
                    handleSubmit(onSubmit)();
                  }}
                  className={
                    "flex my-5 text-white text-sm sm:text-base font-mono items-center"
                  }
                  primary
                >
                  <div className="mr-2">Sign With</div>
                  <WalletConnectIcon />
                </Button>
              </>
            )}
            {!loadingWalletInfo && connected && (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("wallet", connector.name);
                    handleSubmit(onSubmit)();
                  }}
                  className={
                    "flex my-5 text-white text-sm sm:text-base font-mono items-center"
                  }
                  primary
                >
                  {loading ? (
                    <ScaleLoader color="white" height={12} width={3} />
                  ) : (
                    <>
                      <div className="mr-2">Sign With</div>
                      {connector?.name === "WalletConnect" && (
                        <WalletConnectIcon />
                      )}
                      {connector?.name === "MetaMask" && <MetaMaskIcon />}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          <DisplayedError displayedError={displayedError} />
        </div>
      </form>
    </div>
  );
}

export default function Sign({ txId, charter }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [stage, setStage] = React.useState(0);
  const [submitData, setSubmitData] = React.useState();
  const [formData, setFormData] = React.useState();
  const [signSuccess, setSignSuccess] = React.useState(false);
  const [loading, setIsLoading] = React.useState(false);
  const [displayedError, setDisplayedError] = React.useState(false);

  const [
    {
      data: { connectors, connected },
    },
    connect,
  ] = useConnect();
  const [_signerData, getSigner] = useSigner();
  function openModal() {
    setStage(0);
    setIsOpen(true);
  }

  function closeModal() {
    if (stage === 0 || signSuccess) {
      setIsOpen(false);
      setIsLoading(false);
      setDisplayedError(null);
      reset();
    } else {
      setStage((stage) => stage - 1);
    }
  }

  const sign = () =>
    signCharter(
      getSigner,
      txId,
      formData.name,
      formData.handle,
      charter,
      formData.sig
    ).then(() => setSignSuccess(true));

  const connectWallet = async (walletName) => {
    return await connect(
      connectors.find((connector) => connector.name === walletName)
    );
  };

  useEffect(() => {
    setIsLoading(true);
    setDisplayedError(null);

    if (submitData)
      if (!connected) {
        connectWallet(submitData.wallet).catch((err) => {
          setDisplayedError(err.message);
          setIsLoading(false);
        });
      } else if (connected) {
        generateSignature(charter, getSigner)
          .then((sig) => {
            setStage(1);
            setFormData({
              sig,
              name: submitData.name,
              handle: submitData.handle,
            });
            setIsLoading(false);
          })
          .catch((err) => {
            setDisplayedError(err.message);
            setIsLoading(false);
          });
      }
  }, [connected, submitData]);

  const onSubmit = async (data) => {
    if (data.name === "") {
      setDisplayedError("Cannot sign with an empty name");
      return;
    }
    setSubmitData(data);
  };

  return (
    <Box
      title="Sign the Charter"
      content={
        <>
          <div className="my-4">
            <p className="font-mono mb-6 text-left">
              Review the{" "}
              <a
                className="underline"
                href="https://ipfs.io/ipfs/QmXd8HV6yK87M7fmszaXRULpM9cf1pMEuAg25UKskozACk"
              >
                KONG Land Trustless Unincorporated Nonprofit Association
                Agreement
              </a>{" "}
              and sign the Founding Charter to become a voting $CITIZEN.
              Signatures will become part of this document's permanent history.
            </p>
            <div className="mt-4">
              <Button primary onClick={openModal}>
                Sign
              </Button>
            </div>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="sign-modal"
          >
            {stage === 0 && (
              <SignScreen
                {...{
                  handleSubmit,
                  onSubmit,
                  register,
                  displayedError,
                  setValue,
                  loading,
                  walletName: data.wallet,
                }}
              />
            )}
            {stage === 1 && (
              <SocialProofPopup {...{ setStage, formData, sign }} />
            )}
            {stage === 2 && (
              <VerificationPopUp {...{ setStage, formData, sign }} />
            )}
            {stage === 3 && <SocialProofConfirmation closeModal={closeModal} />}
          </Modal>
        </>
      }
    />
  );
}
