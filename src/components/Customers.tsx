import { useState, useEffect } from "react"
import type { Customer } from "../types"
import { deleteCustomer, getCustomers } from "../customerApi";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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

    // Handle deletion of a customer
    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            deleteCustomer(url)
                .then(() => fetchCustomers())
                .catch(err => console.error(err));
        }
    }

    // Define columns for the DataGrid
    const columns: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(params.row._links.self.href)}
                    label="Delete" />,
            ],
        },
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
        <div style={{ width: '90%', margin: '20px auto' }}>
            <Card>
                <CardContent>
                    {/* Title and search bar side-by-side */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '20px', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GroupIcon sx={{ color: '#667eea', fontSize: 28 }} />
                            <h3 style={{ margin: 0, color: '#667eea', fontWeight: 'bold' }}>Customers</h3>
                        </Box>
                        {/* Search bar for customers */}
                        <TextField
                            label="Search customers"
                            variant="outlined"
                            size="small"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ width: '350px' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Customers data grid */}
                    <div style={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={filteredCustomers}
                            columns={columns}
                            getRowId={row => row._links.self.href}
                            autoPageSize
                            rowSelection={false}
                            sx={{
                                border: 'none',
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Customers;