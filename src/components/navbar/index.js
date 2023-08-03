import './navbar.scss';

function Navbar() {
    /* criacao do menu para mobile pode ser feito com o offcanva do bootstrap */
    return (
        <div className='row menu'>
            <div className="col-2 d-md-none d-block ">
                <img src='https://uploads-ssl.webflow.com/62d028335f5d2681ded451b2/62d0321385a6cb58db7fcb93_logo%20daki.svg' />
            </div>
        </div>
    )

}

export default Navbar;
