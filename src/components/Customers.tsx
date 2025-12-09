import { useState, useEffect } from "react"
import type { Customer } from "../types"
import { getCustomers } from "../customerApi";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

function Customers() {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

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

    // SEARCH FUNCTIONALITY
    // Filter customers based on search term - able to search any field
    const filteredCustomers = customers.filter(customer =>
        customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.streetaddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Search input field (search bar) */}
            <div style={{ marginBottom: '20px', width: '90%', maxWidth: '400px', margin: '20px auto' }}>
                <TextField
                    label="Search customers"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Search by any field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            {/* Customers data grid */}
            <div style={{ height: 600, width: '90%', margin: '0 auto', marginTop: '20px' }}>
                <DataGrid
                    rows={filteredCustomers}
                    columns={columns}
                    getRowId={row => row._links.self.href}
                    autoPageSize
                    rowSelection={false}
                />
            </div>
        </div>
    );
}

export default Customers;