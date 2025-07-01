import React, { useEffect, useRef } from 'react';
//import {DxComponentType} from '../../static/dx.enum';


const DxComponentType = Object.freeze({
    DX_CHART: 'dxChart',
    DX_PIE_CHART: 'dxPieChart',
    DX_DATA_GRID: 'dxDataGrid',
    DX_CIRCULAR_GAUGE: 'dxCircularGauge'
});


function Display({ type, id, data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const initChart = () => {
            if (typeof window !== 'undefined' && window.DevExpress) {
                try {
                    if (chartInstance.current) {
                        chartInstance.current.dispose();
                        chartInstance.current = null;
                    }
                    if (chartRef.current) {
                        loadRealData();
                    }
                } catch (err) {
                    console.error('Error al crear el gráfico:', err);
                }
            } else {
                setTimeout(initChart, 500);
            }
        };

        const loadRealData = async () => {
            if (typeof data === 'string' && data.endsWith('.json')) {
                try {
                    const response = await fetch(`/json_data/${data}`);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const jsonData = await response.json();

                    if (type == DxComponentType.DX_DATA_GRID) {
                        chartInstance.current = new window.DevExpress.ui.dxDataGrid(chartRef.current, jsonData);
                    } else if (type == DxComponentType.DX_CIRCULAR_GAUGE) {
                        chartInstance.current = new window.DevExpress.viz.dxCircularGauge(chartRef.current, jsonData);
                    } else if (type == DxComponentType.DX_PIE_CHART) {
                        chartInstance.current = new window.DevExpress.viz.dxPieChart(chartRef.current, jsonData);
                    } else if (type == DxComponentType.DX_CHART) {
                        chartInstance.current = new window.DevExpress.viz.dxChart(chartRef.current, jsonData);
                    } else {
                        console.error('Tipo de gráfico no soportado:', type);
                    }

                } catch (error) {
                    console.error('Error al cargar datos JSON:', error);
                }
            }
        };

        initChart();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, [data, type, id]);

    return (
        <div>
            <div>
                {type === DxComponentType.DX_DATA_GRID ? (
                    <div ref={chartRef} id={id} style={{ display: 'inline-block', height: 'auto' }}></div>
                ) : (
                    <div ref={chartRef} id={id} style={{ width: '100%', height: '400px' }}></div>
                )}
            </div>
        </div>
    );
}

export default Display;
