import "./instruction.css";
export default function Rules() {
  function hide() {
    let button = document.querySelector(".start");
    button.style.display = "none";

    console.dir(button);
  }
  return (
    <div className="start">
      <p>To win you should choose pictures not chosen before. </p>
      <button onClick={hide}>Get it!</button>
    </div>
  );
}
