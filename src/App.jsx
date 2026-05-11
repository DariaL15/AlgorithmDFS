import { useState } from 'react'
import './index.css'

function App() {
  const [nodes, setNodes] = useState([]);
  const [czas, setCzas] = useState(0);
  const [stos, setStos] = useState([]);

  noweNodes.forEach(node => {
      const mozliwiSasiedzi = noweNodes.filter(n => n.id !== node.id);
      const wylosowani = mozliwiSasiedzi
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 1);
      node.sasiedzi = wylosowani.map(n => n.id);
    });

    setNodes(noweNodes);
    setCzas(0);
    setStos([1]); // Zaczynamy od wierzchołka nr 1
  };


