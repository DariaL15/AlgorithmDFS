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
    const liczbaWierzcholkow = Math.floor(Math.random() * 3) + 7;
    const noweWierzcholki = [];
    const noweKrawedzie = [];
    const litery = "ABCDEFGHIJKLMNO";


    const minimalnyDystans = 22;

    // 2. Pętla tworząca wierzchołki
   for (let i = 0; i < liczbaWierzcholkow; i++) 
  {
    let wylosowanoPoprawnie = false;
    let nowyX = 0;
    let nowyY = 0;
    let proby = 0;


    while (!wylosowanoPoprawnie && proby < 1500) 
      {
      nowyX = Math.floor(Math.random() * 75) + 10; 
      nowyY = Math.floor(Math.random() * 75) + 10;
      proby++;

      let zaBlisko = false;

      //sprawdzamy dotychczas utworzone wierzchołki
      for (let j = 0; j < noweWierzcholki.length; j++) {
        const istniejacy = noweWierzcholki[j]; 
        const dx = nowyX - istniejacy.x;
        const dy = nowyY - istniejacy.y;
        const odleglosc = Math.sqrt(dx * dx + dy * dy);

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

  let odwiedzone = [0]; 
  
  // Pętla działa tak długo, aż połączymy w jeden ciąg wszystkie kółka
  while (odwiedzone.length < liczbaWierzcholkow) {
    const aktualnyId = odwiedzone[odwiedzone.length - 1]; // Bierzemy ostatni dodany punkt
    const start = noweWierzcholki[aktualnyId];
    
    let najblizszyId = null;
    let najmniejszyDystans = Infinity; // Na start nieskończoność, żeby każdy pierwszy wynik ją pobił

    // Szukamy kółka, które leży najbliżej na ekranie
    for (let j = 0; j < liczbaWierzcholkow; j++) {
      if (odwiedzone.includes(j)) continue; // Ignorujemy te kółka, które już są w naszym łańcuchu

      const cel = noweWierzcholki[j];
      const dx = start.x - cel.x;
      const dy = start.y - cel.y;
      const dystans = Math.sqrt(dx * dx + dy * dy); // Matematyczna odległość na ekranie

      // Jeśli znaleźliśmy kółko bliższe niż nasz dotychczasowy rekord...
      if (dystans < najmniejszyDystans) {
        najmniejszyDystans = dystans; // ...to ono staje się nowym faworytem
        najblizszyId = j;
      }
    }

    // Gdy sprawdziliśmy już wszystkie opcje i znaleźliśmy najbliższego samotnego sąsiada:
    if (najblizszyId !== null) {
      noweKrawedzie.push({
        od: aktualnyId,
        do: najblizszyId,
        status: 'normalna'
      });
      odwiedzone.push(najblizszyId); // Dodajemy go do listy, teraz z niego będziemy szukać dalej
    }
  }

  // KROK B: DODATKOWE LINIE (Tylko między bliskimi obiektami)
  // Przeglądamy każdą możliwą parę wierzchołków
  for (let i = 0; i < liczbaWierzcholkow; i++) {
    for (let j = i + 1; j < liczbaWierzcholkow; j++) {
      const start = noweWierzcholki[i];
      const cel = noweWierzcholki[j];

      const dx = start.x - cel.x;
      const dy = start.y - cel.y;
      const dystans = Math.sqrt(dx * dx + dy * dy);

      // JEŚLI leżą blisko siebie (dystans mniejszy niż 40) ORAZ rzut kostką (30%) się uda
      if (dystans < 40 && Math.random() < 0.4) {
        
        // Sprawdzamy, czy taka linia już przypadkiem nie powstała w Kroku A
        const juzIstnieje = noweKrawedzie.some(k => 
          (k.od === start.id && k.do === cel.id) || 
          (k.od === cel.id && k.do === start.id)
        );

        if (!juzIstnieje) {
          noweKrawedzie.push({
            od: start.id,
            do: cel.id,
            status: 'normalna'
          });
        }
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
        <line className='edge'
          key={index}
          x1={`${wierzcholekStart.x}%`}  /* Pobieramy wylosowany X pierwszego kółka */
          y1={`${wierzcholekStart.y}%`}  /* Pobieramy wylosowany Y pierwszego kółka */
          x2={`${wierzcholekKoniec.x}%`} /* Pobieramy wylosowany X drugiego kółka */
          y2={`${wierzcholekKoniec.y}%`} /* Pobieramy wylosowany Y drugiego kółka */
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