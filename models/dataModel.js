// dataModel.js
import cowsData from '../data/cowsData.json' assert { type: "json" };

const dataModel = {
  getAllData: () => {
    return cowsData;
  },
  getAllHealthChecks: () => {
    return cowsData.reduce((acc, cow) => {
      acc.push(...cow.health_checks);
      return acc;
    }, []);
  },
  getAllCalves: () => {
    return cowsData.reduce((acc, cow) => {
      acc.push(...cow.calves);
      return acc;
    }, []);
  },
  getAllMilkProduction: () => {
    return cowsData.reduce((acc, cow) => {
      acc.push(...cow.milk_production);
      return acc;
    }, []);
  }
};

export default dataModel;