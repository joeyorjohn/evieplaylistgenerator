import Image from "next/image";

export default function Form() {
  return (
    <div>
      <div class="page-header"></div>

      <div className="w-screen h-screen max-h-screen flex flex-col items-center justify-between">
        <div className="max-w-xl p-6 mx-auto">
          <h1 className="drop-shadow-2xl leading-7 font-title text-yellow-300 text-center text-3xl md:text-4xl lg:text-5xl">
            WHICH EVIE IRIE ARE YOU?
          </h1>

          <div className="my-4">
            <p className="text-white text-center max-w-md m-auto font-bold">
              Ready to find out which Evie Irie you are? Are you the misfit
              pessemist, or the optimist looking on for the sweetness in life?
            </p>
          </div>
          <div className="flex-col flex items-center">
            <a
              className=""
              href="https://accounts.spotify.com/authorize?client_id=76ca3ebee8a047a2accca8471017114f&redirect_uri=https://evieplaylistgenerator.vercel.app/results/&scope=user-read-email ugc-image-upload user-top-read playlist-modify-public user-modify-playback-state playlist-modify-private user-follow-modify user-library-modify user-read-private playlist-read-private&response_type=code&show_dialog=true"
            >
              <button className="bg-green px-6 py-3 rounded-3xl text-white flex">
                <img
                  className="w-6 mr-2"
                  src="/images/spotify_logo_white.png"
                />
                CONNECT WITH SPOTIFY
              </button>
            </a>
            <p className="text-white text-center text-sm w-64 mt-2">
              By connecting via Spotify you agree to receive news from Evie
              Irie.
            </p>
          </div>
        </div>
        <div className="mb-2">
          <a href="https://privacy.umusic.com/">
            <p className="text-white text-center text-xs w-64 underline">
              Privacy Policy
            </p>
          </a>
          <a href="https://privacy.umusic.com/terms/">
            <p className="text-white text-center text-xs  w-64 underline">
              Terms & Conditions
            </p>
          </a>
          <a href="https://www.universalmusic.com/CCPA/">
            <p className="text-white text-center text-xs w-64 underline">
              Do Not Sell My Personal Data
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
