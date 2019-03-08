import React, { Component } from "react";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import Modal from "react-modal";
import LogInForm from "./components/LogInForm";
import LogOut from "./components/LogOut";
import SignUpForm from "./components/SignUpForm";
import ProfileContainer from "./containers/ProfileContainer";
import CitiesContainer from "./containers/CitiesContainer";
import HomeContainer from "./containers/HomeContainer";
import CreatePost from "./components/CreatePost";
import PostModal from "./components/PostModal";
// import CityList from "./components/CityList"

import "./App.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
Modal.setAppElement("body");
class App extends Component {
  state = {
    username: "",
    pw: "",
    isLoggedIn: false,
    user: null
  };

  componentDidMount() {
    if (localStorage.token) {
      axios({
        method: "get",
        url: `http://localhost:3001/user`,
        headers: { authorization: `Bearer ${localStorage.token}` }
      })
        .then(response => {
          console.log(response);
          this.setState({
            isLoggedIn: true,
            user: response.data
          });
        })
        .catch(err => console.log(err));
    } else {
      this.setState({
        isLoggedIn: false
      });
    }
  }

  handleLogOut = () => {
    this.setState({
      username: "",
      pw: "",
      isLoggedIn: false
    });
    localStorage.clear();
  };

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSignUp = e => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/user/signup", {
        username: this.state.username,
        pw: this.state.pw
      })
      .then(response => {
        console.log(response);
        localStorage.token = response.data.signedJwt;
        this.setState({
          isLoggedIn: true
        });
      })
      .catch(err => console.log(err));
  };

  handleLogIn = e => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/user/login", {
        username: this.state.username,
        pw: this.state.pw
      })
      .then(response => {
        localStorage.token = response.data.signedJwt;
        this.setState({
          isLoggedIn: true
        });
      })
      .catch(err => console.log(err));
  };

  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div className="App">
        <NavBar
          brand="logo"
          right
          isLoggedIn={this.state.isLoggedIn}
          handleLogOut={this.handleLogOut}
        />
        <ul className="temp-ul">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cityprofile">Cities</Link>
          </li>
          <li>
            <Link to="/user/profile">User Profile</Link>
          </li>
          <li>
            <Link to="/createpost">Create Post</Link>
          </li>
          <li>
            <Link to="/post">Post Modal</Link>
          </li>
        </ul>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}>Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>

        {/* <a href="#testing" className="btn modal-trigger">
          Testing
        </a>
        <div className="modal" id="testing">
          <div className="modal-content">my little pony</div>
        </div> */}
        <Switch>
          <Route
            path="/signup"
            render={() =>
              this.state.loggedIn ? (
                <Redirect to="/user/profile" />
              ) : (
                <SignUpForm
                  isLoggedIn={this.state.isLoggedIn}
                  handleInput={this.handleInput}
                  handleSignUp={this.handleSignUp}
                />
              )
            }
          />
          <Route
            path="/login"
            render={props => {
              return (
                <LogInForm
                  isLoggedIn={this.state.isLoggedIn}
                  handleInput={this.handleInput}
                  handleLogIn={this.handleLogIn}
                />
              );
            }}
          />
          <Route
            path="/logout"
            render={props => {
              return (
                <LogOut
                  isLoggedIn={this.state.isLoggedIn}
                  handleLogOut={this.handleLogOut}
                />
              );
            }}
          />

          {/* this will be logged-in user's view of city page */}
          {/* <Route
              path='/'
              render={() => {
                return (
                  <DogList isLoggedIn={this.state.isLoggedIn} />
                )
              }}
            /> */}

          <Route path="/user" component={ProfileContainer} />
          {/* <Route path="/cityprofile" component={CitiesContainer} /> */}
          <Route path="/cities" component={CitiesContainer} />
          {/* <Route
              path='/'
              render={() => {
                return (
                  <CityList isLoggedIn={this.state.isLoggedIn} />
                )
              }}
            /> */}
          <Route exact path="/" component={HomeContainer} />
          <Route path="/createpost" component={CreatePost} />
          <Route path="/post" component={PostModal} />
        </Switch>
      </div>
    );
  }
}

export default App;
