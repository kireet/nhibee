import React from 'react';
import shuffle from "../utils";
import './Letterpad.css';

class Letterpad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentWord: "",
            letters: this.props.letters.slice(0)
        }
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

    render() {
        const {keyLetter} = this.props;
        let {currentWord, letters} = this.state;
        if (currentWord == '') {
            currentWord = '\u00A0';
        }
        return (
            <div>
                <div className="upper">{currentWord}</div>
                <div className="hexGrid">
                    <div className="hexRow">
                        <div className="hex ignored">
                            <div className="left"></div>
                            <div className="middle"></div>
                            <div className="right"></div>
                        </div>
                        <div className="hex even"
                             onClick={() => this.addLetter(letters[0])}>
                            <div className="left"></div>
                            <div className="middle">{letters[0]}</div>
                            <div className="right"></div>
                        </div>
                        <div className="hex ignored">
                            <div className="left"></div>
                            <div className="middle"></div>
                            <div className="right"></div>
                        </div>
                    </div>
                    <div className="hexRow">
                        <div className="hex"
                             onClick={() => this.addLetter(letters[1])}>
                            <div className="left"></div>
                            <div className="middle">{letters[1]}</div>
                            <div className="right"></div>
                        </div>
                        <div className="hex even"
                             onClick={() => this.addLetter(keyLetter)}>
                            <div id="centerLeft" className="left"></div>
                            <div id="centerMiddle"
                                 className="middle">{keyLetter}</div>
                            <div id="centerRight" className="right"></div>
                        </div>
                        <div className="hex"
                             onClick={() => this.addLetter(letters[2])}>
                            <div className="left"></div>
                            <div className="middle">{letters[2]}</div>
                            <div className="right"></div>
                        </div>
                    </div>
                    <div className="hexRow">
                        <div className="hex"
                             onClick={() => this.addLetter(letters[3])}>
                            <div className="left"></div>
                            <div className="middle">{letters[3]}</div>
                            <div className="right"></div>
                        </div>
                        <div className="hex even"
                             onClick={() => this.addLetter(letters[4])}>
                            <div className="left"></div>
                            <div className="middle">{letters[4]}</div>
                            <div className="right"></div>
                        </div>
                        <div className="hex"
                             onClick={() => this.addLetter(letters[5])}>
                            <div className="left"></div>
                            <div className="middle">{letters[5]}</div>
                            <div className="right"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="buttonBar">
                        <div className="button"
                             onClick={() => this.handleClear()}>clear</div>
                        <div className="roundButton"
                              onClick={() => this.shuffle()}>
                            <img id="shuffleImage"
                                 src="images/rotate.png"/>
                        </div>
                        <div className="button"
                             onClick={() => this.handleSubmit()}>enter</div>
                    </div>
                </div>
            </div>
        );
    }

    addLetter(letter) {
        this.setState({currentWord: this.state.currentWord + letter});
    }

    handleSubmit() {
        this.props.onSubmit(this.state.currentWord);
        this.handleClear();
    }

    shuffle() {
        let letters = this.state.letters.slice(0);
        letters = shuffle(letters);
        this.setState({
            letters
        });
    }

    handleClear() {
        this.setState({
            currentWord: ""
        });
    }
}

export default Letterpad;