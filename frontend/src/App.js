import {useEffect, useState} from "react";
import axios from "axios";

export function App() {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        axios.get('api/tables').then(({data}: response) => setTables(data));
    }, []);

    return (
    <div>
        <h3>
            Hello from docker
        </h3>
        <h4>Tables:</h4>
        <div>
            {
                tables.map(table => <div>{JSON.stringify(table)}</div>)
            }
        </div>
    </div>
  );
}

