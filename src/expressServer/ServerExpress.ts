import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
class ServerExpress {
    constructor() {
        this.init();
    }

    private init() {
        const app = express();

        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded())

        app.get('/', function(req, res) {
            res.send('<button onclick="function myFunction() {console.log(\'hui\')}">Click me</button>');
        });

        app.post('/', (req, res) => {
            // perform operation and return response.
            // console.log(req)
            console.log(req.body);
            console.log(req.params)
            res.status(200).json({ message: 'It worked!' });
            console.log('hello boy');
        });
// start the server listening for requests
        app.listen(process.env.PORT || 3000,
            () => console.log('Server is running...'));
    }
}

export default ServerExpress;