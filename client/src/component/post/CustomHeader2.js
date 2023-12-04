import React, { useEffect, useRef, useState } from 'react';
import { FaTrello, FaSearch, FaPlus, FaInfo, FaBell, FaStar, FaLock, FaLockOpen, FaEllipsisH, FaDownload, FaUser } from 'react-icons/fa';
import '../../constant/css/customHeader2.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { plannerListActions } from '../../store/plannerList';
import { getPlannerBtoA, patchPlanner } from '../../utils/DataAxios';
import DataDownload from '../../utils/DataDownload';
import { requestFail } from '../etc/SweetModal';
function CustomHeader2(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const plannerInfo = props.plannerInfo;
    console.log('프롭스', props.plannerInfo);
    
    const titleRef = useRef();

    useEffect(()=>{
        if(plannerInfo){
            const {title} = plannerInfo
            titleRef.current.innerText = title
        }
    },[plannerInfo])

    const handleBlur = async (e) => {
        const data = {
            ...plannerInfo,
            title: e.target.innerText,
        };
        const res = await patchPlanner(data);
        if (res.status !== 200) {
            requestFail('플래너 제목 수정');
            return;
        }
        dispatch(
            plannerListActions.updatePlannerTitle({
                plannerId: plannerInfo.plannerId,
                title: e.target.innerText,
            })
        );
    };
    const handlePublic = async () => {
        const data = {
            ...plannerInfo,
            plannerAccess: 'PUBLIC',
        };
        console.log('handlepublic', data);
        const res = await patchPlanner(data);
        if (res.status !== 200) {
            requestFail('플래너 상태 저장');
            return;
        }
        dispatch(
            plannerListActions.updatePlannerAccess({
                plannerId: plannerInfo.plannerId,
                plannerAccess: 'PUBLIC',
            })
        );
    };

    const handlePrivate = async () => {
        const data = {
            ...plannerInfo,
            plannerAccess: 'PRIVATE',
        };
        console.log('handlepublic', data);
        const res = await patchPlanner(data);
        if (res.status !== 200) {
            requestFail('플래너 상태 저장');
            return;
        }
        dispatch(
            plannerListActions.updatePlannerAccess({
                plannerId: plannerInfo.plannerId,
                plannerAccess: 'PRIVATE',
            })
        );
    };

    const homeNavigate = () => {
        navigate('/');
    };

    const handleDownLoad = async () => {

        const res = await getPlannerBtoA(btoa(plannerInfo.plannerId));
        if (res.status !== 200) {
            requestFail('다운로드 실패');
        }
        console.log('다운로드', plannerInfo.plannerId, res.data.data);
        DataDownload(plannerInfo.title, res.data.data);
    };
    //useRead를 참고
    const Addplanner = () => {};

    return (
        <div className="nav-main">
            <div className="nav-bar">
                <div className="left-bar">
                    <button onClick={homeNavigate} type="button" className="button-style">
                        <FaTrello style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }} />
                        <span className="text-style">로고자리</span>
                    </button>

                    {/* <button type="button" className="button-style">
            <FaSearch className="search-icon " />
          </button> */}
                </div>

                <div className="right-bar">
                    <button onClick={Addplanner} type="button" className="button-style-right">
                        <FaPlus style={{ fontSize: '16px', color: 'white' }} />
                    </button>

                    <button onClick={handleDownLoad} type="button" className="button-style-right">
                        <FaDownload style={{ fontSize: '16px', color: 'white' }} />
                    </button>

                    <button type="button" className="button-style-right">
                        <FaUser style={{ fontSize: '16px', color: 'white' }} />
                    </button>
                </div>
            </div>

            <div className="content-header">
                <button type="button" className="button-style-header">
                    <span
                        className="main-board"
                        style={{ color: 'white' }}
                        contentEditable
                        onBlur={(e) => {
                            handleBlur(e);
                        }}
                        ref={titleRef}
                    />
                </button>

                <button type="button" className="button-style-header">
                    <FaStar style={{ fontSize: '12px', color: 'white' }} />
                </button>

                <button onClick={handlePrivate} type="button" className="button-style-header">
                    <FaLock style={{ fontSize: '12px', color: 'white', marginRight: '5px' }} />
                    <span className="private-text">Private</span>
                </button>

                <button onClick={handlePublic} type="button" className="button-style-header">
                    <FaLockOpen style={{ fontSize: '12px', color: 'white', marginRight: '5px' }} />
                    <span className="private-text">Public</span>
                </button>
            </div>

            <div className="content-header-right">
                <button
                    type="button"
                    onClick={() => {
                        props.setSwitch((prev) => {
                            return prev == 0 ? 1 : 0;
                        });
                    }}
                    className="button-style-header-right"
                >
                    <FaEllipsisH style={{ fontSize: '12px', color: 'white' }} />
                    <span className="menu-text">Switch</span>
                </button>
            </div>
        </div>
    );
}

export default CustomHeader2;
