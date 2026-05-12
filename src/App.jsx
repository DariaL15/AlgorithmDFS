import { useState } from 'react'
import './index.css'

function App() {
return (
<div className='contener-glowny'>
<header>
  <h1>Algorytm DFS</h1>
</header>

<main className='content'>

  <section className='contener-lewy'>
    <h2>Wylosowany GRAF</h2>

      <div className='status-bar'>
         <div className='obecny-czas'>
            <p>Czas odwiedzenia: </p>
          </div>

         <div className='obecny-wierzcholek'>
           <p>Obecnie sprawdzany wierzchołek: </p>
        </div>
      </div>
 
      <div className="graph-container">

      </div>

      <div className='aktualny-stos'>
        <h2>Aktualny stos:</h2>
      </div>
  </section>

  <section className='contener-prawy'>
      <div className='przyciski'>
        <button>Reset</button>
        <button>Losuj graf</button> 
      </div>

      <div className='tabela'>
        <h2>Tabela czasów:</h2>
      </div>

      <div className='nastepny-krok'>
        <button>Następny krok:</button>
      </div>



  </section>

</main>



</div>
);



};


export default App;