import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import useSound from 'use-sound';

import winSound from './sounds/win-sonud.mp3';
import loseSound from './sounds/lose-sound.mp3';

function App() {
  const [word, setWord] = useState("");
  const [guess, setGuess] = useState("");
  const [guessedCharacters, setGuessedCharacters] = useState("");
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameWon, setGameWon] = useState(0);
  const [wrongCharacters, setWrongCharacters] = useState([]);
  const [win] = useSound(winSound);
  const [lose] = useSound(loseSound);
  //const [displayString, setDisplayString] = useState('');

  function startGame() {
    fetch("https://random-word-api.herokuapp.com/word")
      .then((response) => response.json())
      .then((response) => {
        setWord(response[0]);
        console.log(response[0]);
        var temp = "";
        for (var i = 0; i < response[0].length; i++) {
          temp += "_";
          temp += "  ";
        }
        setGuessedCharacters(temp);
        setWrongGuesses(0);
        setWrongCharacters([]);
        setGameWon(0);
        console.log(temp);
      });
  }

  function occurrences(string, key) {
    var numOccurrences = 0;
    var index = 0;
    var i = 0;
    var indexes = [];
    while (i != 1) {
      if (string.indexOf(key, index) === -1) {
        i = 1;
      } else {
        indexes.push(string.indexOf(key, index));
        index = string.indexOf(key, index) + 1;
        numOccurrences++;
      }
    }
    return indexes;
  }

  function replaceCharacter(original, index, replacement) {
    return (
      original.substring(0, index) +
      replacement +
      original.substring(index + replacement.length)
    );
  }

  function checkGuess() {
    var occurrenceIndexes = occurrences(word, guess);
    console.log(wrongGuesses);
    if (occurrenceIndexes.length === 0) {
      if (wrongGuesses < 5) {
        setWrongGuesses(wrongGuesses + 1);
        var temp = [...wrongCharacters, guess];
        setWrongCharacters(temp);
        console.log(temp);
        console.log("Wrong Guess "+ wrongGuesses);
      }else{
        console.log('hello ????????')
       // lose();
      }
    } else {
      var temp = "";
      var temp2 = "";
      for (var i = 0; i < guessedCharacters.length; i++) {
        if (guessedCharacters[i] != " ") {
          temp += guessedCharacters[i];
        }
      }
      for (var i = 0; i < occurrenceIndexes.length; i++) {
        temp = replaceCharacter(temp, occurrenceIndexes[i], guess);
      }

      console.log(temp);
      
      for (var i = 0; i < temp.length; i++) {
        temp2 += temp[i];
        temp2 += "  ";
      }
      setGuessedCharacters(temp2);
      console.log(temp2);

      if (temp.indexOf("_") === -1){
        setGameWon(1);
        win();
      }
    }
  }
  return (
    <div className="App">
      <button
        onClick={() => {
          startGame();
        }}
      >
        Start Game
      </button>
      <br />
      {word != "" && (
        <>
          {wrongGuesses < 5 ? (
            <>
            {gameWon === 1 ? (
              
              <img src={require(`./images/win.png`)} />
             ) : (
              <>
              <img src={require(`./images/stage${wrongGuesses}.png`)} />

              <br />
              <div>{guessedCharacters}</div>
              <br />
              <input
                placeholder="Guess"
                type="text"
                className="guess"
                value={guess}
                onChange={(text) => {
                  setGuess(text.target.value[0]);
                  console.log(text.target.value[0]);
                }}
              />
              <br />
              <button
                onClick={() => {
                  if(guess != ""){
                  checkGuess();
                  setGuess("");
                  }
                }}
              >
                Guess
              </button>
              <div className="wrongCharacters">
                <p>Wrong Guesses</p>
                <ul>
                {wrongCharacters.map((character, key) => (
                  <li key={key}>{character}</li>
                ))}
                </ul>
              </div>
              </>
            )}
              
            </>
          ) : (
            <>
            <img src={require(`./images/stage5.png`)} />
            <br/>
            <p>{word}</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
