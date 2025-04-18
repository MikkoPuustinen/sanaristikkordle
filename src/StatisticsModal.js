const StatisticsModal = ({rowAnswers, colAnswers}) => {

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

export default StatisticsModal;