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
    manualFraisAchat,
    fraisAchat,
  } = req.body;
   
  // Calculate Frais d'achat
  const calculatedFraisAchat = manualFraisAchat ? fraisAchat : (purchaseAmount * 0.10);
  console.log(calculatedFraisAchat)

console.log(typeof purchaseAmount); 
console.log(typeof fraisAchat); 
console.log(typeof downPayment); 

  // Calculate Montant à emprunter Brut
  const montantEmprunterBrut = (parseInt(purchaseAmount, 10) + parseInt(calculatedFraisAchat,10)) - parseInt(downPayment, 10);
  console.log('montantEmprunterBrut', montantEmprunterBrut);

  // Calculate Montant à emprunter Net
  const fraisHypotheque = montantEmprunterBrut * 0.02;
  const montantEmprunterNet = (montantEmprunterBrut + fraisHypotheque).toFixed(2);
  console.log('Montant à emprunter Net:', montantEmprunterNet);
  
  // Convert annual interest rate to monthly
  const monthlyInterestRate = (((1 + (annualInterestRate / 100)) ** (1 / 12) - 1) * 100).toFixed(3);
  console.log('Monthly Interest Rate:', monthlyInterestRate);

  // Calculate monthly payment
  const r = monthlyInterestRate / 100;
  const n = loanDuration;
  const P = montantEmprunterNet;

  const monthlyPayment = ((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)).toFixed(2);
  console.log('Monthly Payment:', monthlyPayment);

  // Generate the amortization table
  const amortizationTable = [];
  let remainingBalance = montantEmprunterNet;

  for (let period = 1; period <= loanDuration; period++) {
    const startingBalance = remainingBalance;
    const interest = (remainingBalance * (monthlyInterestRate / 100)).toFixed(2);
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
    fraisAchat: calculatedFraisAchat,
    montantEmprunterBrut,
    montantEmprunterNet,
    monthlyPayment,
    amortizationData: amortizationTable,
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
