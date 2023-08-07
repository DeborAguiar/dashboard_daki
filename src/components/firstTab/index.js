import Papa from 'papaparse';
import axios from 'axios';
import { useEffect, useState } from 'react';
import file from "../../data/product_data.csv"
import { Bar } from 'react-chartjs-2';

function FirstTab() {

    /* (IMPRESSIONS, CLICKS) , (GMV_USD, SALES_USD),  */

    const [data, setData] = useState([])
    const [charts, setCharts] = useState({
        /* (ORDERS, DAY_OF_WEEK) */
        weekSales: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [
                {
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        },
        /* MALE_ORDERS,FEMALE_ORDERS */
        genderComp: {
            labels: ['Homens', 'Mulheres'],
            datasets: [
                {
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        }
    })

    useEffect(() => {
        fetchCSVData();
    }, [])

    useEffect(() => {
        organizeData();
    }, [data]);

    const fetchCSVData = async () => {
        try {
            const response = await axios.get(file);
            const csvData = response.data;
            Papa.parse(csvData, {
                complete: (result) => {
                    setData(result.data);
                },
                header: true
            });
        } catch (error) {
            console.error('Erro ao buscar o arquivo CSV:', error);
        }
    };

    function organizeData() {
        let days = {
            'Mon': 1,
            'Tue': 1,
            'Wed': 1,
            'Thu': 1,
            'Fri': 1,
            'Sat': 1,
            'Sun': 1
        };
        for (let reg of data) {
            if (days[reg.DAY_OF_WEEK]) {
                days[reg.DAY_OF_WEEK] += parseInt(reg.ORDERS) || 0
            }
        }

        setCharts((prevCharts) => ({
            ...prevCharts,
            weekSales: {
                ...prevCharts.weekSales,
                datasets: [
                    {
                        ...prevCharts.weekSales.datasets[0],
                        data: Object.values(days)
                    },
                ],
            },
        }));
    }

    return (
        <div className="carousel-item active h-100">
            <div className="row row-cols-1 row-cols-lg-3 g-4 p-3">
                <div className="col">
                    <div className="p-3 charts">
                        <h5>Vendas x Dia da Semana</h5>
                        <Bar
                            options={{
                                scales: {
                                    y: {
                                        min: 1000,
                                        max: 6000,
                                    },
                                },
                                plugins:{
                                    legend: {
                                        display: false
                                    },
                                }
                            }}
                            data={charts.weekSales} />
                    </div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
                <div className="col">
                    <div className="p-3 charts">Row column</div>
                </div>
            </div>
        </div>
    )
}

export default FirstTab;