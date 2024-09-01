// milkProductionController.js

import fs from 'fs';
import dataModel from '../models/dataModel.js';

// Function to save data to the file
const saveDataToFile = (data) => {
  fs.writeFileSync('./data/cowsData.json', JSON.stringify(data, null, 2));
};

export const getAllMilkProduction = (req, res) => {
  const allData = dataModel.getAllData();
  console.log("All data:", allData);

  const allMilkProduction = allData.cows.reduce((acc, cow) => {
    if (cow.milk_production && Array.isArray(cow.milk_production)) {
      acc.push(...cow.milk_production);
    }
    return acc;
  }, []);
  console.log("All milk production:", allMilkProduction);

  res.json(allMilkProduction);
};

// Add a new milk production record for a cow
export const addMilkProduction = (req, res) => {
  const newMilkProduction = req.body; 
  const allData = dataModel.getAllData();
  const cows = allData.cows;

  // Find the index of the next cow that DOESN'T have a milk production record
  let nextCowIndex = -1;
  for (let i = 0; i < cows.length; i++) {
    if (!cows[i].milk_production || cows[i].milk_production.length === 0) {
      nextCowIndex = i;
      break;
    }
  }

  // If we didn't find a cow without a milk production record, start from the beginning
  if (nextCowIndex === -1) {
    nextCowIndex = 0;
  }

  // Check if all cows have milk production records
  if (nextCowIndex === 0 && cows[nextCowIndex].milk_production && cows[nextCowIndex].milk_production.length > 0) {
    return res.status(200).json({ message: 'All cows have milk production records.' });
  }

  const cow = cows[nextCowIndex];

  // Add the new milk production record
  if (!cow.milk_production) {
    cow.milk_production = [];
  }

  newMilkProduction.id = cow.milk_production.length + 1; // Assign a unique ID
  cow.milk_production.push(newMilkProduction);

  // Update the allData object with the modified cow data
  allData.cows = cows;

  saveDataToFile(allData); // Save the updated data back to the file

  res.status(201).json(newMilkProduction);
};




// update
export const updateMilkProductionById = (req, res) => {
  const milkProductionId = req.params.id;
  const updatedMilkProductionData = req.body;

  try {
    let allData = dataModel.getAllData();
    const cows = allData.cows;

    let updated = false;

    // Loop through all cows to find and update the milk production record
    cows.forEach((cow) => {
      if (cow.milk_production) {
        const milkProductionIndex = cow.milk_production.findIndex((record) => record.id === parseInt(milkProductionId));
        if (milkProductionIndex !== -1) {
          cow.milk_production[milkProductionIndex] = { ...cow.milk_production[milkProductionIndex], ...updatedMilkProductionData };
          updated = true;
        }
      }
    });

    if (updated) {
      saveDataToFile(allData);
      res.json({ message: 'Milk production record updated successfully' });
    } else {
      res.status(404).json({ message: 'Milk production record not found' });
    }
  } catch (error) {
    console.error('Error updating milk production record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const deleteMilkProductionById = (req, res) => {
  const milkProductionId = req.params.id;

  try {
    let allData = dataModel.getAllData();
    const cows = allData.cows;

    let deleted = false;

    // Loop through all cows to find and delete the milk production record
    cows.forEach((cow) => {
      if (cow.milk_production) {
        const milkProductionIndex = cow.milk_production.findIndex((record) => record.id === parseInt(milkProductionId));
        if (milkProductionIndex !== -1) {
          cow.milk_production.splice(milkProductionIndex, 1); // Remove the record
          deleted = true;
        }
      }
    });

    if (deleted) {
      saveDataToFile(allData);
      res.json({ message: 'Milk production record deleted successfully' });
    } else {
      res.status(404).json({ message: 'Milk production record not found' });
    }
  } catch (error) {
    console.error('Error deleting milk production record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

