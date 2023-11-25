import { useEffect, useState } from 'react';
import DataDownload from '../../utils/DataDownload';
import CalendarModal from '../home/calendar/CalendarModal';
import DataReaderModal from '../reader/DataReaderModal';
import ThumbnailMaker from './RightClicker/ThumbnailMaker';

export default function QuoteHeader(props) {
    const { selectedCard, thumnnailRef, visible, setVisible, planner, plannerId } = props;

    const [plannerTitle, setPlannerTitle] = useState('MDP');
    const [readData, setReadData] = useState();

    function handleThumbnailDownload() {
        console.log('download', thumnnailRef.current);
        ThumbnailMaker(thumnnailRef);
    }

    const saveState = () => {
        DataDownload(plannerTitle, planner);
    };

    const handleBlur = (e) => {
        console.log('blur', e);
    };

    useEffect(() => {
        if (readData) {
            console.log('readData', readData);
        }
    }, [readData]);

    return (
        <>
            <CalendarModal selectedCard={selectedCard} modalStatus={visible} plannerId={plannerId} modalClose={() => setVisible(false)} />
            <button
                type="button"
                onClick={() => {
                    handleThumbnailDownload();
                }}
            >
                ThumbnailMaker
            </button>
            <input value={plannerTitle} onChange={(e) => setPlannerTitle(e.target.value)} onBlur={handleBlur} />
            <button type="button" onClick={saveState}>
                저장하기
            </button>
            <DataReaderModal setState={setReadData} />
        </>
    );
}
