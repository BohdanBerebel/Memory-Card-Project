import { useEffect, useState } from "react";
import "./game.css";
import Rules from "./instruction";
export default function Game() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [record, setRecord] = useState(0);
  const [restart, setRestart] = useState(0);

  useEffect(() => {
    const fetchData = async (url) => {
      try {
        // const response = await fetch(url);
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        // const data = await response.json();
        const res = await traverse();
        console.log(res);
        setData(res);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData("https://pokeapi.co/api/v2/pokemon/");
  }, [restart]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const clickedPicts = data.filter((item) => item.clicked).length;
  if (clickedPicts === data.length)
    alert("Congrats! Refresh or change pokemons to start again!");

  function countClicked(e) {
    let clicked = false;
    let newData = data.map((item) => {
      if (e.target.id === item.name && !item.clicked) {
        return {
          ...item,
          clicked: true,
        };
      } else if (e.target.id === item.name && item.clicked) {
        clicked = true;
        return item;
      } else {
        return item;
      }
    });
    if (clicked) {
      newData = nullify(data);
      if (clickedPicts > record) setRecord(clickedPicts);
    }
    setData(shakeArr(newData));
  }
  function nullify(arr) {
    const newData = arr.map((item) => ({
      ...item,
      clicked: false,
    }));
    return newData;
  }
  return (
    <div>
      {restart === 0 && <Rules />}
      <div>
        <p>Current sequence: {clickedPicts}</p>
        <p>Record: {record}</p>
      </div>
      <div className="imgs">
        {data.map((item) => {
          return (
            <img
              key={item.name}
              src={item.front_default}
              alt={item.name}
              id={item.name}
              onClick={countClicked}
              ontouchend={countClicked}
            />
          );
        })}
      </div>
      <button
        onClick={() => {
          setRestart(restart + 1);
          setLoading(true);
        }}
      >
        Change pokemons
      </button>
    </div>
  );
}

async function traverse() {
  const ids = randomNumbers();
  const res = [];
  for (let i = 0; i < 12; i++) {
    let obj = await fetchImages(`https://pokeapi.co/api/v2/pokemon/${ids[i]}`);
    let {
      name,
      sprites: {
        other: {
          ["official-artwork"]: { front_default },
        },
      },
    } = obj;
    res.push({ name, front_default, clicked: false });
  }
  return res;
}
async function fetchImages(url) {
  let res = await fetch(url);
  res = await res.json();
  return res;
}

function randomNumbers() {
  const res = [];
  while (res.length !== 12) {
    let random = Math.floor(Math.random() * 1000);
    if (!res.includes(random)) res.push(random);
  }
  return res;
}

function shakeArr(arr) {
  const newArr = [];
  while (arr.length) {
    let random = Math.floor(Math.random() * arr.length);
    let item = arr.splice(random, 1);
    newArr.push(item[0]);
  }
  return newArr;
}
