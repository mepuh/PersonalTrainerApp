import { useState, useEffect } from "react"
import type { Training } from "../types"
import { getTrainings } from "../trainingApi";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";

function Trainings() {

    const [trainings, setTrainings] = useState<Training[]>([]);

    const fetchTrainings = () => {
        getTrainings()
            .then(data => { setTrainings(data._embedded.trainings); })
            .catch(err => console.error(err));
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
        { field: 'duration', headerName: 'Duration (min)', minWidth: 150, flex: 1 }
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