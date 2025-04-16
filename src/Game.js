import './App.css';
import { useState } from 'react'
import  cx from 'classnames'
import Modal from 'react-modal';
import wordList from './wordlist.json';

const GameFinishedModal = ({rowAnswers, colAnswers}) => {

    const numGuesses = rowAnswers.map(arr => arr.length).reduce((acc, curr) => acc + curr) + 
                       colAnswers.map(arr => arr.length).reduce((acc, curr) => acc + curr);

    return (
        <>
            <div className='modal-content'>
                <div className='win-header'>Voitit!</div>
                <div className='win-message'>Ratkaisit sanaristikkordlen {numGuesses} arvauksella.</div>
                <div className='statistics'>
                    <div className='stat-element'>
                        <div>Pelattu</div>
                        <div>1</div>
                    </div>
                    <div className='stat-element'>
                        <div>Voitto %</div>
                        <div>100%</div>
                    </div>
                    <div className='stat-element'>
                        <div>Kesk. arvaukset</div>
                        <div>{numGuesses}</div>

                    </div>
                    <div className='stat-element'>
                        <div>Streak</div>
                        <div>1</div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Cell({row, col, i, j, dir, isCorrect, onSelect, letter}) {
    return (
        <>
        {(letter === ".") 
            ? (
                <div className="block"></div>
            ) : (
                <div 
                    className={cx('cell unselectable', {
                        "selected": (row === i && col === j),
                        "hilighted": ((row === i && dir === 0) || (col === j && dir === 1)),
                        "correct": isCorrect }
                    )}
                    onClick={() => onSelect(i, j)}>
                    {letter}
                </div>
            )
        }
        </>
    );
}

function KeyBoard({onEnter, onKey, onBackspace, correctWord, currentAnswers, currentGuess}) {
    const topRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"];
    const middleRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"];
    const bottomRow = ["Z", "X", "C", "V", "B", "N", "M"];
    const correctLetters = new Set(correctWord);
    const guessedLetters = new Set(currentAnswers.flat());

    const createKeyboardRow = (letters) => { 
        return letters.map(letter => {
            const yellow = correctLetters.has(letter) && guessedLetters.has(letter);
            const green = currentGuess.includes(letter);

            const grey = guessedLetters.has(letter) && !yellow && !green;

            return (
                <div key={letter} className={cx("key unselectable", {"yellow": yellow && !green, "green": green, "grey": grey})} onClick={() => onKey(letter)}>{letter}</div>
            )
        })
    }
    return (
        <>
            <div className="keyboard-row">
                {createKeyboardRow(topRow)}
            </div>
            <div className="keyboard-row">
                {createKeyboardRow(middleRow)}
            </div>
            <div className="keyboard-row">
                <div className="key unselectable backspace" onClick={() => onBackspace()}></div>
                {createKeyboardRow(bottomRow)}
                <div className="key unselectable enter" onClick={() => onEnter()}></div>
            </div>
        </>
    )
}

function Game({solution}) {
    const emptyGuesses = [[], [], [], [], []];

    const emptyGrid = solution.map((row) => row.map((el) => el === '.' ? '.' : ""))
    const [completed, setCompleted] = useState(false);
    const [grid, setGrid] = useState(emptyGrid);
    const [answer, setAnswer] = useState(emptyGrid);
    const [rowAnswers, setRowAnswers] = useState(emptyGuesses);
    const [colAnswers, setColAnswers] = useState(emptyGuesses);

    let initialCol = 0;
    while (grid[0][initialCol] === '.') {
        initialCol = initialCol + 1;
    }

    const [row, setRow] = useState(0);
    const [col, setCol] = useState(initialCol);
    const [dir, setDir] = useState(0); // 0 | 1

    const el = [0, 1, 2, 3, 4];
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Å', 'Ä', 'Ö'];
    
    const getCurrentAnswers = () => {
        if (dir === 0) return rowAnswers[row];
        return colAnswers[col];
    }

    const getNextDir = () => {
        return (dir + 1) % 2;
    }

    const getCurrentGuess = (r, c) => {
        let currentGuess = [];
        if (dir === 0) {
            currentGuess = grid[r].map(l => {
                if (l === '.') return "";
                if (l === '') return " ";
                return l;
            });
        } else {
            currentGuess = grid.map(row => {
                if (row[c] === '.') return "";
                if (row[c] === '') return " ";
                return row[c];
            });
        }
        return currentGuess;
    }

    const getSelectedWordLen = () => {
        let len = 0;
        if (dir === 0) {
            for (let i = 0; i < grid[row].length; ++i) {
                if (grid[row][i] !== '.') {
                    len = len + 1;
                }
            }
        } else {
            for (let i = 0; i < grid.length; ++i) {
                if (grid[i][col] !== '.') {
                    len = len + 1;
                }
            }
        }
        return len;
    }
    
    const clearRow = (r) => {
        let nextGrid = grid.map(row => row.slice());
        nextGrid = nextGrid.map((rowEl, i) => {
            return rowEl.map((letter, j) => {
                if (letter === '.') return letter;
                if (i === r) return "";
                return letter;
            })
        })
        setGrid(nextGrid);
    }

    const clearColumn = (c) => {
        let nextGrid = grid.map(row => row.slice());
        nextGrid = nextGrid.map((rowEl, i) => {
            return rowEl.map((letter, j) => {
                if (letter === '.') return letter;
                if (j === c) return "";
                return letter;
            })
        })
        setGrid(nextGrid);
    }

    const setDirInternal = (newDir) => {
        dir === 0 ? clearRow(row) : clearColumn(col);
        setDir(newDir);
    }

    const setRowInternal = (newRow) => {
        if (dir === 0 && row !== newRow) clearRow(row);
        setRow(newRow);
    }

    const setColInternal = (newCol) => {
        if (dir === 1 && col !== newCol) clearColumn(col);
        setCol(newCol);
    }
    
    const isDirBlocked = (direction, i, j) => {
        if (direction === 0) {
            const isLeft = j === 0;
            const isRight = j === answer.length - 1;
            const left = answer[i][Math.max(j-1, 0)];
            const right = answer[i][Math.min(j+1, answer.length - 1)];
            if ((left === "." && right === '.') || (isLeft && right === '.') || (isRight && left === '.')) {
                return true;
            }
        } else {
            const isTop = i === 0;
            const isBottom = i === answer.length - 1;
            const above = answer[Math.max(i-1, 0)][j];
            const below = answer[Math.min(i+1, answer.length - 1)][j];
            if ((above === "." && below === '.') || (isTop && below === '.') || (isBottom && above === '.'))  {
                return true;
            }
        }
        return false;
    }

    const isDirSwitchBlocked = (direction, i, j) => {
        if (direction === 0) {

            const isTop = i === 0;
            const isBottom = i === answer.length - 1;
            const above = answer[Math.max(i-1, 0)][j];
            const below = answer[Math.min(i+1, answer.length - 1)][j];
            if ((above === "." && below === '.') || (isTop && below === '.') || (isBottom && above === '.'))  {
                return true;
            }
        } else {
            const isLeft = j === 0;
            const isRight = j === answer.length - 1;
            const left = answer[i][Math.max(j-1, 0)];
            const right = answer[i][Math.min(j+1, answer.length - 1)];
            if ((left === "." && right === '.') || (isLeft && right === '.') || (isRight && left === '.')) {
                return true;
            }
        }
        return false;
    }

    const switchDirection = (direction, i, j) => {
        if ((direction + 1) % 2 === 0) {
            setColInternal(j);
            let newRow = 0;
            while (answer[newRow][j] === '.') {
                newRow = newRow + 1;
            }
            setRowInternal(newRow);
        } else {
            setRowInternal(i);
            let newCol = 0;
            while (answer[i][newCol] === '.') {
                newCol = newCol + 1;
            }
            setColInternal(newCol);
        }
        setDirInternal(direction);
    }

    function selectCell(i, j) {
        if ((dir === 0 && i !== row) || (dir === 1 && j !== col)) {
            if (dir === 0) {
                setRowInternal(i);
                let newCol = 0;
                while (answer[i][newCol] === '.') {
                    newCol = newCol + 1;
                }
                setColInternal(newCol);
            } else {
                setColInternal(j);
                let newRow = 0;
                while (answer[newRow][j] === '.') {
                    newRow = newRow + 1;
                }
                setRowInternal(newRow);
            }
            if (isDirBlocked(dir, i, j)) {
                switchDirection(getNextDir(), i, j);
            }
        } else {
            if (!isDirSwitchBlocked(dir, i, j))
                switchDirection((dir + 1) % 2, i, j);
        }
    }

    function moveUp() {
        const newRow = Math.max(row - 1, 0);
        if (grid[newRow][col] !== '.') {
            setRowInternal(newRow);
        }
        return newRow;
    }

    function moveDown() {
        const newRow = Math.min(row + 1, grid[0].length - 1);
        if (grid[newRow][col] !== '.') {
            setRowInternal(newRow);
        }
        return newRow;
    }

    function moveLeft() {
        const newCol = Math.max(col - 1, 0);
        if (grid[row][newCol] !== '.') {
            setColInternal(newCol);
        }
        return newCol;
    }

    function moveRight() {
        const newCol = Math.min(col + 1, grid.length - 1);
        if (grid[row][newCol] !== '.') {
            setColInternal(newCol);
        }
        return newCol;
    }
    
    function backspace() {
        const currEmpty = grid[row][col] === '';
        const nextGrid = grid.map(row => row.slice());
        if (currEmpty) {  
            const newIdx = dir === 0 ? moveLeft() : moveUp();
            const el = nextGrid[dir === 0 ? row : newIdx][dir === 0 ? newIdx : col];
            if (el !== '.')
                nextGrid[dir === 0 ? row : newIdx][dir === 0 ? newIdx : col] = "";
            setGrid(nextGrid);
        } else {
            nextGrid[row][col] = "";
            setGrid(nextGrid);
            dir === 0 ? moveLeft() : moveUp();
        }
    }

    const enterGuess = () => {
        const guess = getCurrentGuess(row, col);
        const selectedWorLen = getSelectedWordLen();
        const currentGuesses = getCurrentAnswers();
        let nextAnswers = answer.map(row => row.slice());
        if (currentGuesses.length >= guess.length) {
            return;
        }

        if (!wordList.includes(guess.join(""))) {
            return;
        }

        if (dir === 0) {
            for (let i  = 0; i < guess.length; ++i) {
                if (guess[i] === ' ' && answer[row][i] === '') return;
            }
            let nextRowAnswers = rowAnswers.map(a => a.slice());
            if (nextRowAnswers[row].length < selectedWorLen) {
                for (let i = 0; i < guess.length; ++i) {
                    if (guess[i] === ' ') guess[i] = answer[row][i];
                }
                nextRowAnswers[row].push(guess);
            }
            setRowAnswers(nextRowAnswers);

            for (let i = 0; i < guess.length; ++i) {
                if (solution[row][i] === guess[i]) nextAnswers[row][i] = guess[i]
            }
            setAnswer(nextAnswers);
            
            let nextGrid = grid.map(row => row.slice());
            for (let i = 0; i < 5; ++i)
            {
                if (grid[row][i] !== '.') {
                    nextGrid[row][i] = ' ';
                }
            }
            setGrid(nextGrid);
            let initialCol = 0;
            while (grid[row][initialCol] === '.') {
                initialCol = initialCol + 1;
            }
            setCol(initialCol)
            
        } else {
            for (let i  = 0; i < guess.length; ++i) {
                if (guess[i] === ' ' && answer[i][col] === '') return;
            }
            let nextColAnswers = colAnswers.map(a => a.slice());
            if (nextColAnswers[col].length < selectedWorLen) {
                for (let i = 0; i < guess.length; ++i) {
                    if (guess[i] === ' ') guess[i] = answer[i][col];
                }
                nextColAnswers[col].push(guess);
            }
            setColAnswers(nextColAnswers);

            for (let i = 0; i < guess.length; ++i) {
                if (solution[i][col] === guess[i]) nextAnswers[i][col] = guess[i]
            }
            setAnswer(nextAnswers)
            
            let nextGrid = grid.map(row => row.slice());
            for (let i = 0; i < 5; ++i)
            {
                if (grid[i][col] !== '.') {
                    nextGrid[i][col] = ' ';
                }
            }
            setGrid(nextGrid);
            
            let initialRow = 0;
            while (grid[initialRow][col] === '.') {
                initialRow = initialRow + 1;
            }
            setRow(initialRow)
        }

        let unfinished = false;
        for (let i = 0; i < nextAnswers.length; ++i) {
            for (let j = 0; j < nextAnswers[i].length; ++j) {
                if (nextAnswers[i][j] == "") {
                    unfinished = true;
                    break;
                }
            }
        }
        setCompleted(!unfinished);
    }

    const enterKey = (key) => {
        const nextGrid = grid.map(row => row.slice());
        nextGrid[row][col] = key;
        setGrid(nextGrid);
        dir === 0 ? moveRight() : moveDown(); 
    }

    const keyDown = (e) => {
        if (alphabet.includes(e.key.toUpperCase())) {
            enterKey(e.key.toUpperCase());
            return;
        }

        let newRow = row;
        let newCol = col;
        switch (e.keyCode) {
            case 37: // left
                newCol = moveLeft();
                break;
            case 38: // up
                newRow = moveUp();
                break;
            case 39: // right
                newCol = moveRight();
                break;
            case 40: // down
                newRow = moveDown();
                break;
            case 8: // backspace
                backspace();
                break;
            case 32: // space 
                setDirInternal((dir + 1) % 2);
                break;
            case 13: // enter
                enterGuess();
                break;
            default:
                break;
        }

        if ([37, 38, 39, 40].includes(e.keyCode)) {
            if (isDirBlocked(dir, newRow, newCol)) {
                switchDirection(getNextDir(), newRow, newCol);
            }
        }
    }

    const getCurrentCorrectWord = () => {
        let word = []
        if (dir === 0) {
            for (let i = 0; i < solution.length; ++i) {
                if (solution[row][i] !== '.') {
                    word.push(solution[row][i]);
                }
            }
        } else {
            for (let i = 0; i < solution.length; ++i) {
                if (solution[i][col] !== '.') {
                    word.push(solution[i][col]);
                }
            }
        }
        return word;
    }

    const getCurrentAnsweredWord = () => {
        let word = []
        if (dir === 0) {
            for (let i = 0; i < answer.length; ++i) {
                if (answer[row][i] !== '.') {
                    word.push(answer[row][i]);
                }
            }
        } else {
            for (let i = 0; i < solution.length; ++i) {
                if (answer[i][col] !== '.') {
                    word.push(answer[i][col]);
                }
            }
        }
        return word;
    }

    const createRows = (n) => {
        const correctWord = getCurrentCorrectWord();
        const currentAnswer = getCurrentAnsweredWord();
        const correctLetters = new Set(correctWord);
        const guessedLetters = new Set(getCurrentAnswers().flat());
        const guesses = getCurrentAnswers().map(g => g.filter(l => l !== ""));
        const numGuesses = guesses.length;
        const currentGuess = getCurrentGuess(row, col).join("");
        const rows = [];
        for (let i = 0; i < n; i++) {
            const letters = [];
            for (let j = 0; j < n; j++) {
                const letter = numGuesses > i ? guesses[i][j] : "";
                const numCorrect = correctWord.filter(l => l === letter).length;
                const numGreenOfThis = guesses[i]?.filter((l, idx) => l === letter && correctWord[idx] === letter).length;
                const numYellowBeforeThis = guesses[i]?.slice(0, j).filter((l, idx) => l === letter && correctWord[idx] !== letter).length;
                const canBeYellow = numCorrect - numGreenOfThis - numYellowBeforeThis > 0 && numCorrect > numGreenOfThis;
                
                let green = currentAnswer[j] === letter;
                green = green && numGuesses > i;
                const yellow = canBeYellow && numGuesses > i && correctLetters.has(letter) && guessedLetters.has(letter) && !green;
                let letterToUse = ""
                if (numGuesses > i) {
                    letterToUse = guesses[i][j];
                } else if (numGuesses === i) {
                    if (currentGuess[j] === " ") {
                        letterToUse = currentAnswer[j]
                    } else {
                        letterToUse = currentGuess[j];
                    }
                }
                
                letters.push(
                    <div key={j} className={cx("wordle-letter unselectable", {"guessed": numGuesses > i, "green": green, "yellow": yellow})}>
                        {letterToUse}
                    </div>
                );
            }
            rows.push(
                <div key={i} className={cx('wordle-row')}>
                    {letters}
                </div>
            );
        }
        return rows;
    };

    const handleModalClose = () => {
        setCompleted(false);
    }
    
    return (
        <div className="main-container" tabIndex={0} onKeyDown={keyDown}>
            <div className="bottom-container">
                <div className="grid-container">
                    <div className="grid">
                        {el.map((i) => 
                            <div key={`row ${i}`} className="row">
                                {el.map((j) => {
                                    const letterToUse = (grid[i][j] !== ' ' && grid[i][j] !== "") ? grid[i][j] : answer[i][j]
                                    return (
                                        <Cell
                                            key={`cell ${i} ${j}`}
                                            row={row} 
                                            col={col} 
                                            i={i} 
                                            j={j} 
                                            dir={dir}
                                            isCorrect={answer[i][j] !== ""}
                                            onSelect={selectCell} 
                                            letter={letterToUse} />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="wordle-container">
                    <div className="wordle">
                        {createRows(getSelectedWordLen())}
                    </div>
                    <div className="keyboard">
                        <KeyBoard 
                            onEnter={enterGuess}
                            onKey={enterKey}
                            onBackspace={backspace}
                            correctWord={getCurrentCorrectWord()}
                            currentAnswers={getCurrentAnswers()}
                            currentGuess={getCurrentAnsweredWord()}/>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={completed}
                onRequestClose={handleModalClose}
                className={"completion-modal"}>
                <GameFinishedModal 
                    rowAnswers={rowAnswers}
                    colAnswers={colAnswers}/>
            </Modal>
        </div>
    );
}

export default Game;
