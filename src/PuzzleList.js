import { useNavigate } from "react-router-dom";

const PuzzleList = ({puzzleList, onSelect}) => {
    const navigate = useNavigate();

    return (
        <div className="puzzles-container">
            {puzzleList.map((el, i) => {
                return (
                    <button className="puzzle-button" onClick={() => {
                        onSelect(i);
                        navigate("/puzzle/" + i);
                    }}>
                        Sanaristikkordle {i + 1}
                    </button>
                )
            })}
        </div>
    );
}

export default PuzzleList;