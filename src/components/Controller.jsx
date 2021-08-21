import React from 'react';

function Controller(props) {

    return (
        <div>
        <div className="controlBar">
            <button className="controlButton"
                    onClick={() => props.onReveal()}>Reveal All
            </button>
            <button className="controlButton"
                    onClick={() => props.onYesterday()}>Go To Yesterday
            </button>
        </div>
            <div className="finePrint">
            Puzzle #{props.dayNumber}
            </div>
            <div className="finePrint">
                {props.pangrams.size} pangram(s)
            </div>
        </div>
    );
}

export default Controller;