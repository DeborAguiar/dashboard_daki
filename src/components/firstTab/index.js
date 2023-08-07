import Papa from 'papaparse';
import axios from 'axios';
import { useEffect, useState } from 'react';
import file from "../../data/product_data.csv"
import { Bar, Doughnut, Line } from 'react-chartjs-2';

function FirstTab() {

    /* (IMPRESSIONS, CLICKS) , (GMV_USD, SALES_USD),  */

    const [data, setData] = useState([])
    const [consolidados, setConsolidados] = useState({
        "Vendas": 0,
        "Unidades Vendidas": 0,
        "Preço Médio": 0,
        "Clientes": 0,
        "Clientes Novos": 0,
    })
    const [charts, setCharts] = useState({
        /* (ORDERS, DAY_OF_WEEK) */
        weekSales: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [
                {
                    data: [],
                    backgroundColor: ['rgba(23, 89, 255, 0.2)', "rgb(255, 195, 0, 0.2)"],
                    borderColor: ['rgba(23, 89, 255)', "rgb(255, 195, 0)"],
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
                    backgroundColor: ['rgba(23, 89, 255, 0.2)', "rgb(255, 195, 0, 0.2)"],
                    borderColor: ['rgba(23, 89, 255)', "rgb(255, 195, 0)"],
                    borderWidth: 1,
                },
            ],
        },
        brandsSum: {
            labels: ['Homens', 'Mulheres'],
            fill: true,
            datasets: [
                {
                    data: [],
                    backgroundColor: ['rgba(23, 89, 255, 0.2)', "rgb(255, 195, 0, 0.2)"],
                    borderColor: ['rgba(23, 89, 255)', "rgb(255, 195, 0)"],
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
            'Mon': 0,
            'Tue': 0,
            'Wed': 0,
            'Thu': 0,
            'Fri': 0,
            'Sat': 0,
            'Sun': 0
        };

        let genderValues = [0, 0] /* [H, M] */

        let brands = {};
        [...new Set(data.map(item => item.BRAND_NAME))].forEach(brandName => {
            if (brandName)
                brands[brandName] = 0;
        });

        for (let reg of data) {
            if (reg.DAY_OF_WEEK && reg.ORDERS != '') {
                days[reg.DAY_OF_WEEK] += parseInt(reg.ORDERS)
            }
            if (reg.MALE_ORDERS && reg.MALE_ORDERS != '') {
                genderValues[0] += parseInt(reg.MALE_ORDERS)
            }
            if (reg.FEMALE_ORDERS && reg.FEMALE_ORDERS != '') {
                genderValues[1] += parseInt(reg.FEMALE_ORDERS)
            }
            if (reg.BRAND_NAME && reg.ORDERS != '') {
                brands[reg.BRAND_NAME] += parseInt(reg.ORDERS)
            }
        }

        let sortedDataObject = {};
        Object.keys(brands).sort((a, b) => brands[b] - brands[a]).forEach(key => {
            sortedDataObject[key] = brands[key];
        });
        brands = sortedDataObject

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
            genderComp: {
                ...prevCharts.genderComp,
                datasets: [
                    {
                        ...prevCharts.genderComp.datasets[0],
                        data: genderValues
                    },
                ],
            },
            brandsSum: {
                labels: Object.keys(brands),
                datasets: [
                    {
                        ...prevCharts.brandsSum.datasets[0],
                        data: Object.values(brands)
                    },
                ],
            },
        }));
    }

    return (
        <div className="carousel-item active h-100">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="tab1-tab" data-bs-toggle="tab" href="#tab1" role="tab" aria-controls="tab1" aria-selected="true">Consolidados</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="tab2-tab" data-bs-toggle="tab" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Evoluçao Semanal</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="tab3-tab" data-bs-toggle="tab" href="#tab3" role="tab" aria-controls="tab3" aria-selected="false">Week Over Week</a>
                </li>
            </ul>
            <div className="tab-content mt-3" id="myTabContent">
                <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
                    <div className="row row-cols-1 row-cols-lg-3 g-4 p-3">
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
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                        }
                                    }}
                                    data={charts.weekSales} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h5>Vendas por Gênero</h5>
                                <Doughnut data={charts.genderComp} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h5>Vendas Por Marca</h5>
                                <Line
                                    options={{
                                        scales: {
                                            x: {
                                                ticks: {
                                                    callback(value) {
                                                        let label = this.getLabelForValue(value);
                                                        return label.substring(0, 4) + "..."
                                                    },
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                        }
                                    }}
                                    data={charts.brandsSum} />
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
                    </div>
                </div>
                <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
                    <h2>Conteúdo da Aba 2</h2>
                    <p>Este é o conteúdo da Aba 2.</p>
                </div>
                <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
                    <h2>Conteúdo da Aba 3</h2>
                    <p>Este é o conteúdo da Aba 3.</p>
                </div>
            </div>
        </div>
    )
}

export default FirstTab;