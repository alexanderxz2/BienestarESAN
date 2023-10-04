const fs = require("fs");
const { Document, Packer, Paragraph, TextRun } = require("docx");

const doc = new Document({
    sections: [
        {
            children: [
                new Paragraph({
                    children: [new TextRun("Hello, World!")],
                }),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("HelloWorld.docx", buffer);
    console.log("Documento creado exitosamente");
}).catch(err => {
    console.error("Error al crear documento:", err);
});
