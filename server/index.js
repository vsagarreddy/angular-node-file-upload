const express = require('express')
const request = require('request');
const multer = require('multer');
const path = require('path');
const FS = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();
const port = 8009;

const DIR = './uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/api', function (req, res) {
    res.end('file catcher example');
});

app.post('/api/upload', upload.single('file'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('######################################### FILE', req.file);
        const args = {
            method: 'POST',
            url: `https://10.76.155.239/api/v1/projects/4334/testcases/131142/attachments`,
            headers: {
                "X-TM2-API-KEY": `ac05dfe4147704b1875d3b84d2693b8a5e2bb49e14`,
            },
            formData: {
                'file': {
                    'value': FS.createReadStream(`${DIR}/${req.file.filename}`),
                    'options': {
                        'filename': `${DIR}/${req.file.originalname}`,
                        'contentType': null
                    }
                }
            }
        };

        console.log('file received',);
        request(args, (error, response) => {
            console.log('Response ===================', response.body);
            console.log('error ===================', error);
            try {
                FS.unlinkSync(`${DIR}/${req.file.filename}`)
            } catch (err) {
                console.error(err)
            }
            if (error) {
                return res.status(error.code).json(error);
            }
            res.status(200).json(response.body);
        });
        
        // return res.send({
        //     success: true
        // })
    }
});

// app.get('/', (req, res) => {
//     const testCase = {
//         "title": "TestCaseFromSmipleNodeApi",
//         "state_id": 2,
//         "status_id": 6,
//         "priority_id": 1,
//         "priority": "Low",
//         "identifier": "add",
//         "project_id": 10606
//     };
//     const args = {
//         url: `https://cxtm.cisco.com/api/v1/testcases`,
//         json: true,
//         body: testCase,
//         headers: {
//             "Content-Type": "application/json",
//             // 'X-TM2-API-KEY': '7af084b249699dc5d3687078c59e9d8c59db28ed71',
//         },
//     };
//     request.post(args,
//     (error, response, body) => {
//         console.log(body);
//         res.send('Hello World!');
//     });
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});