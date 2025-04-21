import  cx from 'classnames'

const Cell = ({selected, hilighted, isCorrect, written, onSelect, letter}) => {
    return (
        <>
        {(letter === ".") 
            ? (
                <div className="block"></div>
            ) : (
                <div 
                    className={cx('cell unselectable', {
                        "selected": selected,
                        "hilighted": hilighted,
                        "correct": isCorrect,
                        "written": written }
                    )}
                    onClick={onSelect}>
                    {letter}
                </div>
            )
        }
        </>
    );
}

export default Cell;