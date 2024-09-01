import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Claves = () => {
  const [clavesData, setClavesData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newClaveData, setNewClaveData] = useState({ cowNumber: '', birthDate: '' });
  const [selectedClaveId, setSelectedClaveId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/calvesRoutes/calves');
        setClavesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddClaves = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveCalves = async () => {
    try {
      const response = await axios.post('http://localhost:1000/api/calvesRoutes/addCalf', newClaveData);
      console.log('New calf data saved:', response.data);
      const updatedResponse = await axios.get('http://localhost:1000/api/calvesRoutes/calves');
      setClavesData(updatedResponse.data);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewClaveData({ ...newClaveData, [name]: value });
  };

  const handleEditClaves =async (row) => {
    try {
      const response = await axios.put(`http://localhost:1000/api/calvesRoutes/deleteCalf/${row.id}`);
      console.log('Calf Updated:', response.data);
      const updatedClaves = clavesData.filter((calf) => calf.id !== row.id);
      setClavesData(updatedClaves);
    } catch (error) {
      console.error('ErrorUpdating calf:', error);
    }
  };

  const handleDeleteClaves = async (row) => {
    try {
      const response = await axios.delete(`http://localhost:1000/api/calvesRoutes/deleteCalfById/${row.id}`);
      console.log('Calf deleted:', response.data);
      const updatedClaves = clavesData.filter((calf) => calf.id !== row.id);
      setClavesData(updatedClaves);
    } catch (error) {
      console.error('Error deleting calf:', error);
    }
  };

  const handleViewClaves = (row) => {
    // Implement view functionality here
  };

  return (
    <div>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClaves}>
        Add New Calves
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clavesData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>
                  <Button startIcon={<EditIcon />} onClick={() => handleEditClaves(row)}>Edit</Button>
                  <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteClaves(row)}>Delete</Button>
                  <Button startIcon={<VisibilityIcon />} onClick={() => handleViewClaves(row)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Calves</DialogTitle>
        <DialogContent>
          <TextField
            id="cowNumber"
            name="cowNumber"
            label="Cow Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newClaveData.cowNumber}
            onChange={handleInputChange}
          />
          <TextField
            id="birthDate"
            name="birthDate"
            label="Birth Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            fullWidth
            margin="normal"
            value={newClaveData.birthDate}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCalves}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Claves;