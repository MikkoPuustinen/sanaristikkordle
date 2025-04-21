import { useNavigate } from "react-router-dom";
import Cell from "./Cell";

const PuzzleList = ({puzzleList, onSelect}) => {
    const navigate = useNavigate();

    return (
        <div className="puzzles-container">
            {puzzleList.map((el, i) => {
                return (
                    <button className="puzzle-button" onClick={() => {
                        onSelect(i + 1);
                        navigate("/puzzle/" + (i + 1));
                    }}>
                        <div className="grid">
                        {el.map((row, j) => 
                            <div key={`row ${i}`} className="row">
                                {row.map((letter, k) => {
                                    return (
                                        <Cell
                                            key={`cell ${j} ${k}`}
                                            selected={false}
                                            hilighted={false}
                                            isCorrect={false}
                                            written={false}
                                            onSelect={() => {}} 
                                            letter={letter === '.' ? letter : ""} />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                        <div className="puzzle-name">Sanaristikkordle {i + 1}</div>
                    </button>
                )
            })}
        </div>
    );
}

export default PuzzleList;