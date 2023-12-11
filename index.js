const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3001;
const socketIo = require('socket.io')

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
    }
});
const upload = multer({ storage: storage });


app.post("/subir", upload.single('archivo'), async (req, res) => {
    const data = req.body;
    console.log("Datos recibidos:", data);


    if (!data.facultad || !data.escuela) {
        res.status(400).send("Faltan datos");
        return;
    }

 
    if (!req.file) {
        res.status(400).send("No se ha seleccionado ningún archivo");
        return;
    }


    const file = req.file;
    const fileName = file.filename;
    const path = `/uploads/${fileName}`;

    // Agregar logica para agregar la url de archivo a la base de datos........


    res.status(200).send("Archivo subido exitosamente");
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
