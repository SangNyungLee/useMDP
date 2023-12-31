import { useState } from 'react';
import Swal from 'sweetalert2';
import base64Str from '../../constant/ImageBase64';
import {
	_CardContainer,
	_CardBody,
	_CardText,
	_PlusIcon,
	_PlusButton,
	_CardImgOverlay,
	_CardImg,
} from '../../constant/css/styledComponents/__PlusMap';

import { postPlanner } from '../../utils/DataAxios';
import { requestFail } from '../etc/SweetModal';
import { useDispatch } from 'react-redux';
import { plannerListActions } from '../../store/plannerList';

export default function PlusMap() {
	const [editedCreator, setEditedCreator] = useState('');
	const [editedTitle, setEditedTitle] = useState('');
	const [editedPlannerAccess, setEditedPlannerAccess] = useState('PUBLIC');

	const dispatch = useDispatch();

	const handleSaveChanges = async (titleInput, creatorInput, plannerAccessInput) => {
		const data = {
			title: titleInput,
			creator: creatorInput,
			thumbnail: base64Str,
			plannerAccess: plannerAccessInput,
		};

		try {
			const result = await postPlanner(data);
			if (result.status !== 201) {
				requestFail('플래너 생성');
				return;
			}

			const newPlannerId = result.data.data;
			dispatch(
				plannerListActions.addPlanner({
					...data,
					plannerId: newPlannerId,
					cards: [[], [], []],
					taglist: [],
				})
			);

			Swal.fire({
				icon: 'success',
				title: '플래너 생성 성공!',
				text: '플래너가 성공적으로 생성되었습니다.',
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: '플래너 생성 실패',
				text: '플래너 생성 중에 오류가 발생했습니다.',
			});
		}
	};

	const handleClick = async (e) => {
		e.stopPropagation();
		const result = await Swal.fire({
			title: '플래너 생성',
			html: '<input id="swal-input1" class="swal2-input" placeholder="제목">',
			input: 'radio',
			inputOptions: {
				PUBLIC: 'Public',
				PRIVATE: 'Private',
			},
			inputValidator: (value) => {
				if (!value) {
					return '공개범위를 선택하세요.';
				}
			},
			confirmButtonText: '확인',
			confirmButtonColor: 'black',
			cancelButtonText: '취소',
			showCancelButton: true,
		});

		if (result.isConfirmed) {
			const titleInput = Swal.getPopup().querySelector('#swal-input1').value;
			const creatorInput = 'creatorInput';
			const plannerAccessInput = result.value;
			setEditedTitle(titleInput);
			setEditedCreator('creatorInput');
			setEditedPlannerAccess(plannerAccessInput);
			handleSaveChanges(titleInput, creatorInput, plannerAccessInput);
		}
	};

	return (
		<_CardContainer text='white' className='text-center'>
			<_CardBody onClick={(e) => handleClick(e)}>
				<_CardText>Create new planner</_CardText>
			</_CardBody>
		</_CardContainer>
	);
}
