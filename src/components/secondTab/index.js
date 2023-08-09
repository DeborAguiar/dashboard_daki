import { useEffect, useState } from "react";
import { ResponsiveHeatMap } from '@nivo/heatmap'
import Papa from 'papaparse';
import axios from 'axios';
import categoryDataCSV from "../../data/category_data.csv";
import { Pie, Radar } from 'react-chartjs-2';

function SecondTab({ ProductData }) {

    const [mktShareTotal, setMktShareTotal] = useState();
    const [categoryData, setCategoryData] = useState();
    const [mktShareWeek, setMktShareWeek] = useState();
    const [heatmap, setHeatmap] = useState();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fetchCSVData();
    }, [])

    useEffect(() => {
        buildMktShare();
    }, [categoryData]);

    useEffect(() => {
        buildHeatmap();
    }, [ProductData]);

    useEffect(() => {
        if (
            categoryData &&
            heatmap[0] &&
            mktShareWeek[1] &&
            mktShareWeek[1] / mktShareWeek[1] == 1) {
            setReady(true)
        }
    }, [heatmap, categoryData, mktShareTotal, mktShareWeek])

    const fetchCSVData = async () => {
        try {
            const response = await axios.get(categoryDataCSV);
            const csvData = response.data;
            Papa.parse(csvData, {
                complete: (result) => {
                    setCategoryData(result.data);
                },
                header: true
            });
        } catch (error) {
            console.error('Erro ao buscar o arquivo CSV:', error);
        }
    };

    function getWeekNumber(date) {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - onejan) / 86400000);
        return Math.ceil((days + onejan.getDay() + 1) / 7);
    }

    function buildHeatmap() {
        let hm = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
            return {
                id: day,
                data: [
                    {
                        x: "Morning",
                        y: 0
                    },
                    {
                        x: "Evening",
                        y: 0
                    },
                    {
                        x: "Nigth",
                        y: 0
                    }
                ]
            }
        });

        for (let d of ProductData) {
            if (d.DAY_OF_WEEK != undefined) {
                let idx = hm.findIndex(item => item.id === d.DAY_OF_WEEK)
                if (d.MORNING_ORDERS != undefined && d.MORNING_ORDERS != '') {
                    hm[idx].data[0].y += parseInt(d.MORNING_ORDERS)
                }
                if (d.AFTERNOON_ORDERS != undefined && d.AFTERNOON_ORDERS != '') {
                    hm[idx].data[1].y += parseInt(d.AFTERNOON_ORDERS)
                }
                if (d.NIGHT_ORDERS != undefined && d.NIGHT_ORDERS != '') {
                    hm[idx].data[2].y += parseInt(d.NIGHT_ORDERS)
                }
            }
        }

        setHeatmap(hm);
    }

    function buildMktShare() {
        // #region Total da Categoria
        // Calcula as vendas totais da empresa para cada categoria
        let companySales = 0;

        ProductData?.forEach(product => {
            companySales += product.SALES_USD ? parseFloat(product.SALES_USD) : 0;
        });

        // Calcula as vendas totais da categoria
        const totalSales = categoryData?.reduce((total, category) => {
            const categorySales = category.SALES_USD ? parseFloat(category.SALES_USD) : 0; // Substitua pela métrica correta
            return total + categorySales;
        }, 0);

        // Calcula o market share da empresa para cada categoria
        const marketShares = (companySales / totalSales * 100).toFixed(2);

        setMktShareTotal(marketShares);
        // #endregion

        // #region Vendas Semanais
        const weeklySales = {}; // Armazena as vendas semanais por categoria

        // Calcula as vendas totais semanais da empresa para cada categoria
        ProductData?.forEach(product => {
            if (product.DATE) {
                const week = getWeekNumber(new Date(product.DATE));
                const categorySales = product.SALES_USD ? parseFloat(product.SALES_USD) : 0;

                if (!weeklySales[week]) {
                    weeklySales[week] = 0;
                }

                weeklySales[week] += categorySales;
            }
        });

        // Calcula as vendas totais semanais da categoria
        const weeklyTotalSales = {};
        categoryData?.forEach(category => {
            const week = getWeekNumber(new Date(category.DATE)); // Use a mesma função para categoryData
            const categorySales = category.SALES_USD ? parseFloat(category.SALES_USD) : 0;

            if (!weeklyTotalSales[week]) {
                weeklyTotalSales[week] = 0;
            }

            weeklyTotalSales[week] += categorySales;
        });

        // Calcula o market share semanal da empresa para cada categoria
        const weeklyMarketShares = {};
        for (const week in weeklySales) {
            const companySales = weeklySales[week];
            const totalSales = weeklyTotalSales[week] || 1; // Evita divisão por zero

            weeklyMarketShares[week] = ((companySales / totalSales) * 100).toFixed(2);
        }

        // Atualiza o state com os market shares semanais
        setMktShareWeek(weeklyMarketShares);
        // #endregion
    }


    return (
        <div className="carousel-item active text-center">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="tab4-tab" data-bs-toggle="tab" href="#tab4" role="tab" aria-controls="tab4" aria-selected="true">Heatmap</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="tab5-tab" data-bs-toggle="tab" href="#tab5" role="tab" aria-controls="tab5" aria-selected="false">Market Share</a>
                </li>
            </ul>
            <div className="tab-content mt-3 p-3 text-center">
                <div className="tab-pane fade show active " id="tab4" role="tabpanel" aria-labelledby="tab4-tab">
                    <div className="p-3 charts">
                        <div className="row p-3">
                            <div className="col" style={{ height: "60vh" }}>
                                <ResponsiveHeatMap
                                    data={heatmap}
                                    margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                                    valueFormat=">-.2s"
                                    axisRight={{}}
                                    colors={{
                                        type: 'diverging',
                                        scheme: 'yellow_green_blue',
                                        divergeAt: 0.5,
                                        minValue: 0,
                                        maxValue: 700
                                    }}
                                    labelTextColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'brighter',
                                                '3'
                                            ]
                                        ]
                                    }}
                                    legends={[
                                        {
                                            anchor: 'bottom',
                                            translateX: 0,
                                            translateY: 30,
                                            length: 400,
                                            thickness: 8,
                                            direction: 'row',
                                            tickPosition: 'after',
                                            tickSize: 4,
                                            tickSpacing: 4,
                                            tickOverlap: false,
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-tab">
                    <div className="p-3 charts">
                        {!ready && <div className='row align-items-center' style={{ height: "60vh" }}>
                            <div className='col px-3 order-0' >
                                <div class="spinner-grow text-light" role="status" style={{ height: "50vh", width: "50vh" }}>
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            <div className='col px-3 order-0' >
                                <div class="spinner-grow text-light" role="status" style={{ height: "50vh", width: "50vh" }}>
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>}
                        {ready && <div className='row row-cols-1 row-cols-md-2 align-items-center'>
                            <div className='col-md-6 px-3 order-0' style={{ maxHeight: "60vh" }}>
                                <Pie
                                    data={{
                                        labels: ['Empresa', 'Outros'],
                                        datasets: [
                                            {
                                                data: [mktShareTotal, 100 - mktShareTotal],
                                                backgroundColor: ['#36A2EB', '#FFCE56'],
                                                hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
                                            },
                                        ],
                                    }}
                                />
                            </div>
                            <div className='col-md-6 px-3 order-1' style={{ maxHeight: "60vh" }}>
                                <Radar
                                    data={{
                                        labels: Object.keys(mktShareWeek),
                                        datasets: [
                                            {
                                                data: Object.values(mktShareWeek),
                                                backgroundColor: '#FFCE56',
                                                hoverBackgroundColor: '#FFCE56',
                                                tension: 0.4
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                        }
                                    }}
                                />
                            </div>
                        </div>}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SecondTab;
