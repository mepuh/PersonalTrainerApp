import { useState, useEffect } from "react"
import type { Training } from "../types"
import { getTrainings } from "../trainingApi";
import { getCustomer } from "../customerApi";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function Trainings() {

    const [trainings, setTrainings] = useState<Training[]>([]);
    const [customers, setCustomers] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Updated fetchTrainings function to get customer names in addition to trainings
    const fetchTrainings = () => {
        getTrainings()
            .then(data => {
                // 1. Save trainings to state
                setTrainings(data._embedded.trainings);
                
                // 2. Get unique customer URLs (avoid fetching same customer multiple times)
                const uniqueCustomerUrls = [...new Set(
                    data._embedded.trainings.map((t: Training) => t._links.customer.href)
                )] as string[];
                
                // 3. Fetch each customer and build a map of URLs to Names
                const customerMap: { [key: string]: string } = {};
                
                // Loop through each unique customer URL
                uniqueCustomerUrls.forEach(url => {
                    getCustomer(url)
                        .then(customer => {
                            // Successfully got customer: add their name to map
                            customerMap[url] = `${customer.firstname} ${customer.lastname}`;
                            // 4. Update state with customer names
                            setCustomers(prev => ({ ...prev, ...customerMap }));
                        })
                        .catch(() => {
                            // If fetch fails: set default name unknown
                            customerMap[url] = "Unknown";
                            setCustomers(prev => ({ ...prev, ...customerMap }));
                        });
                });
            })
            .catch(err => console.error("Error fetching trainings:", err));
    }

    useEffect(() => {
        fetchTrainings();
    }, [])

    // Define columns for the DataGrid
    const columns: GridColDef[] = [
        { field: 'activity', headerName: 'Activity', minWidth: 200, flex: 1 },
        {
            field: 'date',
            headerName: 'Date',
            minWidth: 200,
            flex: 1,
            // Format date for better readability
            renderCell: (params) => format(new Date(params.value), 'dd.MM.yyyy HH:mm')
        },
        { field: 'duration', headerName: 'Duration (min)', minWidth: 150, flex: 1 },
        { 
            field: 'customer',
            headerName: 'Customer',
            minWidth: 200,
            flex: 1,
            // Use the customer URL to get the name from state
            // Shows "Loading..." if name not yet fetched
            renderCell: (params) => customers[params.row._links.customer.href] || "Loading..."
        }
    ];

    // SEARCH FUNCTIONALITY
    // Filter trainings based on search term - able to search any field
    const filteredTrainings = trainings.filter(training => {
        const customerName = customers[training._links.customer.href] || "";
        const formattedDate = format(new Date(training.date), 'dd.MM.yyyy HH:mm');
        
        return training.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formattedDate.includes(searchTerm) ||
            training.duration.toString().includes(searchTerm);
    });

    return (
        <div style={{ width: '90%', margin: '20px auto' }}>
            <Card>
                <CardContent>
                    {/* Title and search bar side-by-side */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '20px', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FitnessCenterIcon sx={{ color: '#667eea', fontSize: 28 }} />
                            <h3 style={{ margin: 0, color: '#667eea', fontWeight: 'bold' }}>Trainings</h3>
                        </Box>
                        {/* Search bar for trainings */}
                        <TextField
                            label="Search trainings"
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

                    {/* Trainings data grid */}
                    <div style={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={filteredTrainings}
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

export default Trainings;