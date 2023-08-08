import './carousel.scss';
import FirstTab from '../firstTab';
import SecondTab from '../secondTab';

function Carousel() {
    /* criacao do menu para mobile pode ser feito com o offcanva do bootstrap */
    return (
        <div id="dash">
            <h3 className="pt-5">Análises</h3>
            <div id="dashboards" className="carousel slide pt-3 pt-md-4">
                <div className="carousel-inner">
                    <FirstTab />
                    <SecondTab />
                </div>
            </div>
        </div>
    )

}

export default Carousel;