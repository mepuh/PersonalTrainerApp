import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addTraining } from '../trainingApi';

type AddTrainingProps = {
    customerUrl: string;
    customerName: string;
}

// Component for adding a training session to a specific customer
// Opens a dialog when the "Add Training" button is clicked
export default function AddTraining({ customerUrl, customerName }: AddTrainingProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const [duration, setDuration] = useState<string>("");
    const [activity, setActivity] = useState<string>("");
    const [errors, setErrors] = useState<{ date?: string; duration?: string; activity?: string }>({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    // Closes dialog and resets form and errors
    const handleClose = () => {
        setOpen(false);
        setDate(new Date());
        setDuration("");
        setActivity("");
        setErrors({});
    };

    // Validates form and saves training session
    const handleSave = () => {
        const newErrors: { date?: string; duration?: string; activity?: string } = {};

        if (!date) newErrors.date = "Date is required";
        if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) newErrors.duration = "Valid duration is required";
        if (!activity) newErrors.activity = "Activity is required";

        // If there are validation errors, set them and do not proceed to save
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Prepare training data
        const trainingData = {
            date: date!.toISOString(),
            duration: Number(duration),
            activity: activity,
            customer: customerUrl
        };

        // Call API to add training and handle response
        addTraining(trainingData)
            .then(() => {
                alert(`Training session added successfully for ${customerName}!`);
                handleClose();
            })
            .catch(err => {
                console.error("Error adding training:", err);
            });
    }

    return (
        <>
            {/* Button to open the Add Training dialog */}
            <IconButton onClick={handleClickOpen} color="success" size="small">
                <FitnessCenterIcon fontSize="small" />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Training for {customerName}</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Date and Time"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            slotProps={{
                                textField: {
                                    margin: "dense",
                                    required: true,
                                    fullWidth: true,
                                    variant: "standard",
                                    // Displays error if validation fails
                                    error: !!errors.date,
                                    helperText: errors.date
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        required
                        label="Duration (minutes)"
                        type="number"
                        value={duration}
                        onChange={event => setDuration(event.target.value)}
                        fullWidth
                        variant="standard"
                        error={!!errors.duration}
                        helperText={errors.duration}
                    />
                    <TextField
                        margin="dense"
                        required
                        label="Activity"
                        value={activity}
                        onChange={event => setActivity(event.target.value)}
                        fullWidth
                        variant="standard"
                        error={!!errors.activity}
                        helperText={errors.activity}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
