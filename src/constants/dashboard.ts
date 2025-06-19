const fuelByCenter  = [
    {key: 'Center.name', title: 'Center'},
    {key: '$amount', title: 'Amount'},
    {key: '#ltrs', title: 'Liters'},
    {key: '#kms', title: 'Total KMs'},
];

const fuelList = [
    {key: 'Vehicle.registrationNumber', title: 'Vehicle'},
    {key: 'User.name', title: 'User'},
    {key: 'quantity', title: 'Quantity'},
    {key: 'odometer', title: 'Odometer'},
    // {key: 'odometerStart', title: ''},
    {key: 'date', title: 'Date'},
    {key: '@createdAt', title: 'Created At'},
    {key: 'FuelReceipt.receiptUrl', title: 'Receipt', isUrl: true},
]

const fuelByStation = [
    {key: 'FuelingStation.name', title: 'Fuel Station'},
    {key: '$amount', title: 'Amount'},
    {key: '#ltrs', title: 'Liters'},
    {key: '#kms', title: 'Total KMs'},

];


const leakageByVehicle = [
    {key: 'Vehicle.registrationNumber', title: 'Vehicle'},
    {key:'Center.name', title: 'Center'},
    {key:'#kms', title: 'Total Km'},
    {key:'#fuelQuantity', title: 'Fuel Qty'},
    // {key:'expectedAvg', title: 'Expected Qty'},
    {key:'$avgFuelPrice', title: 'Avg Fuel Price'},
    {key:'#Vehicle.expectedAvg', title: 'Expected Avg'},
    {key:'#actualAvg', title: 'Actual Avg'},
    {key:'#difference', title: 'Difference'},
    // {key:'amountDifference', title: 'Amount Difference'},  
];

const dailyKmByCenter = [
    {key: 'Center.name', title: 'Center'},
    {key: '#totalKms', title: 'Total Odometer'},
]

const leakageByCenter = [
    {key: 'center_name', title: 'Center'},
    {key: 'date', title: 'Date'},
    {key: 'fuel_station_name', title: 'Fuel Station'},
    {key: '$total_leakage_amount', title: 'Total Leakage Amount'},
    {key: '#total_leakage_liters', title: 'Total Leakage Liters'},
]

export default {
    dailyKmByCenter,
    fuelByStation,
    fuelByCenter,
    leakageByVehicle,
    leakageByCenter,
    fuelList
}