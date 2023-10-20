const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

app.post('/calculate-amortization', (req, res) => {
  const {
    purchaseAmount,
    downPayment,
    loanDuration,
    annualInterestRate,
  } = req.body;

  // Calculate Frais d'achat
  const fraisAchat = purchaseAmount > 50000 ? purchaseAmount * 0.10 : 0;

  // Calculate Montant à emprunter Brut
  const montantEmprunterBrut = purchaseAmount *1.1 - downPayment;
console.log('montantEmprunterBrut',montantEmprunterBrut)
  // Calculate Montant à emprunter Net
  const fraisHypotheque = montantEmprunterBrut * 0.02;
  const montantEmprunterNet = (montantEmprunterBrut + fraisHypotheque).toFixed(2);
  console.log('Montant à emprunter Net:', montantEmprunterNet);
  // Convert annual interest rate to monthly 
  const monthlyInterestRate = (((1 + (annualInterestRate/100)) ** ((1 / 12))-1)*100).toFixed(3);
  console.log('Monthly Interest Rate:', monthlyInterestRate);

  // Calculate the correct monthly payment
const r = monthlyInterestRate / 100; 
const n = loanDuration;
const P = montantEmprunterNet;

const monthlyPayment = ((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)).toFixed(2);

  console.log('Monthly Payment:', monthlyPayment);

  // Generate the amortization table
  const amortizationTable = [];
  let remainingBalance = montantEmprunterNet;

  for (let period = 1; period <= loanDuration; period++) {
    const startingBalance = remainingBalance
    const interest = (remainingBalance * (monthlyInterestRate/100)).toFixed(2);
    const principal = (monthlyPayment - interest).toFixed(2);
    remainingBalance = (remainingBalance - principal).toFixed(2);

    amortizationTable.push({
      Period: period,
      StartingBalance: startingBalance,
      MonthlyPayment: monthlyPayment,
      Interest: interest,
      Principal: principal,
      EndingBalance: remainingBalance,
    });
  }

  res.json({
    fraisAchat,
    montantEmprunterBrut,
    montantEmprunterNet,
    monthlyPayment,
    amortizationData: amortizationTable, 
  });
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});