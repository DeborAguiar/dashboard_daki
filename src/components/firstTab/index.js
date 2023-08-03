import Papa from 'papaparse';
import axios from 'axios';
import { useEffect, useState } from 'react';
import file from "../../data/product_data.csv"
import { Bar } from 'react-chartjs-2';

function FirstTab() {

    /* (IMPRESSIONS, CLICKS) , (GMV_USD, SALES_USD), (ORDERS, DAY_OF_WEEK) */

    const [dataC, setDataC] = useState({
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
            {
                label: 'Vendas',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    })
    const [data, setData] = useState([])

    useEffect(() => {
        fetchCSVData();
    }, [data])

    async function fetchCSVData() {
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
        } finally {
            organizeData()
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
                days[reg.DAY_OF_WEEK]++
            }
        }
    }

    return (
        <div className="carousel-item active h-100">
            <div className="row row-cols-2 row-cols-lg-3 g-4 p-3">
                <div className="col">
                    <div className="p-3 charts">
                        <Bar options={{
                            title: {
                                display: true,
                                text: 'Average Rainfall per month',
                                fontSize: 40
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }} data={dataC} />
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