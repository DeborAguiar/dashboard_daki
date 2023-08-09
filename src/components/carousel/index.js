import './carousel.scss';
import Papa from 'papaparse';
import axios from 'axios';
import product_data from "../../data/product_data.csv"
import FirstTab from '../firstTab';
import SecondTab from '../secondTab';
import { useEffect } from 'react';
import { useState } from 'react';

function Carousel() {
    const [data, setData] = useState()

    useEffect(() => {
        fetchCSVData();
    }, [])

    const fetchCSVData = async () => {
        try {
            const response = await axios.get(product_data);
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

    return (
        <div id="dash" style={{ maxHeight: "100vh" }}>
            <h3 className="pt-5">Análises</h3>
            <div id="dashboards" className="carousel slide pt-3 pt-md-4">
                <div className="carousel-inner">
                    {data && (
                        <>
                            <FirstTab csvData={data} />
                            <SecondTab ProductData={data} />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Carousel;