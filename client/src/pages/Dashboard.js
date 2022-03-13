import React, { useEffect, useState } from "react";

import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    //fetch quote from backend
    const req = await fetch("http://localhost:1337/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    //onload of page
    const token = localStorage.getItem("token"); //get the token from local storage
    if (token) {
      const user = jwt.decode(token); //decode the token
      if (!user) {
        //if token is invalid
        localStorage.removeItem("token"); //remove the token from local storage
        navigate("/login", { replace: true }); //navigate to login page
      } else {
        populateQuote(); //if user is true then fetch quote from api with access token for verification
      }
    }
    // eslint-disable-next-line
  }, []);

  async function updateQuote(event) {
    //send update to the backend
    event.preventDefault(); //on event happen, prevent refresh
    const req = await fetch("http://localhost:1337/api/quote", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <h1>Your quote: {quote || "No quote found"}</h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="Update Quote" />
      </form>
    </div>
  );
};

export default Dashboard;
