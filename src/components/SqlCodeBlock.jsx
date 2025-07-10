import React, { useState, useEffect, useRef } from 'react';
import styles from './SqlCodeBlock.module.css';
import CodeBlock from '@theme/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function SqlCodeBlock({ sqlData, jsonPath }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(sqlData || null);
  const modalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (jsonPath && !sqlData) {
      setLoading(true);
      fetch(jsonPath)
        .then(response => response.json())
        .then(jsonData => {
          if (isMounted) {
            setData(jsonData);
            setLoading(false);
          }
        })
        .catch(error => {
          if (isMounted) {
            console.error('Error cargando datos SQL:', error);
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [jsonPath, sqlData]);

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <div className={styles.loading}>Cargando código SQL...</div>;
  }

  if (!data || (!data.cronoSQL && !data.compiladoSQL)) {
    return <div className={styles.error}>No hay datos SQL disponibles</div>;
  }

  return (
    <BrowserOnly fallback={<div>Cargando ejemplo SQL...</div>}>
      {() => (
        <div className={styles.sqlContainer} style={{display: 'flex', flexDirection: 'column'}}>
          <div className={styles.codeBlock} style={{marginBottom: 0, paddingBottom: 0}}>
            <CodeBlock language="sql" style={{marginBottom: 0, paddingBottom: 0}}>{data.cronoSQL}</CodeBlock>
          </div>
          <div className={styles.buttonContainer} style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={openModal} 
              className={styles.viewButton}
              aria-label="Ver SQL compilado"
            >
              Ver SQL compilado
            </button>
          </div>

          {isModalOpen && (
            <div className={styles.modalOverlay} role="dialog" aria-modal="true">
              <div className={styles.modal} ref={modalRef}>
                <div className={styles.modalHeader}>
                  <h2>Ver SQL compilado</h2>
                  <button 
                    onClick={closeModal}
                    className={styles.closeButton}
                    aria-label="Cerrar modal"
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <CodeBlock language="sql" style={{marginBottom: 0}}>{data.compiladoSQL}</CodeBlock>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </BrowserOnly>
  );
}
