import express, {Express} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import SpreadsheetRequestsSubject from "../spreadsheetObserver/SpreadsheetRequestsSubject";
class ServerExpress {

    private readonly app: Express
    constructor() {
        this.app = express();

        this.init();
    }

    private init() {

        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded());

        this.app.get('/', function(req, res) {
            res.send('<button onclick="function myFunction() {console.log(\'hui\')}">Click me</button>');
        });

        this.app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
    }

    public subscribeSpreadSheetRequestSubject(SpreadsheetSubject: SpreadsheetRequestsSubject) {
        this.app.post('/spreadSheetUpdate', (req, res) => {
            console.log(req.body);
            SpreadsheetSubject.notifyObservers(req.body.requestName, req.body)
            res.status(200).json({ message: 'It worked!' });
        });
    }
}

export default ServerExpress;