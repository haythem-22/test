import React, { useState } from 'react';
import axios from 'axios';
import './AmortizationCalculator.css';

function AmortizationCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [loanDuration, setLoanDuration] = useState(0);
  const [annualInterestRate, setAnnualInterestRate] = useState(0);
  const [amortizationData, setAmortizationData] = useState([]);
  const [montantEmprunterNet, setMontantEmprunterNet] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const handleCalculateAmortization = () => {
    if (
      isNaN(purchaseAmount) ||
      isNaN(downPayment) ||
      isNaN(loanDuration) ||
      isNaN(annualInterestRate) ||
      purchaseAmount <= 0 ||
      downPayment <= 0 ||
      loanDuration <= 0 ||
      annualInterestRate <= 0
    ) {
      alert('Please enter valid numeric values greater than 0 for all inputs.');
      return;
    }
  
    const data = {
      purchaseAmount,
      downPayment,
      loanDuration,
      annualInterestRate,
    };
  
    axios
      .post('http://localhost:3001/calculate-amortization', data)
      .then((response) => {
        setMontantEmprunterNet(response.data.montantEmprunterNet);
        setMonthlyPayment(response.data.monthlyPayment);
        setAmortizationData(response.data.amortizationData);
      })
      .catch((error) => {
        console.error('Error fetching amortization data:', error);
      });
  };

  return (
    <div className="loan-calculator-container">
      <h1>Amortization Calculator</h1>
      <div className="form-item">
        <label>Montant de l'achat:</label>
        <input
          type="number"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
        />
      </div>
      <div className="form-item">
        <label>Fonds propres:</label>
        <input
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
        />
      </div>
      <div className="form-item">
        <label>Durée(mois):</label>
        <input
          type="number"
          value={loanDuration}
          onChange={(e) => setLoanDuration(e.target.value)}
        />
      </div>
      <div className="form-item">
        <label>Taux d'intérêt annuel (%):</label>
        <input
          type="number"
          value={annualInterestRate}
          onChange={(e) => setAnnualInterestRate(e.target.value)}
        />
      </div>
      <button onClick={handleCalculateAmortization}>Calculate Amortization</button>


      <div>
  <p>Montant à Emprunter Net: {montantEmprunterNet}</p>
  <p>Monthly Payment: {monthlyPayment}</p>
</div>
      {amortizationData.length > 0 && (
        <div className="amortization-table-container">
          <h2>Amortization Schedule</h2>
          <table className="amortization-table">
            <thead>
              <tr>
                <th>Période</th>
                <th>Solde début</th>
                <th>Mensualité</th>
                <th>Intérêt</th>
                <th>Capital remboursé</th>
                <th>Solde fin</th>
              </tr>
            </thead>
            <tbody>
              {amortizationData.map((row, index) => (
                <tr key={index}>
                  <td>{row.Period}</td>
                  <td>{row.StartingBalance}</td>
                  <td>{row.MonthlyPayment}</td>
                  <td>{row.Interest}</td>
                  <td>{row.Principal}</td>
                  <td>{row.EndingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AmortizationCalculator;
