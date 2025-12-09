import { useState, useEffect } from "react"
import type { Customer } from "../types"
import { getCustomers } from "../customerApi";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

function Customers() {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const fetchCustomers = () => {
        getCustomers()
            .then(data => { setCustomers(data._embedded.customers); })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchCustomers();
    }, [])

    const columns: GridColDef[] = [
        { field: 'firstname', headerName: 'First Name', minWidth: 150, flex: 1 },
        { field: 'lastname', headerName: 'Last Name', minWidth: 150, flex: 1 },
        { field: 'streetaddress', headerName: 'Address', minWidth: 200, flex: 1 },
        { field: 'postcode', headerName: 'Post Code', minWidth: 100, flex: 1 },
        { field: 'city', headerName: 'City', minWidth: 150, flex: 1 },
        { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
        { field: 'phone', headerName: 'Phone', minWidth: 150, flex: 1 }
    ];

    return (
        <div style={{ height: 600, width: '90%', margin: '0 auto', marginTop: '50px' }}>
            <DataGrid
                rows={customers}
                columns={columns}
                getRowId={row => row._links.self.href}
                autoPageSize
                rowSelection={false}
            />
        </div>
    );
}

export default Customers;