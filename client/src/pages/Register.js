import { useState } from "react";
import { useNavigate } from "react-router-dom";

//register page
function App() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:1337/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data = await response.json();

    if(data.status === 'ok'){ //if api returns ok then move to login page
      navigate('/login');
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit = {registerUser}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="First Name"
        />
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

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default App;
