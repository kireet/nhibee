function shuffle(a) {
    const chance = require('chance').Chance(6278);
    a = [...a];
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(chance.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export default shuffle;