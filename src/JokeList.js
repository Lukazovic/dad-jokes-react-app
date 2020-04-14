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
    this.state = { jokes: [] };
    this.handleVote = this.handleVote.bind(this);
  }
  async componentDidMount() {
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      const URL = "https://icanhazdadjoke.com/";
      let res = await axios.get(URL, {
        headers: { Accept: "application/json" },
      });
      jokes.push({ text: res.data.joke, votes: 0, id: res.data.id });
    }
    this.setState({ jokes });
  }
  handleVote(id, delta) {
    this.setState(oldState => ({
      jokes: oldState.jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      ),
    }));
  }
  render() {
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
          <button className="JokeList-getmore">New Jokes</button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map(joke => (
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
