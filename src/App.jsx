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

const [stos, setStos] = useState([]); // Nasz stos DFS (będziemy tu trzymać ID wierzchołków)
const [czyUruchomiony, setCzyUruchomiony] = useState(false);
const [czySkierowany, setCzySkierowany] = useState(false);

function generujGraf(typ) { 

  setCzySkierowany(typ);
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


function nastepnyKrok() {
  if (wierzcholki.length === 0) return;

  if (!czyUruchomiony) {
    
    const startowyId = wierzcholki[0].id; 
    const nowyCzas = 1;

    const zaktualizowaneWierzcholki = wierzcholki.map((w) => {
      if (w.id === startowyId) {
        return { ...w, status: 'badany', d: 1 }; // d to czas odwiedzenia
      }
      return w;
    });

    // Zwiększamy czas o 1
    setCzas(1);
    // Wrzucamy wierzchołek startowy na nasz stos
    setStos([startowyId]);
    // Zapisujemy zaktualizowane wierzchołki do pamięci
    setWierzcholki(zaktualizowaneWierzcholki);
    setCzyUruchomiony(true);

    return; 
  }

  // 1. Jeśli stos opustoszeje, oznacza to, że algorytm sprawdził już wszystko
  if (stos.length === 0) {
    alert("Algorytm DFS zakończył działanie");
    setCzyUruchomiony(false);
    return;
  }

  // 2. Podglądamy, jaki wierzchołek leży na samej górze stosu (nasz aktualny wierzchołek 'v')
  const aktualnyId = stos[stos.length - 1];

  // 3. Tworzymy pudełko na ID sąsiada, którego za chwilę spróbujemy znaleźć
  let bialySasiadId = null;

  // 4. Przeglądamy wszystkie krawędzie w grafie, żeby znaleźć połączenia z 'aktualnyId'
  for (let i = 0; i < krawedzie.length; i++) {
    const kr = krawedzie[i];
    let potencjalnySasiadId = null;

    // Ponieważ krawędzie nie mają strzałek (są dwukierunkowe), sprawdzamy oba końce linii
    if (kr.od === aktualnyId) {
      potencjalnySasiadId = kr.do;
    }
    else if (!czySkierowany && kr.do === aktualnyId) {
      potencjalnySasiadId = kr.od;
    }

    // Jeśli znaleźliśmy wierzchołek połączony linią, sprawdzamy czy jest BIAŁY (nieodwiedzony)
    if (potencjalnySasiadId !== null) {
      const sasiad = wierzcholki.find(w => w.id === potencjalnySasiadId);
      
      // Odpowiednik z Twojego pseudokodu: "if kolor[u] = BIAŁY"
      if (sasiad && sasiad.status === 'nieodwiedzony') {
        bialySasiadId = potencjalnySasiadId;
        break; // Znaleźliśmy pierwszego wolnego sąsiada! Przerywamy pętlę for, żeby iść do niego
      }
    }
  }

  // 5. Każda akcja w algorytmie przesuwa zegar do przodu (czas := czas + 1)
  const kolejnyCzas = czas + 1;
  setCzas(kolejnyCzas);

  // 6. SCENARIUSZ: Jeśli znaleźliśmy białego sąsiada, odwiedzamy go (Wchodzimy w głąb)
  if (bialySasiadId !== null) {
    const zaktualizowane = wierzcholki.map((w) => {
      // Odpowiednik z Twojego pseudokodu: kolor[u] := SZARY oraz odwiedzenie[u] := czas
      if (w.id === bialySasiadId) {
        return { ...w, status: 'badany', d: kolejnyCzas };
      }
      return w;
    });

    // Wrzucamy go na górę stosu – w następnym kroku on będzie szukał swoich sąsiadów
    setStos([...stos, bialySasiadId]);
    setWierzcholki(zaktualizowane);
  } else {
    const zaktualizowane = wierzcholki.map((w) => {
      // Pseudokod: kolor[v] := CZARNY oraz przetworzenie[v] := czas
      if (w.id === aktualnyId) {
        return { ...w, status: 'przetworzony', f: kolejnyCzas };
      }
      return w;
    });

    // Zdejmujemy wierzchołek z samej góry stosu (obcinamy ostatni element tablicy)
    setStos(stos.slice(0, -1));
    setWierzcholki(zaktualizowane);
  }
  
}

return (
<div className='contener-glowny'>
<header>
  <div className='tytul'>
  <h1>Algorytm DFS</h1>
  </div>
  <div className='wylosuj'>
      <h2>Losuj:</h2>
      <div className='przyciski'>
        <button onClick={() => generujGraf(false)} disabled={czyUruchomiony}>Nieskierowany</button> 
        <button onClick={() => generujGraf(true)} disabled={czyUruchomiony}>Skierowany</button> 
      </div>
    </div>
</header>

<main className='content'>

  <section className='contener-lewy'>
      <div className='wylosowany-graf'>
        <h2>Wylosowany GRAF</h2>
      </div>


      <div className='graf'>
      <div className='status-bar'>
         <div className='obecny-czas'>
            <p>Aktualny czas:  {czas}</p>
          </div>
{/*
         <div className='obecny-wierzcholek'>
           <p>Obecnie sprawdzany wierzchołek: </p>
        </div> */}
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
          <defs>
            <marker id="strzalka" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
            </marker>
          </defs>


      {krawedzie.map((krawedz, index) => {
      const wierzcholekStart = wierzcholki.find(w => w.id === krawedz.od);
      const wierzcholekKoniec = wierzcholki.find(w => w.id === krawedz.do);

      /* Zabezpieczenie: jeśli graf się jeszcze nie wylosował, nie rysuj nic */
      if (!wierzcholekStart || !wierzcholekKoniec) return null;
      

      return (
        <line className='edge'
          markerEnd={czySkierowany ? "url(#strzalka)" : undefined}
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
    {stos.map((idWierzcholka) => {
      const wierzcholek = wierzcholki.find(w => w.id === idWierzcholka);
      return (
        <div key={idWierzcholka} className="node badany" style={{ position: 'relative', transform: 'none', left: 0, top: 0 }}>
          {wierzcholek?.label}
        </div>
      );
    })}
  </div>
      </div>

       </div>
  </section>



  <section className='contener-prawy'>

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
        <button onClick={nastepnyKrok}>Następny krok</button>
      </div>



  </section>

</main>



</div>
);


};

export default App;