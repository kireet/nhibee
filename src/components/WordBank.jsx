function WordBank(props) {
    let words = Array.from(props["solved"]).sort((a,b) => {
        if(a.length === b.length) {
            return a > b ? 1 : -1;
        }
        return a.length - b.length;
    });
    words = words.map((word, idx) => {
        if(new Set(word).size === 7) {
            return <div key={idx}><b>{word}</b></div>
        } else {
            return <div key={idx}>{word}</div>
        }
    });
    return (
        <div>
            {words}
        </div>
    );
}

export default WordBank;