// calvesController.js

import fs from 'fs';
import dataModel from '../models/dataModel.js';
// Function to save data to the file
const saveDataToFile = (data) => {
  fs.writeFileSync('./data/cowsData.json', JSON.stringify(data, null, 2));
};


export const getAllCalves = async (req, res) => {
  try {
    const allData = await dataModel.getAllData(); // Fetch data once
    const allCalves = allData.cows.reduce((acc, cow) => {
      if (!cow.calves) {
        cow.calves = []; // Create an empty array if calves is undefined
      }
      if (Array.isArray(cow.calves)) {
        acc.push(...cow.calves);
      } else {
        console.log('Invalid cow:', cow);
      }
      return acc;
    }, []);
    res.json(allCalves);
  } catch (error) {
    console.error('Error fetching calves:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Add a new calf
export const addCalf = (req, res) => {
  const newCalf = req.body;
  const allData = dataModel.getAllData();
  const cows = allData.cows;

  // Find the index of the next cow that DOESN'T have a calf
  let nextCowIndex = -1;
  for (let i = 0; i < cows.length; i++) {
    if (!cows[i].calves || cows[i].calves.length === 0) {
      nextCowIndex = i;
      break;
    }
  }

  // If we didn't find a cow without a calf, start from the beginning
  if (nextCowIndex === -1) {
    nextCowIndex = 0;
  }

  // Check if all cows have calves
  if (nextCowIndex === 0 && cows[nextCowIndex].calves && cows[nextCowIndex].calves.length > 0) {
    return res.status(200).json({ message: 'All cows have calves.' });
  }

  const motherCow = cows[nextCowIndex];

  // Add the new calf to the mother cow's calves array
  if (!motherCow.calves) {
    motherCow.calves = [];
  }

  newCalf.id = motherCow.calves.length + 1; // Assign a unique ID
  motherCow.calves.push(newCalf);

  // Update the allData object with the modified cow data
  allData.cows = cows;

  saveDataToFile(allData); // Save the updated data back to the file

  res.status(201).json(newCalf);
};



// Update calf by ID
export const updateCalfById = (req, res) => {
  const calfId = parseInt(req.params.calfId);
  const updatedCalfData = req.body;

  try {
    let allData = dataModel.getAllData();
    const cows = allData.cows;

    let updated = false;

    // Loop through all cows to find and update the calf
    cows.forEach((cow) => {
      if (cow.calves) {
        const calfIndex = cow.calves.findIndex((calf) => calf.id === calfId);
        if (calfIndex !== -1) {
          // Update the calf's data with the new information
          cow.calves[calfIndex] = { ...cow.calves[calfIndex], ...updatedCalfData };
          updated = true;
        }
      }
    });

    if (updated) {
      saveDataToFile(allData); // Save the updated data back to the file
      res.json({ message: 'Calf updated successfully' });
    } else {
      res.status(404).json({ message: 'Calf not found' });
    }
  } catch (error) {
    console.error('Error updating calf:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Delete calf by ID
export const deleteCalfById = (req, res) => {
  const calfId = parseInt(req.params.calfId);

  try {
    let allData = dataModel.getAllData();
    const cows = allData.cows;

    let deleted = false;

    // Loop through all cows to find and delete the calf
    cows.forEach((cow) => {
      if (cow.calves) {
        const calfIndex = cow.calves.findIndex((calf) => calf.id === calfId);
        if (calfIndex !== -1) {
          // Remove the calf from the calves array
          cow.calves.splice(calfIndex, 1);
          deleted = true;
        }
      }
    });

    if (deleted) {
      saveDataToFile(allData); // Save the updated data back to the file
      res.json({ message: 'Calf deleted successfully' });
    } else {
      res.status(404).json({ message: 'Calf not found' });
    }
  } catch (error) {
    console.error('Error deleting calf:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};