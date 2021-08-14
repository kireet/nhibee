import React from "react";

function ScoreBoard(props) {
    const pangrams = props["pangrams"];
    let currentScore = calculateScore(props["solved"], pangrams);
    let maxScore = calculateScore(props["solutions"], pangrams);
    let level = calculateLevel(currentScore, maxScore);

    return (
      <div>{level}</div>
    );
}

function calculateScore(words, pangrams) {
    let total = 0;
    for(const word of words) {
        if(word.length === 4) {
            total += 1;
            continue;
        }

        total += word.length;
        if(pangrams.has(word)) {
            total += 7;
        }

    }
    return total;
}

function calculateLevel(score, maxScore) {
    if(maxScore === 0) {
        return "";
    }

    if(score === maxScore) {
        return "Perfection";
    }
    const levels = [
        ["Genius", 0.8],
        ["Amazing",0.65],
        ["Great",0.5],
        ["Nice",0.4],
        ["Solid",0.3],
        ["Good",0.2],
        ["Moving Up",0.1],
        ["Good Start",0.05],
        ["Beginner",0],
    ];
    for(const level of levels) {
        const [name, pct] = level;
        if(score >= pct * maxScore) {
            return name;
        }
    }
}

export default ScoreBoard;