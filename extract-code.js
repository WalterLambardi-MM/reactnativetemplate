const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Configuración
const ROOT_DIR = path.resolve(__dirname, 'src'); // Ruta a la carpeta 'src'
const OUTPUT_FILE = path.resolve(__dirname, 'project-code.txt'); // Archivo de salida
const INCLUDE_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.css',
  '.scss',
]; // Extensiones a incluir

// Función para obtener todos los archivos recursivamente
async function getAllFiles(dir) {
  const files = [];

  // Lee el contenido del directorio
  const entries = await readdir(dir, { withFileTypes: true });

  // Procesa cada entrada
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Si es un directorio, recursivamente obtén sus archivos
      const subFiles = await getAllFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      // Si es un archivo con extensión permitida, agrégalo a la lista
      const ext = path.extname(entry.name).toLowerCase();
      if (INCLUDE_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// Función principal
async function extractCode() {
  try {
    console.log('Iniciando extracción de código...');

    // Obtener todos los archivos
    const files = await getAllFiles(ROOT_DIR);
    console.log(`Se encontraron ${files.length} archivos para procesar.`);

    // Contenido del archivo de salida
    let outputContent = '';

    // Procesar cada archivo
    for (const filePath of files) {
      try {
        // Leer el contenido del archivo
        const content = await readFile(filePath, 'utf8');

        // Calcular la ruta relativa desde la carpeta src
        const relativePath = path.relative(ROOT_DIR, filePath);

        // Agregar al contenido de salida
        outputContent += `// Relative Path: ${relativePath}\n\n`;
        outputContent += content;
        outputContent +=
          '\n\n// -----------------------------------------------\n\n';

        console.log(`Procesado: ${relativePath}`);
      } catch (fileError) {
        console.error(`Error al procesar el archivo ${filePath}:`, fileError);
      }
    }

    // Escribir el contenido al archivo de salida
    await writeFile(OUTPUT_FILE, outputContent);

    console.log(
      `¡Proceso completado! El código ha sido guardado en: ${OUTPUT_FILE}`,
    );
  } catch (error) {
    console.error('Error durante la extracción:', error);
  }
}

// Ejecutar la función principal
extractCode();
