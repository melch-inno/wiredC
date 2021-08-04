import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './login';
import Register from './Register';
import Home from './Home';



function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Login} />
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;