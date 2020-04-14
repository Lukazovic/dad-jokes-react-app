import React, { Component } from "react";
import axios from "axios";
import "./JokeList.css";
import Joke from "./Joke";

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  };
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false,
    };
    this.seenJokes = new Set(this.state.jokes.map(joke => joke.id));
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }
  async getJokes() {
    try {
      this.setState({ loading: true });
      let jokes = [];
      while (jokes.length < this.props.numJokesToGet) {
        const URL = "https://icanhazdadjoke.com/";
        let res = await axios.get(URL, {
          headers: { Accept: "application/json" },
        });
        let newJoke = res.data;
        if (!this.seenJokes.has(newJoke.id)) {
          jokes.push({ text: newJoke.joke, votes: 0, id: newJoke.id });
          this.seenJokes.add(newJoke.id);
        }
      }
      this.setState(
        oldState => ({
          jokes: [...this.state.jokes, ...jokes],
          loading: false,
        }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch (err) {
      this.setState({ loading: false });
      alert(err);
    }
  }
  handleVote(id, delta) {
    this.setState(
      oldState => ({
        jokes: oldState.jokes.map(joke =>
          joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
        ),
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  handleClick() {
    this.getJokes();
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading</h1>
        </div>
      );
    }
    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="Laugh Emoji"
          />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            Fetch Jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {jokes.map(joke => (
            <Joke
              key={joke.id}
              votes={joke.votes}
              text={joke.text}
              id={joke.id}
              upvote={() => this.handleVote(joke.id, 1)}
              downvote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
