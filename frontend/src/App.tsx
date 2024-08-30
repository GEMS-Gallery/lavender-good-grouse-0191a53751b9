import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '300px',
  width: '100%',
  backgroundColor: '#ffffff',
}))

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}))

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperationClick = (op: string) => {
    setFirstOperand(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const handleEquals = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        setDisplay(result.toString());
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
      setFirstOperand(null);
      setOperation(null);
    }
  };

  return (
    <CalculatorPaper elevation={3}>
      <TextField
        fullWidth
        variant="outlined"
        value={display}
        InputProps={{
          readOnly: true,
          style: { fontSize: '1.5rem', textAlign: 'right' }
        }}
        margin="normal"
      />
      <Grid container spacing={1}>
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
          <Grid item xs={3} key={btn}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color={['/', '*', '-', '+'].includes(btn) ? 'secondary' : btn === '=' ? 'error' : 'primary'}
              onClick={() => {
                if (btn === '=') handleEquals();
                else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                else handleNumberClick(btn);
              }}
              disabled={loading}
            >
              {btn}
            </CalculatorButton>
          </Grid>
        ))}
        <Grid item xs={12}>
          <CalculatorButton
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </CalculatorButton>
        </Grid>
      </Grid>
      {loading && (
        <div className="flex justify-center mt-4">
          <CircularProgress />
        </div>
      )}
    </CalculatorPaper>
  );
};

export default App;
