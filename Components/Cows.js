import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MilkProduction from './MilkProduction';
import Claves from './Claves';
import HealthCheck from './HealthCheck';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}



const Cows = () => {
  const [cowsData, setCowsData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteCowId, setDeleteCowId] = useState(null);
  const [openEditDialog,setOpenEditDialog] = useState(false);
  const [newCowInfo, setNewCowInfo] = useState({
    cowNumber: '',
    entryDate: '',
    breed: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/cowsRoutes/getAllCows');
        setCowsData(response.data);
      } catch (error) {
        console.error('Error fetching cows data:', error);
      }
    };

    fetchData();
  }, []);


  const handleAddCow = () => {
    setOpenAddDialog(true);
  };


  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCowInfoChange = (e) => {
    const { name, value } = e.target;
    setNewCowInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  
  const handleSaveCow = async () => {
    try {
      await axios.post('http://localhost:1000/api/cowsRoutes/addCow', newCowInfo);
      setOpenAddDialog(false);
      const response = await axios.get('http://localhost:1000/api/cowsRoutes/getAllCows');
      setCowsData(response.data);
    } catch (error) {
      console.error('Error saving cow data:', error);
    }
  };

  const handleEditCow = async (cow) => {
    try {
      await axios.put(`http://localhost:1000/api/cowsRoutes/updateCowById/${cow.id}`, newCowInfo);
      
      // Refresh the cow data after editing
      const response = await axios.get('http://localhost:1000/api/cowsRoutes/getAllCows');
      setCowsData(response.data);
      
      // Close the edit dialog
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error editing cow:', error);
    }
  };

  const handleViewCow = (cow) => {
    // Implement view functionality here
    console.log('Viewing cow:', cow);
  };

  const handleDeleteCow = async (id) => {
    try {
      // Make a DELETE request to the backend to delete the cow with the given ID
      await axios.delete(`http://localhost:1000/api/cowsRoutes/deleteCowById/${id}`);
      
      // Remove the deleted cow from the current cowsData state
      const updatedCowsData = cowsData.filter(cow => cow.id !== id);
      setCowsData(updatedCowsData);
    } catch (error) {
      console.error('Error deleting cow:', error);
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:1000/api/cowsRoutes/deleteCowById/${deleteCowId}`);
      
      // Filter out the deleted cow from the cowsData state
      const updatedCowsData = cowsData.filter((cow) => cow.id !== deleteCowId);
      setCowsData(updatedCowsData);
      
      // Close the delete confirmation dialog
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting cow:', error);
    }
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Typography variant="h3" align="center" className="pt-7  font-extrabold text-black-900 ">System Milk Production</Typography>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Cows" {...a11yProps(0)} />
          <Tab label="Claves" {...a11yProps(1)} />
          <Tab label="Milk Production" {...a11yProps(2)} />
          <Tab label="Health Check" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <div className=" w-[70vw] text-white">
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddCow}>
              Add New Cow
            </Button>
            <TableContainer component={Paper} className="mx-auto mt-8 w-3/4">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Entry Date</TableCell>
                    <TableCell>Breed</TableCell>
                    <TableCell>Cow Number</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cowsData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.entryDate}</TableCell>
                      <TableCell>{row.breed}</TableCell>
                      <TableCell>{row.cowNumber}</TableCell>
                      <TableCell>
                        <Button startIcon={<EditIcon />} onClick={() => handleEditCow(row)}>Edit</Button>
                        <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteCow(row.id)}>Delete</Button>
                        <Button startIcon={<VisibilityIcon />} onClick={() => handleViewCow(row)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </TabPanel>

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>تسجيل البقرة</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="cowNumber"
              name="cowNumber"
              label="رقم البقرة"
              type="text"
              fullWidth
              value={newCowInfo.cowNumber}
              onChange={handleCowInfoChange}
            />
            <TextField
              margin="dense"
              id="entryDate"
              name="entryDate"
              label="تاريخ الدخول"
              type="date"
              fullWidth
              value={newCowInfo.entryDate}
              onChange={handleCowInfoChange}
            />
            <TextField
              margin="dense"
              id="breed"
              name="breed"
              label="سلالة"
              select
              SelectProps={{
                native: true,
              }}
              fullWidth
              value={newCowInfo.breed}
              onChange={handleCowInfoChange}
            >
              <option value="هولشتاين">هولشتاين</option>
              <option value="هولندي">هولندي</option>
              <option value="مونتبليارد">مونتبليارد</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Cancel</Button>
            <Button onClick={handleSaveCow}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this cow?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <TabPanel value={value} index={2}>
          <MilkProduction />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Claves />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <HealthCheck />
        </TabPanel>
      </Box>
    </div>
  );
};

export default Cows;