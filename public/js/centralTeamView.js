// centralTeamView.js - React code for central-team-view.html

function LoginScreen({ onLogin }) {

  const [password, setPassword] = React.useState('');

  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {

    e.preventDefault();

    if (password === 'central2024') {

      localStorage.setItem('centralTeamAuth', 'true');

      onLogin();

    } else {

      setError('Invalid password. Please try again.');

    }

  };

  return (
<div className="login-container">
<div className="login-box">
<h2 className="text-2xl font-bold mb-6">Central Team View Access</h2>
<form onSubmit={handleSubmit}>
<input

            type="password"

            className="login-input"

            placeholder="Enter password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

          />
<button type="submit" className="login-button">Login</button>

          {error && <div className="login-error">{error}</div>}
</form>
</div>
</div>

  );

}

function CentralTeamView() {

  return (
<div className="card">
<div className="header">
<h1 className="text-2xl font-bold">Central Team Daily Status View</h1>
</div>
<p style={{ textAlign: 'center' }}>Central Team View content goes here.</p>
</div>

  );

}

function App() {

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {

    if (localStorage.getItem('centralTeamAuth') === 'true') {

      setIsAuthenticated(true);

    }

  }, []);

  return !isAuthenticated ? <LoginScreen onLogin={() => setIsAuthenticated(true)} /> : <CentralTeamView />;

}

ReactDOM.render(<App />, document.getElementById('root'));
