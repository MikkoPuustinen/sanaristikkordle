import { useState } from 'react'
import Game from './Game';
import PuzzleList from './PuzzleList'
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router";
import puzzleList from './puzzles.json';

const GameWrapper = () => {
    let params = useParams();

    return (
        <Game solution={puzzleList[params.puzzleId]} />
    );
}

const App = () => {
    const [puzzle, setPuzzle] = useState(0);
    const [showStats, setShowStats] = useState(false);

    const selectPuzzle = (idx) => {
        setPuzzle(idx);
    }

    return (
        <>
            <BrowserRouter>
                <div className="top-bar">
                    <Link className="nav-link" to="/puzzles">Pelit</Link>
                    <button className='nav-link' onClick={() => {}}>Tilastot</button>
                </div> 
                <Routes>
                    <Route path="/" element={<Game solution={puzzleList[puzzle]}/>} />
                    <Route path="/puzzle/:puzzleId" element={<GameWrapper />} />
                    <Route 
                        path="/puzzles" 
                        element={
                            <PuzzleList 
                                puzzleList={puzzleList}
                                onSelect={selectPuzzle}/>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;