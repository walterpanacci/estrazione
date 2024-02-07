import { useEffect, useState } from "react";
import "./App.css";

function InputField({ numExtract, onExtract, onShowExtract }) {
  function handleSubmit(e) {
    e.preventDefault();
    onShowExtract(true);
  }
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          className="input-field"
          value={numExtract}
          onChange={(e) => onExtract(+e.target.value)}
          type="number"
          min="2"
        />
        <button>Estrai</button>
      </form>
    </>
  );
}

function StudentBox({ num }) {
  const [array, setArray] = useState(Array.from({ length: num }, (el) => 1));
  const [allExtracted, setAllExtracted] = useState(false);
  const [dog, setDog] = useState("");
  const [extracted, setExtracted] = useState("");
  async function handleExtraction() {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");

    const data = await res.json();
    setDog(data.message);
    const max = array.length - 1;
    if (array.every((el) => el !== 1)) {
      setAllExtracted(true);
      return;
    }
    let x = Math.round(Math.random() * max);
    while (array[x] !== 1) {
      x = Math.round(Math.random() * max);
    }
    setArray((arr) => arr.map((el, i) => (i === x ? 0 : el)));
    if (array.every((el) => el !== 1)) setAllExtracted(true);
    setExtracted(x);
  }

  useEffect(
    function () {
      if (array.some((el) => el === 1)) {
        setAllExtracted(false);
      }
    },
    [array, setAllExtracted]
  );

  return (
    <div className="container">
      <div className="extraction-container">
        <p>
          Clicca su un elemento per escluderlo dall'estrazione; cliccaci sopra
          due volte per includerlo nuovamente
        </p>
        {Array.from({ length: num }, (_, i) => 1).map((el, i) => (
          <Student key={i} num={i + 1} array={array} onArray={setArray} />
        ))}
        {extracted && (
          <p>
            Ultimo numero estratto:
            <span className="last-extracted"> {extracted + 1}</span>
          </p>
        )}
        {!allExtracted ? (
          <Button onClick={handleExtraction}>Estrai</Button>
        ) : (
          <p>Sono già stati estratti tutti i numeri!! 😩</p>
        )}
      </div>
      {dog && <img className="dog" src={dog} alt="Un cane" />}
    </div>
  );
}

function Student({ num, array, onArray }) {
  function handleClick() {
    onArray((arr) =>
      arr.map((el, i) => (i === num - 1 ? (el !== -1 ? -1 : 1) : el))
    );
  }
  return (
    <div
      className={`student ${array[num - 1] === -1 && "excluded"} ${
        array[num - 1] === 0 && "extracted"
      }`}
      onClick={handleClick}
    >
      {num}
    </div>
  );
}

function Button({ onClick, children }) {
  return <button onClick={() => onClick(false)}>{children}</button>;
}

function App() {
  const [numExtract, setNumExtract] = useState(true);
  const [showExtract, setShowExtract] = useState(false);
  function reset() {
    setShowExtract(false);
    setNumExtract(true);
  }
  return (
    <div>
      {!showExtract && (
        <InputField
          onShowExtract={setShowExtract}
          numExtract={numExtract}
          onExtract={setNumExtract}
        />
      )}
      {showExtract && (
        <>
          <StudentBox num={numExtract} />
          <Button onClick={reset}>Reset</Button>
        </>
      )}
    </div>
  );
}

export default App;
