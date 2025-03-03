import { useState } from "react";

export default function Rolling() {
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [diceResult, setDiceResult] = useState(null);
  const [message, setMessage] = useState("");

  const rollDice = async () => {
    if (betAmount <= 0 || betAmount > balance) {
      setMessage("Invalid Bet Amount");
      return;
    }

    try {
      const response = await fetch(https://rolling-backend-jwuu.onrender.com/rolling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ betAmount }),
      });

      const data = await response.json(); // ✅ Fix: Await JSON response

      if (data.error) {
        setMessage(data.error);
      } else {
        setDiceResult({ roll: data.roll, hash: data.hash }); // ✅ Fix: Correct data reference
        setBalance(data.balance);
        setMessage(
          data.win
            ? `You rolled ${data.roll}! You win! 🎉`
            : `You rolled ${data.roll}. You lose. 😢`
        );
      }
    } catch (error) {
      setMessage("Server error! Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg w-2/3">
        <h2 className="text-center text-xl mb-4">Provably Fair Dice Game 🎲</h2>

        <div className="mt-4">
          <p>Balance: ${balance}</p>
          <p>Bet Amount</p>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
        </div>

        <button
          className="w-full bg-green-500 p-3 rounded mt-4"
          onClick={rollDice}
        >
          Roll Dice 🎲
        </button>

        {diceResult && (
          <div className="mt-4 p-3 bg-gray-700 text-center rounded">
            <p>Dice Roll: {diceResult.roll}</p>
            <p>Hash: {diceResult.hash}</p>
            <p
              className={
                diceResult.roll >= 4 ? "text-green-400" : "text-red-400"
              }
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
