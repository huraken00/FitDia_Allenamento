// src/components/GraficoProgressi.jsx
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
  } from "recharts";
  
  const GraficoProgressi = ({ dati, parametro, nomeEsercizio }) => {
    if (!parametro || dati.length === 0) return null;
  
    return (
      <div style={{ marginTop: "2rem" }}>
        <h3>📈 Progressi di {nomeEsercizio} - {parametro}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dati}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={parametro}
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default GraficoProgressi;
  