#!/bin/bash

# Busca todos los archivos .md en el directorio docs/analysis
find /Users/gabrielmedinavindigni/Desktop/Dev/Pau/dir-crono-migration/crono-migration/docs/analysis -name "*.md" -type f | while read file; do
  # Reemplaza /images/analysis/ por /img/analysis/ en cada archivo
  sed -i '' 's|/images/analysis/|/img/analysis/|g' "$file"
  # Reemplaza static/images/analysis/ por /img/analysis/ en cada archivo
  sed -i '' 's|static/images/analysis/|/img/analysis/|g' "$file"
  echo "Actualizado: $file"
done

echo "Todas las rutas de imágenes han sido actualizadas."
