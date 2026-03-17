import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField.jsx";

function Form() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (username === "zac" && password === "zac") {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 1200);
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-sm border border-zinc-800/60 shadow-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputField
          label="Username"
          type="text"
          value={username}
          id="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-600 disabled:opacity-70 text-black font-bold py-3 rounded-full transition-all duration-200 flex items-center justify-center gap-2 mt-1"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign in"
          )}
        </button>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
}

export default Form;
