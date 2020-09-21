
const shuffle = (a: string[]) => {
  let j; let x; let i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

const makeid = () => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  return shuffle(possible)
    .slice(0, 5)
    .join('');
};

export default `${makeid()  }iTi${  makeid()}`;
