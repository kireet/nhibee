import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';
import ScoreBoard from "./ScoreBoard";
import WordBank from "./WordBank";
import Letterpad from "./Letterpad";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyLetter: '',
            letters: [],
            pangrams: new Set(),
            solutions: new Set(),
            solved: new Set(),
            userEntryState: ""
        }
    }

    componentDidMount() {
        fetch("data/good_words.json")
            .then(w => w.json())
            .then(
                words => {
                    console.log(`received ${words.length} words`);
                    this.processWordList(words);
                },
                err => {

                }
            );
    }

    processWordList(words) {
        let letterChoices = new Set();
        for (const word of words) {
            let letters = new Set(word);
            if (letters.size === 7 && !letters.has("s")) {
                letterChoices.add(letters);
            }
        }
        letterChoices = Array.from(letterChoices).sort();
        const day = this.getDayNumber();
        const letters = letterChoices[day % letterChoices.length];
        const sortedLetters = Array.from(letters).sort();
        let idx = day % 7;
        const keyLetter = sortedLetters[idx];
        sortedLetters.splice(sortedLetters.indexOf(keyLetter), 1);

        const solutions = new Set();
        const pangrams = new Set();
        for (const word of words) {
            if (word.length >= 4 &&
                word.includes(keyLetter) &&
                Array.from(word).every(l => letters.has(l))) {
                solutions.add(word);
                if (new Set(word).size === 7) {
                    pangrams.add(word);
                }
            }
        }

        this.setState({
            keyLetter,
            pangrams,
            solutions,
            letters: this.shuffle(sortedLetters, Math.max(0, idx - 1)) /* not random but consistent for dev */
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

    shuffle(array, randomIndex) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    render() {
        let {keyLetter, letters, solved, solutions, pangrams} = this.state;
        letters = letters.join(" ");
        return (
            <div className="Game">
                <ScoreBoard solved={solved} solutions={solutions} pangrams={pangrams}/>
                <Letterpad keyLetter={keyLetter}
                           letters={letters}
                           onSubmit={w => this.handleNewWord(w)}
                />
                <WordBank solved={solved}/>
                <button
                    style={{margin: "10px"}}
                    onClick={() => this.revealAll()}>Reveal</button>
            </div>
        );
    }

    handleNewWord(w) {
        try {
            this.validateWord(w);
        } catch(e) {
            alert(e.message);
            return;
        }

        this.setState({
            solved: new Set(this.state.solved.add(w))
        })
    }

    validateWord(w) {
        const {solved, solutions, keyLetter, letters} = this.state;

        if(w === "") {
            throw new ValidationError("no letters");
        }

        if(solved.has(w)) {
            throw new ValidationError("already found word");
        }

        if(!w.includes(keyLetter)) {
            throw new ValidationError("missing center letter");
        }

        const bad = Array.from(w).filter(l => l != keyLetter && !letters.includes(l));
        if(bad.length > 0) {
            throw new ValidationError("other letters used");
        }

        if(!solutions.has(w)) {
            throw new ValidationError("not in word list");
        }
    }

    revealAll() {
        this.setState({
            solved: this.state.solutions
        })
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

export default Game;
