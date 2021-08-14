import React from 'react';

class Letterpad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentWord: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        const {keyLetter, letters} = this.props;
        const {currentWord} = this.state;

        return (
            <div>
                <div><span
                    className="centerLetter">{keyLetter}</span>&nbsp;&nbsp;&nbsp;
                    <span>{letters}</span>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text"
                           autoComplete="off"
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
}

export default Letterpad;