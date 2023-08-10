import './menu.scss';

function Menu() {

    const handleSpanClick = (index) => {
        const spans = document.querySelectorAll('.nav-link');

        spans.forEach((span, i) => {
            if (i === index) {
                span.classList.add('active');
            } else {
                span.classList.remove('active');
            }
        });
    };

    return (
        <div className="menu col-2 d-none d-md-block">
            <img src='https://uploads-ssl.webflow.com/62d028335f5d2681ded451b2/62d0321385a6cb58db7fcb93_logo%20daki.svg' />
            <div style={{ height: "10vh", width: "30px" }}></div>
            <div style={{ marginLeft: "1vw" }}>
                <h5> Main Menu</h5>
                <span
                    className='nav-link mx-3 py-2 ps-2 mb-2 active'
                    data-toggle="tab"
                    data-bs-target="#dashboards"
                    data-bs-slide-to='0'
                    onClick={() => handleSpanClick(0)}
                >
                    <span className=''>
                        Dash 1
                    </span>
                </span>
                <span
                    className='nav-link mx-3 py-2 ps-2 '
                    data-toggle="tab"
                    data-bs-target="#dashboards"
                    data-bs-slide-to='1'
                    onClick={() => handleSpanClick(1)}
                >
                    Dash 2
                </span>
            </div>
            <div style={{ height: "10vh", width: "30px" }}></div>
            <div style={{ marginLeft: "1vw" }}>
                <label htmlFor="exampleDataList" className="form-label">Datalist example</label>
                <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
                <datalist id="datalistOptions">
                    <option value="San Francisco" />
                    <option value="New York" />
                    <option value="Seattle" />
                    <option value="Los Angeles" />
                    <option value="Chicago" />
                </datalist>
            </div>

        </div>
    );
}

export default Menu;
