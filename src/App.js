import './App.scss';
import Menu from './components/menu';
import Navbar from './components/navbar';
import Carousel from './components/carousel';
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function App() {
    return (
        <div className="App row">
            <Menu />
            <div className="col dashboards-col">
                <Navbar />
                <Carousel />
            </div>
        </div>
    );
}

export default App;
