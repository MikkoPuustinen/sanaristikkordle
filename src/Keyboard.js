import  cx from 'classnames'

const KeyBoard = ({onEnter, onKey, onBackspace, correctWord, currentAnswers, currentGuess}) => {
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

export default KeyBoard;