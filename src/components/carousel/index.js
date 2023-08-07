import './carousel.scss';
import FirstTab from '../firstTab';
import SecondTab from '../secondTab';

function Carousel() {
    /* criacao do menu para mobile pode ser feito com o offcanva do bootstrap */
    return (
        <div>
            <h3 className="pt-5">Análises</h3>
            <div id="dashboards" className="carousel slide h-100 pt-3 pt-md-4">
                <div className="carousel-inner h-100">
                    <FirstTab />
                    <SecondTab />
                </div>
            </div>
        </div>
    )

}

export default Carousel;