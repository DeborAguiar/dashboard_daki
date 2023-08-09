import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

function FirstTab({csvData}) {

    const [data, setData] = useState(csvData)
    const [consolidados, setConsolidados] = useState()
    const [weekEvolutionSelects, setWESelects] = useState({
        'Mon': {},
        'Tue': {},
        'Wed': {},
        'Thu': {},
        'Fri': {},
        'Sat': {},
        'Sun': {}
    })
    const [charts, setCharts] = useState({
        weekEv: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [
                {
                    data: [],
                    backgroundColor: ["rgb(255, 195, 0, 0.2)"],
                    borderColor: ["rgb(255, 195, 0)"],
                    borderWidth: 1,
                    tension: 0.4
                },
                {
                    data: [],
                    backgroundColor: ['rgba(23, 89, 255, 0.2)'],
                    borderColor: ['rgba(23, 89, 255)'],
                    borderWidth: 1,
                    tension: 0.4
                },
            ],
        },
        wOw: {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: ["rgb(255, 195, 0, 0.2)"],
                    borderColor: ["rgb(255, 195, 0)"],
                    borderWidth: 1,
                    tension: 0.4
                },
            ],
        }
    })
    const [weeksObject, setWeeksObject] = useState({})
    const [selectsOpt, setSelectsOp] = useState({
        weekEv: [`SALES_USD`, `QUANTITY_SOLD`],
        wOw: 'CLICKS'
    })
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (data != undefined) {
            buildConsolidados();
            buildSemanalEv();
        }
    }, [data]);

    useEffect(()=>{
        if(consolidados){
            setReady(true)
        }
    }, [consolidados])

    useEffect(() => {
        if (data != undefined) {
            changeSelect('SALES_USD', 0);
            changeSelect('QUANTITY_SOLD', 1);
            buildWeeksObject();
        }
    }, [weekEvolutionSelects])

    useEffect(() => {
        if (data != undefined) {
            chooseWow('SALES_LC');
        }
    }, [weeksObject])

    function buildConsolidados() {
        let c = {
            SALES_USD: 0,
            QUANTITY_SOLD: 0,
            GMV_LC: 0,
            CUSTOMERS: 0,
            NEW_CUSTOMERS: 0
        };
        if (data[0]) {
            data.forEach(d => {
                if (!isNaN(d?.SALES_USD) && d?.SALES_USD !== '')
                    c.SALES_USD += parseFloat(d?.SALES_USD)
                if (!isNaN(d?.QUANTITY_SOLD) && d?.QUANTITY_SOLD !== '')
                    c.QUANTITY_SOLD += parseFloat(d?.QUANTITY_SOLD)
                if (!isNaN(d?.GMV_LC) && d?.GMV_LC !== '')
                    c.GMV_LC += parseFloat(d?.GMV_LC)
                if (!isNaN(d?.CUSTOMERS) && d?.CUSTOMERS !== '')
                    c.CUSTOMERS += parseFloat(d?.CUSTOMERS)
                if (!isNaN(d?.NEW_CUSTOMERS) && d?.NEW_CUSTOMERS !== '')
                    c.NEW_CUSTOMERS += parseFloat(d?.NEW_CUSTOMERS)
            });
        }
        setConsolidados(c)
    }

    function buildSemanalEv() {
        let days = {
            'Mon': {},
            'Tue': {},
            'Wed': {},
            'Thu': {},
            'Fri': {},
            'Sat': {},
            'Sun': {}
        };

        if (data[0]) {
            data.forEach(d => {
                Object.entries(d).forEach(([key, value]) => {
                    if (!isNaN(value) && value !== '') {
                        days[d.DAY_OF_WEEK][key] = (days[d.DAY_OF_WEEK][key] || 0) + parseFloat(value);
                    }
                });
            });
        }

        setWESelects(days)
    }

    function changeSelect(event, id) {
        const newValue = event.target ? event.target.value : event;
        let graphData = Array.from(charts.weekEv.datasets);
        graphData[id].data = []
        for (let value of Object.values(weekEvolutionSelects)) {
            graphData[id]?.data.push(value[newValue])
        }

        setSelectsOp((prevSelectValues) => ({
            ...prevSelectValues,
            weekEv: id == 0
                ? [
                    newValue,
                    prevSelectValues.weekEv[1]
                ]
                : [
                    prevSelectValues.weekEv[0],
                    newValue
                ]
        }));
        setCharts((prevCharts) => ({
            ...prevCharts,
            weekEv: {
                ...prevCharts.weekEv,
                datasets: graphData
            },
        }));
    };

    function buildWeeksObject() {
        let weeksObj = {};
        data.forEach(d => {
            if (d.DATE != undefined) {
                const date = new Date(d.DATE);
                const weekNumber = getWeekNumber(date);
                if (!weeksObj[weekNumber]) {
                    weeksObj[weekNumber] = {};
                }
                Object.entries(d).forEach(([key, value]) => {
                    if (!isNaN(value) && value !== '') {
                        weeksObj[weekNumber][key] = (weeksObj[weekNumber][key] || 0) + parseFloat(value);
                    }
                });
            }
        });
        setWeeksObject(weeksObj)
    }

    function getWeekNumber(date) {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - onejan) / 86400000);
        return Math.ceil((days + onejan.getDay() + 1) / 7);
    }

    function chooseWow(event) {
        const newValue = event.target ? event.target.value : event;
        setSelectsOp((prevSelectValues) => ({
            ...prevSelectValues,
            wOw: newValue
        }));
        setCharts((prevCharts) => ({
            ...prevCharts,
            wOw: {
                ...prevCharts.wOw,
                labels: Object.keys(weeksObject),
                datasets: [
                    {
                        ...prevCharts.wOw.datasets[0],
                        data: Object.values(weeksObject).map(v => v[newValue])
                    },
                ]
            },
        }));
    }

    return (
        <div className="carousel-item  active">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="tab1-tab" data-bs-toggle="tab" href="#tab1" role="tab" aria-controls="tab1" aria-selected="true">Consolidados</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="tab2-tab" data-bs-toggle="tab" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Evolução Semanal</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="tab3-tab" data-bs-toggle="tab" href="#tab3" role="tab" aria-controls="tab3" aria-selected="false">Week Over Week</a>
                </li>
            </ul>
            <div className="tab-content mt-3 p-3 text-center">
                {!ready && <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
                    <div className="row mb-4 row-cols-1 row-cols-lg-3 g-4 ">
                        <div className="col">
                            <div className="p-3 charts">
                                <h4 class="card-title placeholder-wave">
                                    <span class="placeholder col-6 bg-secondary"></span>
                                </h4>
                                <h2 class="card-title placeholder-wave">
                                    <span class="placeholder col-3 bg-secondary "></span>
                                </h2>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h4 class="card-title placeholder-wave">
                                    <span class="placeholder col-6 bg-secondary "></span>
                                </h4>
                                <h2 class="card-title placeholder-wave">
                                    <span class="placeholder col-3 bg-secondary "></span>
                                </h2>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h4 class="card-title placeholder-wave">
                                    <span class="placeholder col-6 bg-secondary "></span>
                                </h4>
                                <h2 class="card-title placeholder-wave">
                                    <span class="placeholder col-3 bg-secondary "></span>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4 row-cols-1 row-cols-lg-2 g-4">
                        <div className="col">
                            <div className="p-3 charts">
                                <h4 class="card-title placeholder-wave">
                                    <span class="placeholder col-6 bg-secondary "></span>
                                </h4>
                                <h2 class="card-title placeholder-wave">
                                    <span class="placeholder col-3 bg-secondary "></span>
                                </h2>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h4 class="card-title placeholder-wave">
                                    <span class="placeholder col-6 bg-secondary "></span>
                                </h4>
                                <h2 class="card-title placeholder-wave">
                                    <span class="placeholder col-3 bg-secondary "></span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>}
                {ready && <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
                    <div className="row mb-4 row-cols-1 row-cols-lg-3 g-4 ">
                        <div className="col">
                            <div className="p-3 charts">
                                <h4>Vendas</h4>
                                <h2>
                                    {(() => '$ ' + (consolidados?.SALES_USD / 1000).toFixed(1) + 'K')()}
                                </h2>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h4>Quantidade Vendida</h4>
                                <h2>
                                    {(() => (consolidados?.QUANTITY_SOLD / 1000).toFixed(1) + 'K')()}
                                </h2>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h4>Preço Médio</h4>
                                <h2>
                                    {(() => '$ ' + ((consolidados.GMV_LC / consolidados.QUANTITY_SOLD)).toFixed(1))()}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4 row-cols-1 row-cols-lg-2 g-4">
                        <div className="col">
                            <div className="p-3 charts">
                                <h4>Clientes</h4>
                                <h2>
                                    {(() => (consolidados.CUSTOMERS?.toLocaleString()))()}
                                </h2>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 charts">
                                <h4>Clientes Novos</h4>
                                <h2>
                                    {(() => (consolidados.NEW_CUSTOMERS?.toLocaleString()))()}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>}
                <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
                    <div className="p-3 charts">
                        <div className='row row-cols-1 row-cols-md-2 align-items-center'>
                            <div className='col-md-3 px-3 order-0'>
                                {[0, 1].map((index) => (
                                    <select
                                        className="form-select mb-4"
                                        aria-label="Default select example"
                                        onChange={(event) => changeSelect(event, index)}
                                        key={index}
                                        value={selectsOpt.weekEv[index]}
                                        style={{ backgroundColor: index === 0 ? 'rgb(255, 195, 0, 0.5)' : 'rgba(23, 89, 255, 0.5)' }}
                                    >
                                        {Object.keys(weekEvolutionSelects.Mon).sort().map((key) => (
                                            <option value={key} key={index + '-' + key}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>
                                ))}
                            </div>
                            <div className='col-md-9 px-3 order-1'>
                                <Line className="mt-3"
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                        }
                                    }}
                                    data={charts.weekEv} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
                    <div className="p-3 charts">
                        <div className='row row-cols-1 row-cols-md-2 align-items-center'>
                            <div className='col-md-3 px-3 order-0'>
                                <select
                                    className="form-select mb-4"
                                    aria-label="Default select example"
                                    value={selectsOpt.wOw}
                                    onChange={(event) => chooseWow(event)}>
                                    {Object.keys(weekEvolutionSelects.Mon).sort().map((key, idx) => (
                                        <option value={key} key={idx}>
                                            {key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-md-9 px-3 order-1'>
                                <Line className="mt-3"
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                        }
                                    }}
                                    data={charts.wOw} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default FirstTab;