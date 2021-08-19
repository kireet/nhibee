import React from 'react';
import shuffle from "../utils";

class Letterpad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentWord: "",
            letters: this.props.letters.slice(0)
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        /* this is maybe not the best approach. ideally we could save a random
         * seed value and shuffle the letters in a local array in render()
         * based on the seed
         */
        if (new Set(this.state.letters) !== new Set(nextProps.letters)) {
            this.setState({
                letters: nextProps.letters
            });
        }
    }

    handleChange(event) {
        this.setState({currentWord: event.target.value.toLowerCase()});
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state.currentWord);
        this.setState({
            currentWord: ""
        });
        event.preventDefault();
    }


    render() {
        const {keyLetter} = this.props;
        const {currentWord, letters} = this.state;

        const renderedLetters = letters.join(" ");
        return (
            <div>
                <div><span
                    className="centerLetter">{keyLetter}</span>&nbsp;&nbsp;&nbsp;
                    <span>{renderedLetters}</span>
                    &nbsp;&nbsp;
                    <button onClick={() => this.shuffle()}>Shuffle</button>
                </div>
                <form onSubmit={this.handleSubmit}
                      autoComplete="off">
                    <input type="text"
                           autoComplete="off"
                           autoCapitalize="off"
                           autoCorrect="off"
                           autoFocus
                           value={currentWord}
                           onChange={this.handleChange}
                    />
                    <input className="controlButton"
                           type="submit" value="go"/>
                </form>
            </div>
        );
    }

    shuffle() {
        let letters = this.state.letters.slice(0);
        letters = shuffle(letters, 6);
        this.setState({
           letters
        });
    }
}

export default Letterpad;