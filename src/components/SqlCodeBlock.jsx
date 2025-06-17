import React, { useState, useEffect, useRef } from 'react';
import styles from './SqlCodeBlock.module.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';

export default function SqlCodeBlock({ sqlData, jsonPath }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(sqlData || null);
  const modalRef = useRef(null);

  // Cargar datos desde el archivo JSON si se proporciona una ruta
  useEffect(() => {
    if (jsonPath && !sqlData) {
      setLoading(true);
      fetch(jsonPath)
        .then(response => response.json())
        .then(jsonData => {
          setData(jsonData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error cargando datos SQL:', error);
          setLoading(false);
        });
    }
  }, [jsonPath, sqlData]);

  // Aplicar resaltado de sintaxis cuando se carga el componente o cambian los datos
  useEffect(() => {
    if (data) {
      Prism.highlightAll();
    }
  }, [data, isModalOpen]);

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  if (loading) {
    return <div className={styles.loading}>Cargando código SQL...</div>;
  }

  if (!data || (!data.cronoSQL && !data.compiladoSQL)) {
    return <div className={styles.error}>No hay datos SQL disponibles</div>;
  }

  const openModal = () => {
    setIsModalOpen(true);
    // Aplicar resaltado de sintaxis después de que se abra el modal
    setTimeout(() => Prism.highlightAll(), 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.sqlContainer}>
      {/* Bloque de código SQL original con resaltado de sintaxis */}
      <div className={styles.codeBlock}>
        <pre className={`${styles.pre} language-sql`}>
          <code className="language-sql">{data.cronoSQL}</code>
        </pre>
      </div>
      
      {/* Botón para ver SQL compilado */}
      <div className={styles.buttonContainer}>
        <button 
          onClick={openModal} 
          className={styles.viewButton}
          aria-label="Ver SQL compilado"
        >
          Ver SQL compilado
        </button>
      </div>

      {/* Modal para mostrar SQL compilado */}
      {isModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h2>Ver SQL compilado</h2>
              <button 
                onClick={closeModal}
                className={styles.closeButton}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <pre className={`${styles.pre} language-sql`}>
                <code className="language-sql">{data.compiladoSQL}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
