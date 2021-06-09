import React, { useState } from "react";
import { withRouter } from "next/router";

function Form({ router }) {
  const [count, setCount] = useState();

  async function extractCode() {
    const code = await router.query.code;
    return code;
  }

  async function getStaticProps(code) {
    var body =
      "grant_type=authorization_code&code=" +
      code +
      "&redirect_uri=http://localhost:3000/dashboard/";
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
      setCount("Bearer " + data.access_token);
    }
    console.log(data);
    return data;
  }

  async function getUserId() {
    const head = {
      Authorization: count,
    };
    const userID = await fetch("https://api.spotify.com/v1/me", {
      headers: head,
    });
    const id = await userID.json();
    if (userID.status == 200) {
      return id;
    }
  }

  async function main() {
    const code = await extractCode();
    const tokens = await getStaticProps(code);
    const text = await getUserId();
    console.log(text);

    //const userID = await getUserID(tokens.access_token);
    //console.log("userID" + userID);

    //Need to add send to database
  }

  main();

  return (
    <>
      <h2>{count}</h2>
    </>
  );
}

export default withRouter(Form);
