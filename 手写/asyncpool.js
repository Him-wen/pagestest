async function asyncPool(poolLimit, array, iteratorFn) {
    const res = [];
    const excutor = [];
    for(const item of array) {
      const p = Promise.resolve.then(()=>iteratorFn(item,array));
      res.push(p);
      if(poolLimit <= array.length) {
        const e = p.then(excutor.splice(excutor.indexOf(e),1));
        excutor.push(e);
        if(excutor.length >= poolLimit){
          await Promise.race(excutor);
        }
      }
    }
    return Promise.all(res);
  }

const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
await asyncPool(2, [1000, 5000, 3000, 2000], timeout);
