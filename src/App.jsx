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
    const liczbaWierzcholkow = Math.floor(Math.random() * 4) + 6;
    const noweWierzcholki = [];
    const noweKrawedzie = [];
    const litery = "ABCDEFGHIJKLMNO";


    const minimalnyDystans = 30;

    // 2. Pętla tworząca wierzchołki
   for (let i = 0; i < liczbaWierzcholkow; i++) 
  {
    let wylosowanoPoprawnie = false;
    let nowyX = 0;
    let nowyY = 0;
    let proby = 0;


    while (!wylosowanoPoprawnie && proby < 100) 
      {
      nowyX = Math.floor(Math.random() * 90) + 5; 
      nowyY = Math.floor(Math.random() * 90) + 5;
      proby++;

      let zaBlisko = false;

      //sprawdzamy dotychczas utworzone wierzchołki
      for (let j = 0; j < noweWierzcholki.length; j++) {
        const istniejacy = noweWierzcholki[j];
        const dx = nowyX - istniejacy.x;
        const dy = nowyY - istniejacy.y;
        const odleglosc = Math.sqrt(dx * dx + dy * dy);

        // Jeśli odległość jest mniejsza niż nasz limit, to miejsce odpada
        if (odleglosc < minimalnyDystans) {
        zaBlisko = true;
        break; 
        }
      }
    
        if (!zaBlisko) {
        wylosowanoPoprawnie = true;
        }
      }

    noweWierzcholki.push({
      id: i,
      label: litery[i],
      x: nowyX, 
      y: nowyY,
      status: 'nieodwiedzony'
    });
  }

  for (let i = 0; i < liczbaWierzcholkow; i++) {
  for (let j = i + 1; j < liczbaWierzcholkow; j++) {
    // ustawiamy szansę na połączenie 
    if (Math.random() < 0.3) {
      noweKrawedzie.push({
        od: i,
        do: j,
        status: 'normalna'
      });
    }
    
  }
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
            <svg style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }}>
            {/* KROK 2: Przeglądamy wszystkie krawędzie z pamięci komputera */}
    {krawedzie.map((krawedz, index) => {
      
      /* DETEKTYW KROK A: Szukamy kółka, od którego linia ma ODchodzić */
      const wierzcholekStart = wierzcholki.find(w => w.id === krawedz.od);
      
      /* DETEKTYW KROK B: Szukamy kółka, DO którego linia ma DOchodzić */
      const wierzcholekKoniec = wierzcholki.find(w => w.id === krawedz.do);

      /* Zabezpieczenie: jeśli graf się jeszcze nie wylosował, nie rysuj nic */
      if (!wierzcholekStart || !wierzcholekKoniec) return null;

      /* KROK 3: Skoro mamy już oba kółka, wyciągamy z nich procenty x i y i rysujemy! */
      return (
        <line
          key={index}
          x1={`${wierzcholekStart.x}%`}  /* Pobieramy wylosowany X pierwszego kółka */
          y1={`${wierzcholekStart.y}%`}  /* Pobieramy wylosowany Y pierwszego kółka */
          x2={`${wierzcholekKoniec.x}%`} /* Pobieramy wylosowany X drugiego kółka */
          y2={`${wierzcholekKoniec.y}%`} /* Pobieramy wylosowany Y drugiego kółka */
          stroke="white"                 /* Ustalamy kolor linii */
          strokeWidth="2"                /* Ustalamy grubość linii */
        />
      );
    })}
            </svg>
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