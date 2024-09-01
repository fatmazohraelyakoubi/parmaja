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
  TextField,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const HealthCheck = () => {
  const [healthCheckData, setHealthCheckData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ id: null, date: '', type: '', result: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/healthChecksRoutes/health_checks');
        setHealthCheckData(response.data);
      } catch (error) {
        console.error('Error fetching health check data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddHealthCheck = () => {
    setOpenDialog(true);
    setFormData({ id: null, date: '', type: '', result: '' });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveHealthCheck = async () => {
    try {
      let response;
      if (formData.id) {
        response = await axios.put(`http://localhost:1000/api/healthChecksRoutes/healthChecks/${formData.id}`, formData);
      } else {
        response = await axios.post('http://localhost:1000/api/healthChecksRoutes/addHealthCheck', formData);
      }
      console.log('Health check saved:', response.data);
      
      const updatedResponse = await axios.get('http://localhost:1000/api/healthChecksRoutes/health_checks');
      setHealthCheckData(updatedResponse.data);
      
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving health check:', error);
    }
  };

  const handleEditHealthCheck = (row) => {
    setFormData({ ...row });
    setOpenDialog(true);
  };

  const handleDeleteHealthCheck = async (row) => {
    try {
      const response = await axios.delete(`http://localhost:1000/api/healthChecksRoutes/deleteHealthCheckById/${row.id}`);
      console.log('Health check deleted:', response.data);
      const updatedData = healthCheckData.filter((item) => item.id !== row.id);
      setHealthCheckData(updatedData);
    } catch (error) {
      console.error('Error deleting health check:', error);
    }
  };

  const handleViewHealthCheck = (row) => {
    console.log('Viewing health check:', row);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddHealthCheck}>
        Add New Health Check
      </Button>
      <TableContainer component={Paper} className="mx-auto mt-8 w-3/4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Entry Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {healthCheckData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.result}</TableCell>
                <TableCell>
                  <Button startIcon={<EditIcon />} onClick={() => handleEditHealthCheck(row)}>
                    Edit
                  </Button>
                  <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteHealthCheck(row)}>
                    Delete
                  </Button>
                  <Button startIcon={<VisibilityIcon />} onClick={() => handleViewHealthCheck(row)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{formData.id ? 'Edit Health Check' : 'Add New Health Check'}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InputLabel htmlFor="date">Entry Date:</InputLabel>
            <TextField
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <InputLabel htmlFor="type">Type:</InputLabel>
            <TextField
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            />
            <InputLabel htmlFor="result">Result:</InputLabel>
            <TextField
              id="result"
              name="result"
              value={formData.result}
              onChange={handleInputChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveHealthCheck} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HealthCheck;