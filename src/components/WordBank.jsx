function WordBank(props) {
    let words = Array.from(props["solved"]).sort((a,b) => {
        if(a.length === b.length) {
            return a > b ? 1 : -1;
        }
        return a.length - b.length;
    });
    words = words.map((word, idx) => {
        return <span key={idx}>{word}&nbsp;</span>
    });
    return (
        <div>
            {words}
        </div>
    );
}

export default WordBank;