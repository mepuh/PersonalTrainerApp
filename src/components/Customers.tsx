import { useState, useEffect } from "react"
import type { Customer, CustomerForm } from "../types"
import { deleteCustomer, getCustomers, updateCustomer } from "../customerApi";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import AddCustomer from "./AddCustomer";
import AddTraining from "./AddTraining";

function Customers() {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<CustomerForm | null>(null);

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

    // Handle edit of a customer - enables editing mode for the selected row
    const handleEdit = (row: Customer) => {
        setEditingRowId(row._links.self.href);
        setEditingData({
            firstname: row.firstname,
            lastname: row.lastname,
            streetaddress: row.streetaddress,
            postcode: row.postcode,
            city: row.city,
            email: row.email,
            phone: row.phone
        });
    }

    // Handle save after editing
    const handleSave = () => {
        if (editingRowId && editingData) {
            // Validate all fields are filled
            if (!editingData.firstname || !editingData.lastname || !editingData.streetaddress ||
                !editingData.postcode || !editingData.city || !editingData.email || !editingData.phone) {
                alert("All fields must be filled!");
                return;
            }

            // Update customer and refresh list
            updateCustomer(editingRowId, editingData)
                .then(() => {
                    fetchCustomers();
                    setEditingRowId(null);
                    setEditingData(null);
                })
                .catch(err => console.error(err));
        }
    }

    // Handle cancel editing
    const handleCancel = () => {
        setEditingRowId(null);
        setEditingData(null);
    }

    // Handle field changes during editing
    const handleFieldChange = (field: string, value: string) => {
        if (editingData) {
            setEditingData({ ...editingData, [field]: value });
        }
    }

    // Export customers to CSV file
    const exportToCSV = () => {
        // Define CSV headers (only customer data fields, no actions)
        const headers = ['First Name', 'Last Name', 'Street Address', 'Postcode', 'City', 'Email', 'Phone'];

        // Convert customers data to CSV rows
        const csvRows = customers.map(customer => [
            customer.firstname,
            customer.lastname,
            customer.streetaddress,
            customer.postcode,
            customer.city,
            customer.email,
            customer.phone
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','), // Header row
            ...csvRows.map(row => row.join(',')) // Data rows
        ].join('\n');

        // Create a Blob from the CSV content (Binary Large Object)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a download link and trigger download
        // Step 1: Create an invisible <a> element
        const link = document.createElement('a');
        // Step 2: Create a temporary URL that points to the Blob data
        const url = URL.createObjectURL(blob);
        // Step 3: Set the link's destination to the temporary URL
        link.setAttribute('href', url);
        // Step 4: Set the filename for the downloaded file
        link.setAttribute('download', 'customers.csv');
        // Step 5: Hide the link (user won't see it)
        link.style.visibility = 'hidden';
        // Step 6: Add the link to the page (needed for it to work)
        document.body.appendChild(link);
        // Step 7: Programmatically click the link to trigger download
        link.click();
        // Step 8: Remove the link from the page (cleanup)
        document.body.removeChild(link);
    }

    // Define columns for the DataGrid
    const columns: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            minWidth: 130,
            getActions: (params: GridRowParams) => {
                const isEditing = editingRowId === params.row._links.self.href;

                if (isEditing) {
                    return [
                        <Tooltip key="save" title="Save">
                            <GridActionsCellItem
                                icon={<CheckIcon />}
                                onClick={handleSave}
                                label="Save" />
                        </Tooltip>,
                        <Tooltip key="cancel" title="Cancel">
                            <GridActionsCellItem
                                icon={<CloseIcon />}
                                onClick={handleCancel}
                                label="Cancel" />
                        </Tooltip>,
                    ];
                }

                return [
                    <Tooltip key="edit" title="Edit">
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            onClick={() => handleEdit(params.row)}
                            label="Edit" />
                    </Tooltip>,
                    <Tooltip key="delete" title="Delete">
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            onClick={() => handleDelete(params.row._links.self.href)}
                            label="Delete" />
                    </Tooltip>,
                    <AddTraining
                        customerUrl={params.row._links.self.href}
                        customerName={`${params.row.firstname} ${params.row.lastname}`}
                    />,
                ];
            },
        },
        {
            field: 'firstname',
            headerName: 'First Name',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {
                if (editingRowId === params.row._links.self.href) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <TextField
                                value={editingData?.firstname || ''}
                                onChange={(e) => handleFieldChange('firstname', e.target.value)}
                                size="small"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    );
                }
                return params.value;
            }
        },
        {
            field: 'lastname',
            headerName: 'Last Name',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {
                if (editingRowId === params.row._links.self.href) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <TextField
                                value={editingData?.lastname || ''}
                                onChange={(e) => handleFieldChange('lastname', e.target.value)}
                                size="small"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    );
                }
                return params.value;
            }
        },
        {
            field: 'streetaddress',
            headerName: 'Address',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                if (editingRowId === params.row._links.self.href) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <TextField
                                value={editingData?.streetaddress || ''}
                                onChange={(e) => handleFieldChange('streetaddress', e.target.value)}
                                size="small"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    );
                }
                return params.value;
            }
        },
        {
            field: 'postcode',
            headerName: 'Post Code',
            minWidth: 100,
            flex: 1,
            renderCell: (params) => {
                if (editingRowId === params.row._links.self.href) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <TextField
                                value={editingData?.postcode || ''}
                                onChange={(e) => handleFieldChange('postcode', e.target.value)}
                                size="small"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    );
                }
                return params.value;
            }
        },
        {
            field: 'city',
            headerName: 'City',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {
                if (editingRowId === params.row._links.self.href) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <TextField
                                value={editingData?.city || ''}
                                onChange={(e) => handleFieldChange('city', e.target.value)}
                                size="small"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    );
                }
                return params.value;
            }
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                if (editingRowId === params.row._links.self.href) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <TextField
                                value={editingData?.email || ''}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                size="small"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    );
                }
                return params.value;
            }
        },
        {
            field: 'phone',
            headerName: 'Phone',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => {
                if (editingRowId === params.row._links.self.href) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <TextField
                                value={editingData?.phone || ''}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                size="small"
                                variant="standard"
                                fullWidth
                            />
                        </Box>
                    );
                }
                return params.value;
            }
        }
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Component for adding a new customer (button) */}
                            <Tooltip title="Add Customer">
                                <div>
                                    <AddCustomer fetchCustomers={fetchCustomers} />
                                </div>
                            </Tooltip>
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
                                // Dim the non-editing rows when in editing mode
                                '& .MuiDataGrid-row': {
                                    opacity: editingRowId ? 0.3 : 1,
                                    transition: 'opacity 0.2s',
                                },
                                // Disable hover effect on non-editing rows
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: editingRowId ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                                },
                                // Highlight the editing row
                                [`& .MuiDataGrid-row[data-id="${editingRowId}"]`]: {
                                    opacity: 1,
                                    backgroundColor: 'rgba(139, 156, 232, 0.08)',
                                },
                            }}
                        />
                    </div>

                    {/* Export to CSV button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Tooltip title="Export to CSV">
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={exportToCSV}
                            >
                                Export data
                            </Button>
                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}

export default Customers;