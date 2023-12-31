import styled from 'styled-components';

const _CardHeader = styled.div`
    position: relative;
    background-color: ${(props) => props.color};
    height: 20px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
`;

const _CardBody = styled.div`
    padding-top: 8px;
    display: flex;
    justify-content: flex-start;
    padding: 10px 30px 0 30px;
    max-width: 100px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export default function NoEditQuoteCard({ card }) {
    return (
        <>
            <_CardHeader color={card.coverColor} />
            <_CardBody>{card.title}</_CardBody>
        </>
    );
}
