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

  function shuffle(array) {
    var currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

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
        "&redirect_uri=https://evieplaylistgenerator.vercel.app/results/";
      const res = await fetch("https://accounts.spotify.com/api/token", {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic Y2E2NjNhY2Q0NGNkNDMzOWJlMTczY2FlODJkMDJiNzU6MjBiM2UyMzk1MTM2NDZiODg2N2U5MWMyODE5ODc5YTQ=",
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
      var arrayLength = toptracks.items.length;

      for (i = 0; i < arrayLength; i++) {
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

      try {
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
        var instrumentalnesss = Object.entries(
          audioFeatures.audio_features
        ).map((el) => el[1].instrumentalness);
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
      } catch {
        return {
          ///THIS IS WHAT WILL BE RETURNED IF THER ARE NO AVERAGE FEATURES
          valence: 51,
        };
      }
    }

    //NEED TO UPDATE
    //Choose which song are added to the playlist
    //
    function sortTracksByAudioFeatures({ userScore, audioFeatures }) {
      var sortedTracks = [];
      var i;

      const arrayLength = Object.keys(audioFeatures.audio_features).length;

      console.log("arrayLength");
      console.log(arrayLength);

      console.log(audioFeatures);
      if (userScore >= 50) {
        sortedTracks.push(
          "4s1b7hjeIkpZwBSSr6cGhp",
          "0TrPqhAMoaKUFLR7iYDokf",
          "0zzVTGyRrWpQu8Fr28NRAv",
          "24ySl2hOPGCDcxBxFIqWBu",
          "7HMmFQsKsljwTw8bS7lu19",
          "4YKcx7YxznAdBefrYdCZ9P",
          "5IUOU5xkzGHsRFOYNu3GSK",
          "2Rb4Dey8TXM6A2R3QQaJPn",
          "0AnZrWo2TuUX5BnFjsoy3N",
          "6lyjWvSUgYtX26zfrQ6gn8"
        );
        try {
          for (i = 0; i < arrayLength; i++) {
            if (
              audioFeatures.audio_features[i].valence >= 0.5 &&
              audioFeatures.audio_features[i].valence <= 1
            ) {
              sortedTracks.push(audioFeatures.audio_features[i].id);
            }
          }
        } catch {
          return sortedTracks;
        }
      } else {
        sortedTracks.push(
          "45XF1g06KdLuT5Mad8dmrI",
          "2WyRfGeHo97VC5mP1BBSzr",
          "1qYlzlWIWRaEGF9Qjf0T2P",
          "5E30LdtzQTGqRvNd7l6kG5",
          "6IbnUaczZBT34DhaD6S18F",
          "052vSBPxqdmYRDlkSPiavc",
          "0XyjtybwqSdqMAFfBEkmZf",
          "04aAxqtGp5pv12UXAg4pkq",
          "6Qn5zhYkTa37e91HC1D7lb",
          "6i0V12jOa3mr6uu4WYhUBr"
        );
        try {
          for (i = 0; i < arrayLength; i++) {
            if (
              audioFeatures.audio_features[i].valence >= 0 &&
              audioFeatures.audio_features[i].valence <= 0.5
            ) {
              sortedTracks.push(audioFeatures.audio_features[i].id);
            }
          }
        } catch {
          return sortedTracks;
        }
      }
      console.log("sortedTracks");
      console.log(sortedTracks);
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
      try {
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
      } catch (err) {
        return null;
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
      const res = await fetch(
        "https://evieplaylistgenerator.vercel.app/api/user",
        {
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
        }
      );
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
      const playl = "https://open.spotify.com/playlist/" + playlistID;
      setPlaylistLink(playl);
      setPlaylistName(playlist_name);
      const sortedTracks = await sortTracksByAudioFeatures({
        userScore,
        audioFeatures,
      });
      console.log(sortedTracks);
      await shuffle(sortedTracks);
      console.log("SHUFFLED");
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
      await setScore(resultScore);

      //await uploadPlaylistImage({ auth, playlistID });
    }

    main();
  }, []);

  if (score == null) {
    return <Loading />;
  } else if (score <= 50) {
    return (
      <Pessimist
        score={score}
        playlistname={playlistName}
        playlistlink={playlistLink}
      />
    );
  } else {
    return (
      <Optimist
        score={score}
        playlistname={playlistName}
        playlistlink={playlistLink}
      />
    );
  }
}

export default withRouter(Form);
