const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun } = require("docx");
const nodemailer = require('nodemailer');

const storage = multer.memoryStorage(); // Esto guarda los datos en memoria
const upload = multer({ storage: storage }).array('imagenHorario', 1);

const app = express();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '13200125@ue.edu.pe',
        pass: 'Jinkasama023'
    }
});

// Define el middleware al principio
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/descargas', express.static(path.join(__dirname, 'descargas')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function crearPreguntaRespuesta(textoPregunta, respuesta) {
    return new Paragraph({
        children: [
            new TextRun({ text: textoPregunta, bold: true }),
            new TextRun(`: ${respuesta}`)
        ],
    });
}

const obtenerValor = (campo, requestBody, defaultValue = 'N/A') => requestBody[campo] || defaultValue;

app.post('/procesar', upload, (req, res) => {
    try {
        console.log("Inicio de la función /procesar");
        console.log(req.body);

        let seccion = [
            crearPreguntaRespuesta("Nombre", obtenerValor('nombre', req.body)),
            crearPreguntaRespuesta("Código", obtenerValor('codigo', req.body)),
            crearPreguntaRespuesta("Lugar de nacimiento", obtenerValor('lugarNacimiento', req.body)),
            crearPreguntaRespuesta("Fecha de nacimiento", obtenerValor('fechaNacimiento', req.body)),
            crearPreguntaRespuesta("Edad", obtenerValor('edad', req.body)),
            crearPreguntaRespuesta("¿Has estudiado antes en alguna universidad o instituto?", obtenerValor('estudioPrevio', req.body)),
            crearPreguntaRespuesta("¿Cuánto tiempo?", obtenerValor('tiempoEstudio', req.body)),
            crearPreguntaRespuesta("¿Dónde?", obtenerValor('lugarEstudio', req.body)),
            crearPreguntaRespuesta("¿A qué carrera ingresaste a la Universidad ESAN?", obtenerValor('carreraIngreso', req.body)),
            crearPreguntaRespuesta("¿A qué carrera deseas cambiarte?", obtenerValor('carreraDeseada', req.body)),
            crearPreguntaRespuesta("¿Con quién vives?", obtenerValor('conQuienVives', req.body)),
            crearPreguntaRespuesta("¿Cuál es la profesión de tu padre?", obtenerValor('profesionPadre', req.body)),
            crearPreguntaRespuesta("¿Cuál es la profesión de tu madre?", obtenerValor('profesionMadre', req.body)),
            crearPreguntaRespuesta("¿Quién es la persona que más influyó en tu elección de carrera?", obtenerValor('influenciaCarrera', req.body)),
            crearPreguntaRespuesta("¿Cuáles eran tus cursos preferidos?", obtenerValor('cursosPreferidos', req.body)),
            crearPreguntaRespuesta("¿Cuáles eran los cursos que te desagradaban?", obtenerValor('cursosDesagradables', req.body)),
            crearPreguntaRespuesta("¿Cuáles eran los cursos en los que obtuviste las mejores notas?", obtenerValor('mejoresNotas', req.body)),
            crearPreguntaRespuesta("¿Cuáles eran los cursos en los que obtuviste las peores notas?", obtenerValor('peoresNotas', req.body)),
            crearPreguntaRespuesta("¿Qué cursos desaprobaste?", obtenerValor('cursosDesaprobados', req.body)),
            crearPreguntaRespuesta("¿Cuáles han sido o son tus cursos preferidos?", obtenerValor('cursosPreferidos', req.body)),
            crearPreguntaRespuesta("¿Qué cursos te desagradan?", obtenerValor('cursosDesagradables', req.body)),
            crearPreguntaRespuesta("¿En qué cursos has obtenido las mejores notas?", obtenerValor('mejoresNotas', req.body)),
            crearPreguntaRespuesta("¿En qué cursos has obtenido las peores notas?", obtenerValor('peoresNotas', req.body)),
            crearPreguntaRespuesta("¿Qué cursos has desaprobado?", obtenerValor('cursosDesaprobados', req.body)),
            crearPreguntaRespuesta("¿De qué curso o cursos te has retirado alguna vez?", obtenerValor('cursosRetirados', req.body)),
            crearPreguntaRespuesta("¿Has llevado algún curso o cursos por segunda vez (BICAS)?", obtenerValor('cursosBICAS', req.body)),
            crearPreguntaRespuesta("¿Has llevado algún curso o cursos por tercera vez (TRICAS)?", obtenerValor('cursosTRICAS', req.body)),
            crearPreguntaRespuesta("¿Has asistido a algún curso o cursos como alumno libre?", obtenerValor('cursosAlumnoLibre', req.body)),
            crearPreguntaRespuesta("¿Cuál es el motivo por el que deseas cambiarte de carrera?", obtenerValor('motivoCambioCarrera', req.body)),
            crearPreguntaRespuesta("¿Cuál es el motivo que te hace dudar de cambiarte de carrera?", obtenerValor('motivoDudaCambio', req.body)),
            crearPreguntaRespuesta("¿Qué es lo que amas hacer?", obtenerValor('amasHacer', req.body)),
            crearPreguntaRespuesta("¿Cuáles consideras que son tus talentos?", obtenerValor('talentos', req.body)),
            crearPreguntaRespuesta("¿Qué actividad te gustaría realizar o consideras que haces bien?", obtenerValor('actividadGustaria', req.body)),
            crearPreguntaRespuesta("¿Crees que esa actividad es rentable o que alguien te podría pagar por hacerla?", obtenerValor('actividadRentable', req.body)),
            crearPreguntaRespuesta("Con una visión de negocio y de acuerdo a tus habilidades ¿Qué consideras es lo que el mundo necesita?", obtenerValor('necesidadMundo', req.body))
        
        ];
        const doc = new Document({
            creator: "TuNombre",
            title: "Formulario",
            description: "Documento generado desde el servidor",
            sections: [
                {
                    children: seccion
                }
            ]
        });

        Packer.toBuffer(doc).then(buffer => {
            const filename = path.join(__dirname, 'descargas', `reporte_${Date.now()}.docx`);
            fs.writeFileSync(filename, buffer);
            
            const imagenHorario = req.files && req.files.length > 0 ? req.files[0] : null;

            const mailOptions = {
                from: 'tuCorreo@gmail.com',
                to: '13200125@ue.edu.pe',
                subject: 'Aquí va el asunto del correo',
                text: 'Aquí va el cuerpo del correo. "Adjunto encontrarás el informe generado."',
                attachments: [
                    {   // Adjunto del archivo DOCX
                        filename: path.basename(filename),
                        path: filename
                    },
                    imagenHorario ? {  // Adjunto de la imagen del horario
                        filename: imagenHorario.originalname,
                        encoding: imagenHorario.encoding,
                        mimetype: imagenHorario.mimetype,
                        content: imagenHorario.buffer
                    } : undefined
                ].filter(Boolean)
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    res.status(500).send("Error al enviar el correo.");
                } else {
                    console.log('Correo enviado:', info.response);
                    res.json({ redirectUrl: '/' });
                }
            });

        }).catch(error => {
            console.error("Error al generar el archivo DOCX:", error);
            res.status(500).send("Error al generar el archivo DOCX.");
        });

    } catch (error) {
        console.error("Error general al procesar el formulario:", error);
        res.status(500).send("Error al procesar el formulario.");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo en http://localhost:' + (process.env.PORT || 3000));
});

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send('Algo salió mal!');
});

