require('dotenv').config({
    path: 'config/dev.env',
});

const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');

app.use(cors());

app.use('/images/', express.static('./public/content/images')); //current dir is root
app.get('/', (req, res) => {
    res.send('Hello');
});

var storage = multer.diskStorage({
    destination: './public/content/images',
    filename: function (req, file, cb) {
        //req.body is empty...
        //How could I get the new_file_name property sent from client here?
        cb(null, file.filename + '-' + Date.now() + '.png');
    },
});

const upload = multer({
    storage,
});

app.post(
    '/api/image',
    upload.single('image'),
    async (req, res, next) => {
        console.log(req.file);
        console.log(req.body.image);

        res.json({
            url: process.env.HOST_NAME + '/images/' + req.file.filename,
        });
    },
    (err, req, res, next) => {
        console.log(err);
        res.sendStatus(500);
    }
);

// app.post('/api/image', async (req,res)=>{
//     console.log(req)
//     // console.log(req.body.image)

//     res.json({
//         url: ''
//     })
// },(err,req,res,next)=>{
//     console.log(err);
//     res.sendStatus(400)
// });

app.listen(8080, () => {
    console.log('Running on port 8080');
});
