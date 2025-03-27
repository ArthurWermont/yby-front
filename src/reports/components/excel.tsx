import React from 'react';
import * as XLSX from 'xlsx';

const GenerateExcel = () => {
  // Dados para exportar
  const dados = [
    { nome: 'João', idade: 25, cidade: 'São Paulo' },
    { nome: 'Maria', idade: 30, cidade: 'Rio de Janeiro' },
    { nome: 'Pedro', idade: 22, cidade: 'Belo Horizonte' }
  ];

  // Função para exportar os dados para Excel
  const exportarParaExcel = () => {
    // Criar uma planilha a partir dos dados
    const ws = XLSX.utils.json_to_sheet(dados);

    // Criar um arquivo de Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');

    // Exportar o arquivo Excel com o nome "dados.xlsx"
    XLSX.writeFile(wb, 'dados.xlsx');
  };

  return (
    <div>
      <button onClick={exportarParaExcel}>Exportar para Excel</button>
    </div>
  );
};

export default GenerateExcel;