const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Rutas de los directorios
const originDir = path.resolve(__dirname, '../crono.org-origin');
const staticDir = path.resolve(__dirname, 'static');

// Asegurarse de que exista el directorio de imágenes en static
if (!fs.existsSync(path.join(staticDir, 'img'))) {
  fs.mkdirSync(path.join(staticDir, 'img'), { recursive: true });
}

// Función para copiar archivos de imágenes
function copyImages() {
  const originImgDir = path.join(originDir, 'img');
  const targetImgDir = path.join(staticDir, 'img');
  
  if (fs.existsSync(originImgDir)) {
    console.log('Copiando imágenes de origin a static/img...');
    
    // Leer todos los archivos en el directorio de imágenes
    const files = fs.readdirSync(originImgDir);
    
    // Copiar cada archivo
    files.forEach(file => {
      const sourcePath = path.join(originImgDir, file);
      const targetPath = path.join(targetImgDir, file);
      
      // Verificar si es un archivo (no un directorio)
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copiado: ${file}`);
      }
    });
  }
}

// Iniciar observador de cambios
function watchForChanges() {
  console.log('Observando cambios en crono.org-origin...');
  
  // Observar cambios en el directorio de imágenes
  const watcher = chokidar.watch(path.join(originDir, 'img'), {
    persistent: true,
    ignoreInitial: true
  });
  
  watcher
    .on('add', path => {
      console.log(`Archivo añadido: ${path}`);
      copyImages();
    })
    .on('change', path => {
      console.log(`Archivo modificado: ${path}`);
      copyImages();
    })
    .on('unlink', path => {
      console.log(`Archivo eliminado: ${path}`);
      copyImages();
    });
}

// Ejecutar la sincronización inicial
copyImages();

// Iniciar el observador si se pasa el argumento --watch
if (process.argv.includes('--watch')) {
  watchForChanges();
}

console.log('Sincronización completada. Los archivos de crono.org-origin están listos para ser utilizados por Docusaurus.');
