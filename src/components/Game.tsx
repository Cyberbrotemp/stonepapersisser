import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { jsPDF } from 'jspdf';
import { Trophy, Crown, Notebook as Robot, Users } from 'lucide-react';

const choices = {
  rock: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvlGe4Qikf5_g1ha0Hx9u88B04qiz-mRLn5g&s',
  scissors: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmZibIQhkhFF-ReJ0vmtxuYz2_baWbM3FKPQ&s',
  paper: 'https://media.tenor.com/MSPtDSAWTA4AAAAM/paper-plane-flying-original.gif'
};

export default function Game() {
  const {
    currentUser,
    gameMode,
    setGameMode,
    targetPoints,
    setTargetPoints,
    playerOneChoice,
    playerTwoChoice,
    setPlayerChoice,
    scores,
    updateScores,
    resetGame,
    addToHistory
  } = useStore();

  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showCPUChoice, setShowCPUChoice] = useState(false);
  const [showModeAlert, setShowModeAlert] = useState(true);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleChoice = (choice: string, player: 'one' | 'two') => {
    setPlayerChoice(player, choice);
    setIsShaking(true);
    
    if (gameMode === 'cpu' && player === 'one') {
      const cpuChoice = Object.keys(choices)[Math.floor(Math.random() * 3)];
      setShowCPUChoice(true);
      setTimeout(() => {
        setPlayerChoice('two', cpuChoice);
        setShowCPUChoice(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (playerOneChoice && playerTwoChoice) {
      setTimeout(() => {
        setIsShaking(false);
        const result = determineWinner(playerOneChoice, playerTwoChoice);
        setResult(result);
        speak(`${result === 'tie' ? "It's a tie!" : `${result} wins!`}`);
        
        if (result !== 'tie') {
          updateScores(result === 'Player One' ? 'one' : 'two');
        }
        
        if (scores.playerOne >= targetPoints || scores.playerTwo >= targetPoints) {
          const winner = scores.playerOne > scores.playerTwo ? 'Player One' : 'Player Two';
          addToHistory({
            date: new Date().toISOString(),
            winner,
            score: `${scores.playerOne}-${scores.playerTwo}`
          });
          setTimeout(resetGame, 2000);
        } else {
          setTimeout(() => {
            setPlayerChoice('one', null);
            setPlayerChoice('two', null);
            setResult(null);
          }, 2000);
        }
      }, 2000);
    }
  }, [playerOneChoice, playerTwoChoice]);

  const determineWinner = (choice1: string, choice2: string) => {
    if (choice1 === choice2) return 'tie';
    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'paper' && choice2 === 'rock') ||
      (choice1 === 'scissors' && choice2 === 'paper')
    ) {
      return 'Player One';
    }
    return 'Player Two';
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Game Summary', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Player: ${currentUser?.name}`, 20, 40);
    doc.text(`Target Points: ${targetPoints}`, 20, 50);
    doc.text(`Final Score: ${scores.playerOne}-${scores.playerTwo}`, 20, 60);
    
    if (currentUser?.profilePicture) {
      doc.addImage(currentUser.profilePicture, 'JPEG', 150, 20, 40, 40);
    }
    
    doc.save('game-summary.pdf');
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
        {showModeAlert && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto text-center">
              <h3 className="text-xl font-bold mb-4">Welcome to Rock Paper Scissors!</h3>
              <p className="mb-4">Please select your game mode to begin playing.</p>
              <button
                onClick={() => setShowModeAlert(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Select Game Mode</h2>
          <div className="space-y-4">
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg flex items-center justify-center space-x-3 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
              onClick={() => setGameMode('cpu')}
            >
              <Robot className="w-6 h-6" />
              <span className="text-lg font-semibold">vs CPU</span>
            </button>
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg flex items-center justify-center space-x-3 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
              onClick={() => setGameMode('player')}
            >
              <Users className="w-6 h-6" />
              <span className="text-lg font-semibold">vs Player</span>
            </button>
          </div>
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Points:
            </label>
            <input
              type="number"
              min="1"
              value={targetPoints || 10}
              onChange={(e) => setTargetPoints(Number(e.target.value) || 10)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            {currentUser?.profilePicture && (
              <div className="relative">
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-indigo-500 animate-pulse"
                />
                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
              </div>
            )}
            <div>
              <span className="font-bold text-lg">{currentUser?.name}</span>
              <div className="text-sm text-gray-600">
                Playing vs {gameMode === 'cpu' ? 'CPU' : 'Player'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
              {scores.playerOne} - {scores.playerTwo}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-center">Player One</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(choices).map(([choice, image]) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice, 'one')}
                disabled={!!playerOneChoice}
                className={`p-4 border rounded-lg transform transition-all ${
                  playerOneChoice === choice ? 'border-blue-500 scale-110' : ''
                } ${isShaking ? 'animate-shake' : ''} hover:scale-105`}
              >
                <img src={image} alt={choice} className="w-20 h-20 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {gameMode === 'player' ? (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-center">Player Two</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(choices).map(([choice, image]) => (
                <button
                  key={choice}
                  onClick={() => handleChoice(choice, 'two')}
                  disabled={!playerOneChoice || !!playerTwoChoice}
                  className={`p-4 border rounded-lg transform transition-all ${
                    playerTwoChoice === choice ? 'border-green-500 scale-110' : ''
                  } ${isShaking ? 'animate-shake' : ''} hover:scale-105`}
                >
                  <img src={image} alt={choice} className="w-20 h-20 object-contain" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-center">CPU</h3>
            {showCPUChoice ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-lg font-semibold text-gray-600 animate-pulse">
                  CPU is thinking...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(choices).map(([choice, image]) => (
                  <div
                    key={choice}
                    className={`p-4 border rounded-lg ${
                      playerTwoChoice === choice ? 'border-red-500 scale-110' : ''
                    } ${isShaking ? 'animate-shake' : ''}`}
                  >
                    <img src={image} alt={choice} className="w-20 h-20 object-contain opacity-50" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center transform scale-110 animate-bounce">
            <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
              {result === 'tie' ? "It's a tie!" : `${result} wins!`}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <button
          onClick={downloadPDF}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center space-x-2"
        >
          <Trophy className="w-5 h-5" />
          <span>Download Summary</span>
        </button>
      </div>
    </div>
  );
}