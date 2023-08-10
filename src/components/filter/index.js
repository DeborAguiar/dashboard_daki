import { useState } from "react"

function Filter() {

    const [capitais, setCapitais] = useState([
        'Brasília', 'Rio de Janeiro', 'São Paulo', 'Belo Horizonte', 'Salvador',
        'Recife', 'Fortaleza', 'Curitiba', 'Porto Alegre', 'Belém', 'Manaus', 'Cuiabá',
        'Goiânia', 'Palmas', 'Campo Grande', 'Vitória', 'Macapá', 'Natal', 'Teresina', 'João Pessoa'
    ])
    
    return (<div  style={{ marginLeft: "1vw" }}>
        <span className="fs-4">Filtro</span>
        <span className="fs-6 ms-2 " style={{color: "red"}}>(Não funcional)</span>
        <div className="mb-3">
            <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Cidade" />
            <datalist id="datalistOptions">
                {capitais.map((capital, index) => (
                    <option key={index} value={capital} />
                ))}
            </datalist>
        </div>
        <div className="mb-3">
            <input disabled className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Data" />
            <datalist id="datalistOptions">
            </datalist>
        </div>
        <div className="mb-3">
            <input disabled className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Marca" />
            <datalist id="datalistOptions">
            </datalist>
        </div>
        <div className="fs-6 font-monospace">
            /*<br/>
                Mesmo que o filtro não esteja funcionando digite algo o campo "Cidade"
            <br/>*/
        </div>
    </div>)
}

export default Filter