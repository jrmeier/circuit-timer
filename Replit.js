// replit code challenge

const isValid = (original, edited, ops) => {
    const operations = JSON.parse(ops);

    // just do the first operation for now
    if (!operations.length) return false;

    let curentIndex = 0;
    for (const op of operations) {
        if (op.op === 'skip') {
            curentIndex += op.count;
        } else if (op.op === 'delete') {
            original = original.slice(0, curentIndex) + original.slice(curentIndex + op.count);
            curentIndex = curentIndex+op.count;
        } else if (op.op === 'insert') {
            original = original.slice(0, curentIndex) + op.chars + original.slice(curentIndex);
        }
        console.log({ original, edited, curentIndex});
    }
    return original === edited;
}
const res4 = isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'We use operational transformations to keep everyone in a multiplayer repl in sync.',
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
  ); // true

// res4
// const res1 = isValid(
//     'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
//     'Repl.it uses operational transformations.',
//     '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
//   ); // true
// res1
//  const res2 = isValid(
//     'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
//     'Repl.it uses operational transformations.',
//     '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
//   ); // false, delete past end
// res2
// const res3 = isValid(
//     'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
//     'Repl.it uses operational transformations.',
//     '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
//   ); // false, skip past end
// res3  
    
//   isValid(
//     'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
//     'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
//     '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
//   ); // false
  
//   isValid(
//     'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
//     'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
//     '[]'
//   ); // true