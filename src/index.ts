import Main from './Main'

new Main().init()
        .then(() => console.log('Successful APPLICATION start'))
        .catch((err) => console.log(err));

