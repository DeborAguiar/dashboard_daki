import { useEffect, useState } from "react";
import { ResponsiveHeatMap } from '@nivo/heatmap'

function SecondTab({ csvData }) {

    const [heatmap, setHeatmap] = useState([]);
    const [colors, setColors] = useState({});

    useEffect(() => {
        buildHeatmap();
    }, [csvData]);

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

        for (let d of csvData) {
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
                <div className="tab-pane fade show active" id="tab4" role="tabpanel" aria-labelledby="tab4-tab">
                    <div className="p-3 charts">
                        <div className="row p-3">
                            <div className="col" style={{ height: "70vh" }}>
                                <ResponsiveHeatMap
                                    data={heatmap
                                    }
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

                    </div>
                </div>
            </div>

        </div>
    )
}

export default SecondTab;
