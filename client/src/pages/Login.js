import { useState } from "react";
import { useNavigate } from "react-router-dom";

//login page, shown after register
function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.user){
      localStorage.setItem("token", data.user);
      alert('Login Successful');
      navigate('/dashboard');
    } else{
      alert('Login Failed');
    }

    console.log(data);
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />

        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default App;
