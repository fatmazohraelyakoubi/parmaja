import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MilkProduction = () => {
  const [milkProductionData, setMilkProductionData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMilkProductionData, setNewMilkProductionData] = useState({ date: '', amount: '', quality: '' });
  const [editMilkProductionData, setEditMilkProductionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/milkProductionRoutes/milk_production');
        setMilkProductionData(response.data);
      } catch (error) {
        console.error('Error fetching milk production data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddMilkProduction = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveMilkProduction = async () => {
    try {
      if (editMilkProductionData) {
        await axios.put(`http://localhost:1000/api/milkProductionRoutes/updateMilkProductionById/${editMilkProductionData.id}`, newMilkProductionData);
      } else {
        const response = await axios.post('http://localhost:1000/api/milkProductionRoutes/addMilkProduction', newMilkProductionData);
        console.log('New milk production data saved:', response.data);
      }
      
      const updatedResponse = await axios.get('http://localhost:1000/api/milkProductionRoutes/milk_production');
      setMilkProductionData(updatedResponse.data);
      setEditMilkProductionData(null);
      setNewMilkProductionData({ date: '', amount: '', quality: '' });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving milk production data:', error);
    }
  };

  const handleDeleteMilkProduction = async (milkProduction) => {
    try {
      await axios.delete(`http://localhost:1000/api/milkProductionRoutes/milk-production/${milkProduction.id}`);
      console.log('Deleted Milk Production:', milkProduction);
      const updatedMilkProductionData = milkProductionData.filter(item => item.id !== milkProduction.id);
      setMilkProductionData(updatedMilkProductionData);
    } catch (error) {
      console.error('Error deleting milk production:', error);
    }
  };

  const handleEditMilkProduction = (milkProduction) => {
    setEditMilkProductionData(milkProduction);
    setNewMilkProductionData(milkProduction);
    setOpenDialog(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewMilkProductionData({ ...newMilkProductionData, [name]: value });
  };
  const handleViewMilkProduction = (event) => {
    const { name, value } = event.target;
    setNewMilkProductionData({ ...newMilkProductionData, [name]: value });
  };

  return (
    <div>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddMilkProduction}>
        Add New Milk Production
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {milkProductionData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.quality}</TableCell>
                
                <TableCell>
                  <Button startIcon={<EditIcon />} onClick={() => handleEditMilkProduction(row)}>Edit</Button>
                  <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteMilkProduction(row)}>Delete</Button>
                  <Button startIcon={<VisibilityIcon />} onClick={() => handleViewMilkProduction(row)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMilkProductionData ? 'Edit Milk Production' : 'Add New Milk Production'}</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              id="date"
              name="date"
              label="Date"
              variant="outlined"
              fullWidth
              margin="normal"
              type='date'
              value={newMilkProductionData.date}
              onChange={handleInputChange}
            />
            <TextField
              id="amount"
              name="amount"
              label="Amount"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newMilkProductionData.amount}
              onChange={handleInputChange}
            />
            <TextField
              id="quality"
              name="quality"
              label="Quality"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newMilkProductionData.quality}
              onChange={handleInputChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveMilkProduction}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MilkProduction;