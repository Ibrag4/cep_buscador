import { useState, useEffect } from 'react';
import { IoSearchSharp } from "react-icons/io5";
import './styles.css';
import api from './services/api';

function App() {

  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  function formatCep(value) {
    return value.replace(/\D/g, '') // Remove caracteres não numéricos
                .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona hífen após 5 dígitos
                .slice(0, 9); // Limita o comprimento a 9 caracteres
  }

  const handleInputChange = (e) => {
    const formattedCep = formatCep(e.target.value);
    setInput(formattedCep);
  };

  async function handleSearch() {
    if (input === '') {
      setError("Preencha algum cep");
      setShowError(true);
      return;
    }

    try {
      const response = await api.get(`${input.replace('-', '')}/json`);
      if (response.data.erro) {
        setError("CEP inválido");
        setCep({});
        setShowError(true);
      } else {
        setCep(response.data);
        setError('');
        setShowError(false);
      }
      setInput('');
    } catch {
      setError('Erro ao buscar o CEP');
      setShowError(true);
      setInput('');
      setCep({});
    }
  }

  const handleClear = () => {
    setInput('');
    setCep({});
    setError('');
    setShowError(false);
  };

  useEffect(() => {
    if (showError) {
      const hideTimer = setTimeout(() => {
        setShowError(false);
      }, 4500); // Esconder a mensagem após 4.5 segundos

      const clearTimer = setTimeout(() => {
        setError('');
      }, 5000); // Limpar a mensagem após 5 segundos

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [showError]);

  return (
    <div className="container">
      <h1 className="title">CEP Buscador</h1>
      <div className="containerInput">
        <input 
          type="text"
          placeholder="Digite seu cep"
          value={input}
          onChange={handleInputChange}
        />
       
        <button className="buttonSearch" onClick={handleSearch}>
          <IoSearchSharp size={35} color="white" />
        </button>
      </div>
      {error && <div className={`errorBox ${showError ? 'show' : 'hide'}`}>{error}</div>}
      {Object.keys(cep).length > 0 && (
        <main className="main">
          <h2>CEP: {cep.cep}</h2>
          <span>{cep.logradouro}</span>
          <span>Complemento: {cep.complemento}</span>
          <span>{cep.bairro}</span>
          <span>{cep.localidade} - {cep.uf}</span>
          <button className="buttonClear" onClick={handleClear}>
            Limpar
          </button>
        </main>  
      )}
    </div>
  );
}

export default App;
