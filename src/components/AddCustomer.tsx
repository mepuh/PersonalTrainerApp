import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { CustomerForm } from '../types';
import { saveCustomer } from '../customerApi';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';

type AddCustomerProps = {
    fetchCustomers: () => void;
}

// Component for adding a new customer via a dialog form
// Opens a dialog when the "Add Customer" button is clicked
export default function AddCustomer({ fetchCustomers }: AddCustomerProps) {
    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState<CustomerForm>({
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        email: "",
        phone: "",
    })
    const [errors, setErrors] = useState<Partial<CustomerForm>>({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    // Closes dialog and resets form and errors
    const handleClose = () => {
        setOpen(false);
        setCustomer({
            firstname: "",
            lastname: "",
            streetaddress: "",
            postcode: "",
            city: "",
            email: "",
            phone: "",
        })
        setErrors({});
    };

    // Makes sure all fields are filled before saving
    const handleSave = () => {
        // Partial object to hold validation errors (does not need all fields)
        const newErrors: Partial<CustomerForm> = {};
        
        if (!customer.firstname) newErrors.firstname = "First name is required";
        if (!customer.lastname) newErrors.lastname = "Last name is required";
        if (!customer.streetaddress) newErrors.streetaddress = "Street address is required";
        if (!customer.postcode) newErrors.postcode = "Post code is required";
        if (!customer.city) newErrors.city = "City is required";
        if (!customer.email) newErrors.email = "Email is required";
        if (!customer.phone) newErrors.phone = "Phone is required";
        
        // If there are validation errors, set them and do not proceed to save
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Saves customer and refreshes list
        saveCustomer(customer)
            .then(() => {
                alert(`Customer ${customer.firstname} ${customer.lastname} added successfully!`);
                fetchCustomers();
                handleClose();
            })
            .catch(err => console.error(err))
    }

    return (
        <>
            {/* Button to open the "Add Customer" dialog */}
            <IconButton onClick={handleClickOpen} sx={{ fontSize: 30, color: '#764ba2' }}>
                <PersonAddRounded sx={{ fontSize: 30 }} />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add new customer!</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        required
                        label="First Name"
                        value={customer.firstname}
                        onChange={event => setCustomer({ ...customer, firstname: event.target.value })}
                        fullWidth
                        variant="standard"
                        // Displays error if validation fails
                        error={!!errors.firstname} // Checks if there's an error for firstname, !! converts to boolean
                        helperText={errors.firstname} // Shows the error message below the field
                    />
                    <TextField
                        margin="dense"
                        required
                        label="Last Name"
                        value={customer.lastname}
                        onChange={event => setCustomer({ ...customer, lastname: event.target.value })}
                        fullWidth
                        variant="standard"
                        error={!!errors.lastname}
                        helperText={errors.lastname}
                    />
                    <TextField
                        margin="dense"
                        required
                        label="Street Address"
                        value={customer.streetaddress}
                        onChange={event => setCustomer({ ...customer, streetaddress: event.target.value })}
                        fullWidth
                        variant="standard"
                        error={!!errors.streetaddress}
                        helperText={errors.streetaddress}
                    />
                    <TextField
                        margin="dense"
                        required
                        label="Post Code"
                        value={customer.postcode}
                        onChange={event => setCustomer({ ...customer, postcode: event.target.value })}
                        fullWidth
                        variant="standard"
                        error={!!errors.postcode}
                        helperText={errors.postcode}
                    />
                    <TextField
                        margin="dense"
                        required
                        label="City"
                        value={customer.city}
                        onChange={event => setCustomer({ ...customer, city: event.target.value })}
                        fullWidth
                        variant="standard"
                        error={!!errors.city}
                        helperText={errors.city}
                    />
                    <TextField
                        margin="dense"
                        required
                        label="Email"
                        value={customer.email}
                        onChange={event => setCustomer({ ...customer, email: event.target.value })}
                        fullWidth
                        variant="standard"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="dense"
                        required
                        label="Phone"
                        value={customer.phone}
                        onChange={event => setCustomer({ ...customer, phone: event.target.value })}
                        fullWidth
                        variant="standard"
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}