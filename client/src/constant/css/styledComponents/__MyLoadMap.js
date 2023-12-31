import styled from 'styled-components';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { IoMdLock, IoMdUnlock, IoMdDownload } from 'react-icons/io';
import { LiaEdit } from 'react-icons/lia';
import { MdDelete } from 'react-icons/md';

export const _CardContainer = styled(Card)`
	border: none;
	cursor: pointer;
	border-radius: 3px;
	padding: 0;
	width: 240px;
	height: 120px;
	max-width: 240px;
	max-height: 120px;
	min-width: 240px;
	min-height: 120px;
	aspect-ratio: 2 / 1;
`;

export const _CardHeader = styled(Card.Header)``;

export const _CardFooter = styled(Card.Footer)``;

export const _CardImg = styled(Card.Img)`
	border-radius: 3px;
	border: none;
	width: 240px;
	height: 120px;
	max-width: 240px;
	max-height: 120px;
	min-width: 240px;
	min-height: 120px;
`;

export const _CardImgOverlay = styled(Card.ImgOverlay)`
	border-radius: 3px;
	border: none;
	width: 240px;
	height: 120px;
	max-width: 240px;
	max-height: 120px;
	min-width: 240px;
	min-height: 120px;
	padding: 0;

	&:hover {
		box-shadow: inset 0px 0px 20px 100px rgba(0, 0, 0, 0.1);
	}
`;

export const _CardBody = styled(Card.Body)`
	border-radius: 3px;
	border: none;
	padding: 4% 0 0 5%;
`;

export const _CardTitle = styled(Card.Title)`
	width: 80%;
	font-size: 1rem;
	color: whitesmoke;
`;

export const _CardSubtitle = styled(Card.Subtitle)``;

export const _CardText = styled(Card.Text)``;

export const _CardLink = styled(Card.Link)``;

export const _CardDownloadButton = styled(Button)`
	padding: 0;
	margin: 0;
	position: absolute;
	top: 26%;
	right: 4%;
`;

export const _CardEditButton = styled(Button)`
	padding: 0;
	margin: 0;
	position: absolute;
	top: 4%;
	right: 4%;
`;

export const _LockedIcon = styled(IoMdLock)`
	font-size: 1rem;
	opacity: 0.6;
	color: whitesmoke;
`;

export const _UnlockedIcon = styled(IoMdUnlock)`
	font-size: 1rem;
`;

export const _DownloadIcon = styled(IoMdDownload)`
	color: white;
	font-size: 1rem;

	&:hover {
		scale: 1.2;
	}
`;

export const _EditIcon = styled(LiaEdit)`
	color: white;
	font-size: 1rem;

	&:hover {
		scale: 1.2;
	}
`;

export const _CardDeleteButton = styled(Button)`
	padding: 0;
	margin: 0;
	position: absolute;
	bottom: 5%;
	right: 4%;
`;

export const _DeleteIcon = styled(MdDelete)`
	color: white;
	font-size: 1rem;

	&:hover {
		scale: 1.2;
	}
`;

export const _IconContainer = styled.div`
	position: absolute;
	bottom: 5%;
	left: 4%;
`;
