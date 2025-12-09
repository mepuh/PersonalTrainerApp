import { useState, useEffect } from "react"
import type { Training } from "../types"
import { getTrainings } from "../trainingApi";
import { getCustomer } from "../customerApi";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";

function Trainings() {

    const [trainings, setTrainings] = useState<Training[]>([]);
    const [customers, setCustomers] = useState<{ [key: string]: string }>({});

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

    return (
        <div style={{ height: 600, width: '90%', margin: '0 auto', marginTop: '50px' }}>
            <DataGrid
                rows={trainings}
                columns={columns}
                getRowId={row => row._links.self.href}
                autoPageSize
                rowSelection={false}
            />
        </div>
    );
}

export default Trainings;