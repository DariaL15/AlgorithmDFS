import { useState } from 'react'
import './index.css'

function App() {


  // To są nasze stany (pudełka na dane)
const [wierzcholki, setWierzcholki] = useState([
  // Przykład: { id: 0, label: 'A', x: 25, y: 30, status: 'nieodwiedzony' }
]);
const [krawedzie, setKrawedzie] = useState([
  // Przykład: { od: 0, do: 1, status: 'normalna' }
]);
const [czas, setCzas] = useState(0);

function generujGraf() { 
    // Math.floor(Math.random() * (max - min + 1)) + min;
    const liczbaWierzcholkow = Math.floor(Math.random() * 6) + 6;
    const noweWierzcholki = [];
    const noweKrawedzie = [];
    const litery = "ABCDEFGHIJKLMNO";



    // 2. Pętla tworząca wierzchołki
   for (let i = 0; i < liczbaWierzcholkow; i++) 
  {
    noweWierzcholki.push({
      id: i,
      label: litery[i],
      // Losujemy pozycję od 10% do 90%, żeby nie dotykały krawędzi
      x: Math.floor(Math.random() * 80) + 10, 
      y: Math.floor(Math.random() * 80) + 10,
      status: 'nieodwiedzony'
    });
  }

    for (let i = 0; i < liczbaWierzcholkow - 1; i++)
    {
      noweKrawedzie.push({
        od: i,
        do: i + 1,
        status: 'normalna'
      });
    }

    
  setWierzcholki(noweWierzcholki);
  setKrawedzie(noweKrawedzie);
}


return (
<div className='contener-glowny'>
<header>
  <h1>Algorytm DFS</h1>
</header>

<main className='content'>

  <section className='contener-lewy'>
      <div className='wylosowany-graf'>
        <h2>Wylosowany GRAF</h2>
      </div>


      <div className='graf'>
      <div className='status-bar'>
         <div className='obecny-czas'>
            <p>Aktualny czas: </p>
          </div>

         <div className='obecny-wierzcholek'>
           <p>Obecnie sprawdzany wierzchołek: </p>
        </div>
      </div>
 
      <div className="graph-container">
            {wierzcholki.map((node) => (
              <div 
                key={node.id} 
                className={`node ${node.status}`} 
                style={{ position: 'absolute', left: `${node.x}%`, top: `${node.y}%` }}>
               {node.label} {/*label to literka*/}
             </div>
            ))}
      </div>

      <div className='aktualny-stos'>
        <h2>Aktualny stos:</h2>
         <div className='stos'>
         </div>
      </div>

       </div>
  </section>

  <section className='contener-prawy'>
      <div className='przyciski'>
        <button>Reset</button>
        <button onClick={generujGraf}>Losuj graf</button> 
      </div>

      <div className='tabela'>
        <h2>Tabela czasów:</h2>
        <table className='tabelka'>
          <thead>
              <tr> {/*tr to cała linia (poziom)*/}
                <th>Wierzchołek</th> {/*th (Table Header) to tytuł kolumny (pion).*/}
                <th>Czas odwiedzenia</th> 
                <th>Czas przetworzenia</th>
              </tr>
          </thead>

          <tbody>
              {/*td (Table Data) to zawartość (to, co wpadnie do środka tabeli później).*/}
              {wierzcholki.map((node) => (
               <tr key={node.id}>
                 <td>{node.label}</td>
                 <td>{node.d || '-'}</td> 
                 <td>{node.f || '-'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className='nastepny-krok'>
        <button>Następny krok</button>
      </div>



  </section>

</main>



</div>
);



};


export default App;