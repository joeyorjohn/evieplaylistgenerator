import React from "react";
import Image from "next/image";

export default function Pessimist(props) {
  return (
    <div>
      <div className="-z-10 fixed top-0 w-screen h-screen overflow-hidden">
        <Image
          alt="Mountains"
          src="/images/Evie_bg.jpg"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="pt-4 w-screen flex justify-center">
        <div className=" mx-4 p-4 rounded-xl max-w-lg">
          <div className="m-auto text-center text-4xl font-title text-yellow-300">
            <h1>The Pessimist</h1>
          </div>
          <img className="my-2" src="/images/Evie_Pessimist.png"></img>
          <p className="text-white font-bold text-center text-justify">
            You got the Pessimist! (Don't worry she's cooler anyway). Your music
            scored a {props.score} on the happiness scale, which means you like
            things a litte more on the emotional side.{" "}
          </p>
          <div className="bg-gray rounded-md px-4 py-4 mt-2">
            <h3 className="text-yellow-300 mb-2 text-center text-xl font-bold">
              I made this personalized Spotify playlist just for you.
            </h3>
            <a href={props.playlistlink}>
              <div className="flex items-center justify-center mb-2">
                <img
                  className="w-32 bg-cover mr-3"
                  src="/images/playlistcover.jpg"
                ></img>
                <div>
                  <p className="text-white mb-1 font-bold">
                    {props.playlistname}
                  </p>
                  <button className="bg-green px-2 py-2 rounded-3xl text-white text-xs flex items-center md:text-sm">
                    <img
                      className="w-5 mr-1"
                      src="/images/spotify_logo_white.png"
                    />
                    Listen on Spotify
                  </button>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
