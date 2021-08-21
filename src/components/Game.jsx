import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';
import ScoreBoard from "./ScoreBoard";
import WordBank from "./WordBank";
import Letterpad from "./Letterpad";
import Controller from "./Controller";
import {withCookies} from 'react-cookie';
import shuffle from "../utils";

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            keyLetter: '',
            letters: [],
            pangrams: new Set(),
            solutions: new Set(),
            solved: new Set(),
            userEntryState: "",
            dayNumber: this.getDayNumber(),
            words: []

        }
    }

    componentDidMount() {
        fetch("data/good_words.json")
            .then(w => w.json())
            .then(
                words => {
                    console.log(`received ${words.length} words`);
                    this.processWordList(this.state.dayNumber, words);
                },
                err => {

                }
            );
    }

    processWordList(dayNumber, words) {
        let letterChoices = new Set();
        for (const word of words) {
            let letters = new Set(word);
            if (letters.size === 7 && !word.endsWith("ing")) {
                letterChoices.add(letters);
            }
        }
        letterChoices = Array.from(letterChoices).sort();
        const letters = letterChoices[dayNumber % letterChoices.length];
        const sortedLetters = Array.from(letters).sort();
        let idx = dayNumber % 7;
        const keyLetter = sortedLetters[idx];
        sortedLetters.splice(sortedLetters.indexOf(keyLetter), 1);

        const solutions = new Set();
        const pangrams = new Set();

        const {cookies} = this.props;
        let solved = cookies.get("day" + dayNumber) || [];

        for (const word of words) {
            if (word.includes(keyLetter) &&
                Array.from(word).every(l => letters.has(l))) {
                solutions.add(word);
                if (new Set(word).size === 7) {
                    pangrams.add(word);
                }
            }
        }

        solved = new Set(solved.filter(w => solutions.has(w)));

        this.setState({
            keyLetter,
            pangrams,
            solutions,
            words,
            dayNumber,
            solved,
            letters: shuffle(sortedLetters, Math.max(0, idx - 1)) /* not random but consistent for dev */
        });
    }

    getDayNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const years = 365 * now.getFullYear();
        let subYear = now - start;
        subYear = Math.floor(subYear / 86400 / 1000)
        return years + subYear;
    }

    render() {
        let {keyLetter, letters, solved, solutions, pangrams, dayNumber} = this.state;
        return (
            <div className="Game">
                <div className="GameContainer">
                    <ScoreBoard solved={solved} solutions={solutions}
                                pangrams={pangrams}/>
                    <Letterpad keyLetter={keyLetter}
                               letters={letters}
                               onSubmit={w => this.handleNewWord(w)}
                    />
                    <WordBank solved={solved}/>
                    <Controller dayNumber={dayNumber}
                                pangrams={pangrams}
                                onReveal={() => this.revealAll()}
                                onYesterday={() => this.goToYesterday()}/>
                </div>
            </div>
        );
    }

    handleNewWord(w) {
        try {
            this.validateWord(w);
        } catch (e) {
            alert(e.message);
            return;
        }

        const solved = new Set(this.state.solved.add(w));

        const {cookies} = this.props;
        cookies.set("day" + this.state.dayNumber, Array.from(solved));
        this.setState({
            solved
        })
    }

    validateWord(w) {
        const {solved, solutions, keyLetter, letters} = this.state;

        if (w === "") {
            throw new ValidationError("no letters");
        }

        if (solved.has(w)) {
            throw new ValidationError("already found word");
        }

        if (!w.includes(keyLetter)) {
            throw new ValidationError("missing center letter");
        }

        const bad = Array.from(w).filter(l => l !== keyLetter && !letters.includes(l));
        if (bad.length > 0) {
            throw new ValidationError("other letters used");
        }

        if (!solutions.has(w)) {
            throw new ValidationError("not in word list");
        }
    }

    revealAll() {
        this.setState({
            solved: this.state.solutions
        })
    }

    goToYesterday() {
        this.processWordList(this.state.dayNumber - 1, this.state.words);
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

export default withCookies(Game);
