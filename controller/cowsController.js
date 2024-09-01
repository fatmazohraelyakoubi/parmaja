// cowsController.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/cowsData.json');
import dataModel from '../models/dataModel.js';

// add new cow
export const addCow = (req, res) => {
  const newCow = req.body;
  let data = JSON.parse(fs.readFileSync(dataFilePath));
  if (!data.cows) {
    data.cows = [];
  }

  // Generate a new cow number starting with 1 if no cows exist
  if (data.cows.length === 0) {
    newCow.cow_number = 1;
  } else {
    // Find the maximum cow number and increment by 1 for the new cow
    const maxCowNumber = Math.max(...data.cows.map(cow => cow.cow_number));
    newCow.cow_number = maxCowNumber + 1;
  }

  data.cows.push(newCow);

  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

  res.status(201).json(newCow);
};


// Get cow by cow number
export const getCowByNumber = (req, res) => {
  const cowNumber = parseInt(req.params.cowNumber);

  let data = JSON.parse(fs.readFileSync(dataFilePath));
  const cows = data.cows;
  const foundCow = cows.find(cow => cow.cow_number === cowNumber);

  if (foundCow) {
    res.json(foundCow);
  } else {
    res.status(404).json({ message: 'Cow not found' });
  }
};





// Get all cows
export const getAllCows = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    const cows = data.cows || [];

    res.json(cows);
  } catch (error) {
    console.error('Error reading cows data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Delete cow by ID
export const deleteCowById = (req, res) => {
  const cowId = parseInt(req.params.cowId);

  try {
    let data = JSON.parse(fs.readFileSync(dataFilePath));
    const cows = data.cows;

    const cowIndex = cows.findIndex((cow) => cow.cow_number === cowId || cow.cowNumber === cowId);

    if (cowIndex !== -1) {
      data.cows.splice(cowIndex, 1);

      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

      res.json({ message: 'Cow deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cow not found' });
    }
  } catch (error) {
    console.error('Error deleting cow:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Update cow by ID
export const updateCowById = (req, res) => {
  const cowId = parseInt(req.params.cowId);
  const updatedCowData = req.body;

  try {
    let data = JSON.parse(fs.readFileSync(dataFilePath));
    const cows = data.cows;

    const cowIndex = cows.findIndex((cow) => cow.cow_number === cowId || cow.cowNumber === cowId);

    if (cowIndex !== -1) {
      // Update the cow's data with the new information
      data.cows[cowIndex] = { ...data.cows[cowIndex], ...updatedCowData };

      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

      res.json({ message: 'Cow updated successfully' });
    } else {
      res.status(404).json({ message: 'Cow not found' });
    }
  } catch (error) {
    console.error('Error updating cow:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

