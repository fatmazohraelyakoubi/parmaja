import fs from 'fs';
import dataModel from '../models/dataModel.js';
import _ from 'lodash';
// Function to save data to the file
const saveDataToFile = (data) => {
  fs.writeFileSync('./data/cowsData.json', JSON.stringify(data, null, 2));
};

export const getAllHealthChecks = (req, res) => {
  const allData = dataModel.getAllData();
  console.log("All data:", allData);

  const allHealthChecks = allData.cows.reduce((acc, cow) => {
    if (cow.health_checks !== undefined && _.isArray(cow.health_checks)) {
      acc.push(...cow.health_checks);
    } else {
      console.log("Invalid health_checks data for cow:", cow);
    }
    return acc;
  }, []);

  console.log("All health checks:", allHealthChecks);

  res.json(allHealthChecks);
};



// Get health check by ID
export const getHealthCheckById = (req, res) => {
  const healthCheckId = req.params.id;
  const allHealthChecks = dataModel.getAllData().cows.reduce((acc, cow) => {
    acc.push(...cow.health_checks);
    return acc;
  }, []);
  
  const healthCheck = allHealthChecks.find((check) => check.id === healthCheckId);

  if (healthCheck) {
    res.json(healthCheck);
  } else {
    res.status(404).json({ message: 'Health check not found' });
  }
};

export const addHealthCheck = (req, res) => {
  const newHealthCheck = req.body;
  const allData = dataModel.getAllData();
  const cows = allData.cows;

  // Find the index of the next cow that DOESN'T have a health check
  let nextCowIndex = -1;
  for (let i = 0; i < cows.length; i++) {
    if (!cows[i].health_checks || cows[i].health_checks.length === 0) {
      nextCowIndex = i;
      break;
    }
  }

  // If we didn't find a cow without a health check, start from the beginning
  if (nextCowIndex === -1) {
    nextCowIndex = 0;
  }

  // Check if all cows have health checks
  if (nextCowIndex === 0 && cows[nextCowIndex].health_checks && cows[nextCowIndex].health_checks.length > 0) {
    return res.status(200).json({ message: 'All cows have health checks.' });
  }

  const motherCow = cows[nextCowIndex];

  // Add the new health check to the mother cow's health_checks array
  if (!motherCow.health_checks) {
    motherCow.health_checks = [];
  }

  // Assign a unique ID based on the length of the health_checks array
  newHealthCheck.id = motherCow.health_checks.length + 1; 

  motherCow.health_checks.push(newHealthCheck);

  // Update the allData object with the modified cow data
  allData.cows = cows;

  saveDataToFile(allData); // Save the updated data back to the file

  res.status(201).json(newHealthCheck);
};



// Update health check by ID
export const updateHealthCheckById = (req, res) => {
  const healthCheckId = req.params.id; // Assuming the ID is passed correctly in the request URL
  const updatedHealthCheckData = req.body;

  try {
    let allData = dataModel.getAllData();
    const cows = allData.cows;

    let updated = false;

    // Loop through all cows to find and update the health check
    cows.forEach((cow) => {
      if (cow.health_checks) {
        console.log("healthCheckId:", healthCheckId); // Add this line
        const healthCheckIndex = cow.health_checks.findIndex((check) => {
          console.log("check.id:", check.id); // Add this line
          return check.id === parseInt(healthCheckId); 
        });
        if (healthCheckIndex !== -1) {
          // Update the health check's data with the new information
          cow.health_checks[healthCheckIndex] = { ...cow.health_checks[healthCheckIndex], ...updatedHealthCheckData };
          updated = true;
        }
      }
    });

    if (updated) {
      saveDataToFile(allData); // Save the updated data back to the file
      res.json({ message: 'Health check updated successfully' });
    } else {
      res.status(404).json({ message: 'Health check not found' });
    }
  } catch (error) {
    console.error('Error updating health check:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 




// delet
export const deleteHealthCheckById = (req, res) => {
  const healthCheckId = req.params.id;

  try {
    let allData = dataModel.getAllData();
    const cows = allData.cows;

    let deleted = false;

    // Loop through all cows to find and delete the health check
    cows.forEach((cow) => {
      if (cow.health_checks) {
        const healthCheckIndex = cow.health_checks.findIndex((check) => check.id === parseInt(healthCheckId));
        if (healthCheckIndex !== -1) {
          cow.health_checks.splice(healthCheckIndex, 1); // Remove the health check
          deleted = true;
        }
      }
    });

    if (deleted) {
      saveDataToFile(allData);
      res.json({ message: 'Health check deleted successfully' });
    } else {
      res.status(404).json({ message: 'Health check not found' });
    }
  } catch (error) {
    console.error('Error deleting health check:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



