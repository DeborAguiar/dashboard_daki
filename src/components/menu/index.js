import './menu.scss';

function Menu() {
    /* criacao do menu para mobile pode ser feito com o offcanva do bootstrap */
    return (
        <div className="menu col-2 d-none d-md-block">
            <img src='https://uploads-ssl.webflow.com/62d028335f5d2681ded451b2/62d0321385a6cb58db7fcb93_logo%20daki.svg' />
            <div style={{ height: "10vh", width: "30px" }}></div>
            <div className='coluna' style={{ marginLeft: "1vw" }}>
                <h5> Main Menu</h5>
                <a style={{ margin: "1vw" }} data-bs-target="#dashboards" data-bs-slide-to="0" class="active" aria-current="true">Dash 1</a>
                <br />
                <a style={{ margin: "1vw" }} data-bs-target="#dashboards" data-bs-slide-to="1" aria-label="Slide 2">Dash 2</a>
            </div>
            <div style={{ height: "10vh", width: "30px" }}></div>
            <div className='coluna' style={{ marginLeft: "1vw" }}>
                <label for="exampleDataList" class="form-label">Datalist example</label>
                <input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
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
