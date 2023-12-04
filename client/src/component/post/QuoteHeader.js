import { useEffect, useState } from 'react';
import DataDownload from '../../utils/DataDownload';
import MDPModal from '../modal/MDPModal';
import DataReaderModal from '../reader/DataReaderModal';
import ThumbnailMaker from './RightClicker/ThumbnailMaker';
import { useDispatch } from 'react-redux';
import { plannerListActions } from '../../store/plannerList';

import CustomHeader2 from './CustomHeader2';
import CustomHeader from './CustomHeader';
import FileInputComponent from '../FileInputComponent';
import FileImageInputComponent from '../FileImageInputComponent';
import { patchPlanner } from '../../utils/DataAxios';
import { requestFail } from '../etc/SweetModal';

export default function QuoteHeader(props) {
    const { selectedCard, thumnnailRef, visible, setVisible, plannerList, plannerInfo, setSwitch } = props;
    const [plannerId, setPlannerId] = useState();
    const [plannerTitle, setPlannerTitle] = useState();
    const [readData, setReadData] = useState();
    const [readThumbnail, setReadThumbnail] = useState();

    const dispatch = useDispatch();

    function handleThumbnailDownload() {
        console.log('download', thumnnailRef.current);
        ThumbnailMaker(thumnnailRef);
    }

    const saveState = (e) => {
        e.stopPropagation();
        DataDownload(plannerTitle, plannerList);
    };

    const handleBlur = async (e) => {
        const data = {
            ...plannerInfo,
            title: plannerTitle,
        };
        const res = await patchPlanner(data);
        if (res.status !== 200) {
            requestFail('플래너 제목 수정');
            return;
        }
        dispatch(
            plannerListActions.updatePlannerTitle({
                plannerId,
                title: plannerTitle,
            })
        );
    };

    const patchPlannerAndDispatch = async (thumbnail) => {
        const data = { ...plannerInfo, thumbnail: thumbnail };
        console.log('patchPlannerAndDispatch', data);
        const res = await patchPlanner(data);
        if (res.status !== 200) {
            requestFail('플래너 상태 저장');
        }
        dispatch(
            plannerListActions.updatePlannerThumbnail({
                plannerId,
                thumbnail,
            })
        );
    };

    useEffect(() => {
        if (plannerInfo) {
            const { plannerId, title } = plannerInfo;
            setPlannerId(plannerId);
            setPlannerTitle(title);
        }
    }, [plannerInfo]);

    useEffect(() => {
        if (readData) {
            console.log('readData', readData);
        }
    }, [readData]);

    useEffect(() => {
        if (readThumbnail) {
            patchPlannerAndDispatch(readThumbnail);
            setReadThumbnail();
        }
    }, [readThumbnail]);

    return (
        <>
            <CustomHeader2 setSwitch={setSwitch} plannerInfo={plannerInfo} plannerList={plannerList} />
            <MDPModal selectedCard={selectedCard} modalStatus={visible} plannerId={plannerId} modalClose={() => setVisible(false)} />
            {/* <div>
                
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleThumbnailDownload();
                        }}
                    >
                    
                    ThumbnailMaker
                </button>
                <button type="button" onClick={(e) => saveState(e)}>
                    저장하기
                </button>
                <DataReaderModal setState={setReadData} />
                <FileImageInputComponent setState={setReadThumbnail} />
            </div> */}
        </>
    );
}
