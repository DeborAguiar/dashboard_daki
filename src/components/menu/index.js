import './menu.scss';

function Menu() {
    return (
        <div className="menu col-2 d-none d-md-block">
            <img src='https://uploads-ssl.webflow.com/62d028335f5d2681ded451b2/62d0321385a6cb58db7fcb93_logo%20daki.svg' />
            <div style={{ height: "10vh", width: "30px" }}></div>
            <div style={{ marginLeft: "1vw" }}>
                <h5> Main Menu</h5>
                <span style={{ margin: "1vw" }} data-bs-target="#dashboards" data-bs-slide-to="0" className="active" aria-current="true">Consolidados / WoW</span>
                <br />
                <span style={{ margin: "1vw" }} data-bs-target="#dashboards" data-bs-slide-to="1" aria-label="Slide 2">Heat Map</span>
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
