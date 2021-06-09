import React, { useState, useEffect } from "react";
import { withRouter } from "next/router";
import image from "next/image";
import { isResSent } from "next/dist/next-server/lib/utils";
import Optimist from "../components/Optimist";
import Pessimist from "../components/Pessimist";
import Loading from "../components/Loading";

function Form({ router }) {
  const [bearer, setBearer] = useState();
  const [score, setScore] = useState();
  const [playlistName, setPlaylistName] = useState();
  const [playlistLink, setPlaylistLink] = useState();
  const [props, setProps] = useState();

  useEffect(() => {
    async function extractCode() {
      const queryKey = "code";
      const queryValue =
        router.query[queryKey] ||
        router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`));
      console.log(queryValue[1]);
      return queryValue[1];
    }

    async function postRequest(code) {
      var body =
        "grant_type=authorization_code&code=" +
        code +
        "&redirect_uri=http://localhost:3000/results/";
      const res = await fetch("https://accounts.spotify.com/api/token", {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic NzZjYTNlYmVlOGEwNDdhMmFjY2NhODQ3MTAxNzExNGY6YjVmYjVhNTcwYzc3NDc5OThiNDQ2Mjg5MmZhMzM2NDg=",
        },
        method: "POST",
      });
      console.log("STATUS" + res.status);
      const data = await res.json();
      if (res.status == 200) {
        setBearer("Bearer " + data.access_token);
      }
      return data;
    }

    async function getUser(auth) {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: auth,
      });
      console.log("STATUS" + res.status);
      const data = await res.json();
      return data;
    }

    async function getTopTracks(auth) {
      const res = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
        { headers: auth }
      );
      console.log("STATUS" + res.status);
      const data = await res.json();
      return data;
    }

    async function getTrackIDs(toptracks) {
      var trackids = [];
      var i;
      for (i = 0; i < 50; i++) {
        trackids.push(toptracks.items[i].id);
      }
      return trackids;
    }

    async function getAudioFeatures({ auth, trackIDs }) {
      const joined = trackIDs.join("%2C");
      const url = "	https://api.spotify.com/v1/audio-features?ids=" + joined;
      const res = await fetch(url, { headers: auth });
      console.log("STATUS" + res.status);
      const data = await res.json();
      return data;
    }

    async function getAverageResults(audioFeatures) {
      var averagefeatures = {};

      //acousticness
      var acousticnesss = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].acousticness
      );
      var acousticness =
        acousticnesss.reduce((a, c) => a + c) / acousticnesss.length;
      averagefeatures.acousticness = acousticness;

      //DANCEABILITY
      var danceabilitys = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].danceability
      );
      var danceability =
        danceabilitys.reduce((a, c) => a + c) / danceabilitys.length;
      averagefeatures.danceability = danceability;

      //energy
      var energys = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].energy
      );
      var energy = energys.reduce((a, c) => a + c) / energys.length;
      averagefeatures.energy = energy;

      //instrumentalness
      var instrumentalnesss = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].instrumentalness
      );
      var instrumentalness =
        instrumentalnesss.reduce((a, c) => a + c) / instrumentalnesss.length;
      averagefeatures.instrumentalness = instrumentalness;

      //liveness
      var livenesss = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].liveness
      );
      var liveness = livenesss.reduce((a, c) => a + c) / livenesss.length;
      averagefeatures.liveness = liveness;

      //loudness
      var loudnesss = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].loudness
      );
      var loudness = loudnesss.reduce((a, c) => a + c) / loudnesss.length;
      averagefeatures.loudness = loudness;

      //speechiness
      var speechinesss = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].speechiness
      );
      var speechiness =
        speechinesss.reduce((a, c) => a + c) / speechinesss.length;
      averagefeatures.speechiness = speechiness;

      //tempo
      var tempos = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].tempo
      );
      var tempo = tempos.reduce((a, c) => a + c) / tempos.length;
      averagefeatures.tempo = tempo;

      //tempo
      var valences = Object.entries(audioFeatures.audio_features).map(
        (el) => el[1].valence
      );
      var valence = valences.reduce((a, c) => a + c) / valences.length;
      averagefeatures.valence = valence;

      return averagefeatures;
    }

    //NEED TO UPDATE
    //Choose which song are added to the playlist
    function sortTracksByAudioFeatures(audioFeatures) {
      var sortedTracks = [];
      var i;
      for (i = 0; i < 50; i++) {
        if (
          audioFeatures.audio_features[i].valence >= 0.5 &&
          audioFeatures.audio_features[i].valence <= 1
        ) {
          sortedTracks.push(audioFeatures.audio_features[i].id);
        }
      }
      return sortedTracks;
    }

    async function getUserPlaylists({ auth, playlist_name }) {
      const res = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: auth,
      });
      const data = await res.json();

      var i;
      console.log("data");

      console.log(data);
      if (data != null) {
        for (i = 0; i < 20; i++) {
          if (data.items[i].name == playlist_name) {
            const result = data.items[i].id;
            return result;
          } else {
            return null;
          }
        }
      }
    }

    async function createPlaylist({
      auth,
      playlist_name,
      playlist_description,
      userID,
    }) {
      const url = "https://api.spotify.com/v1/users/" + userID + "/playlists";
      const headers = Object.assign(auth, {
        Accept: "application/json",
        "Content-Type": "application/json",
      });
      const res = await fetch(url, {
        body: JSON.stringify({
          name: playlist_name,
          description: playlist_description,
          public: true,
        }),
        headers: headers,
        method: "POST",
      });
      const data = await res.json();
      const newPlaylistID = data.id;
      return newPlaylistID;
    }

    async function addTracksToPlaylist({ auth, sortedTracks, playlistID }) {
      const tracks = sortedTracks.map((i) => "spotify:track:" + i);
      const uris = tracks.join("%2C");

      const url =
        "https://api.spotify.com/v1/playlists/" +
        playlistID +
        "/tracks?position=0&uris=" +
        uris;

      console.log(tracks);
      const res = await fetch(url, {
        headers: auth,
        method: "POST",
      });
      console.log("STATUS" + res.status);
      const data = await res.json();
      console.log(data);

      return data;
    }

    async function followArtistPlaylist({ auth, playlistToFollow }) {
      const url =
        "https://api.spotify.com/v1/playlists/" +
        playlistToFollow +
        "/followers";
      const headers = Object.assign(auth, {
        Accept: "application/json",
        "Content-Type": "application/json",
      });
      const res = await fetch(url, {
        headers: headers,
        method: "PUT",
      });
      console.log("Playlist Followed" + res.status);
      return res.status;
    }

    async function followArtistProfile({ auth, artistToFollow }) {
      const url =
        "https://api.spotify.com/v1/me/following?type=artist&ids=" +
        artistToFollow;
      const headers = Object.assign(auth, {
        Accept: "application/json",
        "Content-Type": "application/json",
      });
      const res = await fetch(url, {
        headers: headers,
        method: "PUT",
      });
      console.log("Artist Followed" + res.status);
      return res.status;
    }

    async function saveTracks({ auth, tracksToSave }) {
      const uris = tracksToSave.join("%2C");
      const url = "https://api.spotify.com/v1/me/tracks?ids=" + uris;
      const headers = Object.assign(auth, {
        Accept: "application/json",
        "Content-Type": "application/json",
      });
      const res = await fetch(url, {
        headers: headers,
        method: "PUT",
      });
      console.log("Tracks Saved " + res.status);
      return res.status;
    }

    async function postToMongo({ post, user, toptracks, playlistID }) {
      console.log(post);
      const res = await fetch("http://localhost:3000/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          display_name: user.display_name,
          access_token: post.access_token,
          refresh_token: post.refresh_token,
          scope: post.scope,
          country: user.country,
          email: user.email,
          id: user.id,
          followers: user.followers.total,
          product: user.product,
        }),
      });
      console.log("usercreated" + res.status);
      return res.status;

      /*
    POST TO MONGODB WITH PLAYLIST LINK & TOP 50 TRACKS
    display_name: { type: String },
  timeStamp: { type: String, default: () => Date.now() },
  access_token: { type: String },
  refresh_token: { type: String },
  scope: { type: String },
  country: { type: String },
  email: { type: String },
  id: { type: String },
  followers: { type: String },
  product: { type: String },
    */
    }

    async function main() {
      const code = await extractCode();
      const post = await postRequest(code);
      console.log(post);
      var auth = { Authorization: "Bearer " + post.access_token };
      const user = await getUser(auth);
      console.log(user);
      console.log(user.display_name);
      const userID = user.id;

      //UPDATE THESE
      const playlist_name =
        "Evie Irie Recommendations for " + user.display_name;
      const playlist_description = "I made this playlist for you";
      const playlistToFollow = "6IKCMT4UkgHMX7NNX2roan";
      const artistToFollow = "2ReivzVeWl6GawKNyVTLmK";
      const tracksToSave = ["6lRUCqq1uSxcwCwcithfqj", "6qu92JSTOFopWLTgFnnAIC"];
      //UPDATE THESE

      const checkPlaylists = await getUserPlaylists({ auth, playlist_name });
      console.log(checkPlaylists);
      let playlistID = "";
      if ((await checkPlaylists) == null) {
        playlistID = await createPlaylist({
          auth,
          playlist_name,
          playlist_description,
          userID,
        });
        console.log("New Playlist Created");
      } else {
        playlistID = checkPlaylists;
        console.log("Use Existing Playlist");
      }
      console.log(playlistID);

      const toptracks = await getTopTracks(auth);
      console.log(toptracks);
      const trackIDs = await getTrackIDs(toptracks);
      console.log(trackIDs);
      const audioFeatures = await getAudioFeatures({ auth, trackIDs });
      console.log(audioFeatures);
      const averageResults = await getAverageResults(audioFeatures);
      console.log(averageResults);
      //UDATE THIS WITH THE SCORE YOU WOULD LIKE TO USE
      let userScore = averageResults.valence.toString();
      userScore = userScore.substr(2, 2);
      const resultScore = parseInt(userScore);
      setScore(resultScore);
      const playl = "https://open.spotify.com/playlist/" + playlistID;
      setPlaylistLink(playl);
      setPlaylistName(playlist_name);
      const sortedTracks = await sortTracksByAudioFeatures(audioFeatures);
      console.log(sortedTracks);
      console.log(sortedTracks);
      const addTracks = await addTracksToPlaylist({
        auth,
        sortedTracks,
        playlistID,
      });
      console.log(addTracks);
      const databaseAdd = await postToMongo({
        post,
        user,
        toptracks,
        playlistID,
      });
      await followArtistPlaylist({
        auth,
        playlistToFollow,
      });
      await followArtistProfile({
        auth,
        artistToFollow,
      });
      await saveTracks({
        auth,
        tracksToSave,
      });

      //await uploadPlaylistImage({ auth, playlistID });
    }

    main();
  }, []);

  if (score == null) {
    return <Loading />;
  } else if (score <= 50) {
    return (
      <Optimist
        score={score}
        playlistname={playlistName}
        playlistlink={playlistLink}
      />
    );
  } else {
    return (
      <Pessimist
        score={score}
        playlistname={playlistName}
        playlistlink={playlistLink}
      />
    );
  }
}

export default withRouter(Form);