import { Container, Image, Row, Col, Card, Button } from 'react-bootstrap';

export default function LoadMap(props) {
    const { plannerId, title, creator, likePlanner, thumbnail, createAt, description } = props.datas;
    // console.log(thumbnail);

    return (
        <Card style={{ width: '250px' }}>
            <Card.Img variant="top" src={thumbnail}></Card.Img>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted float-end">{creator}</Card.Subtitle>
                <br />
                <Card.Text>{description}</Card.Text>
            </Card.Body>
        </Card>
    );
}

{
    /* 
<Image className="w-50" src={thumbnail}></Image>
            <Row>
                <Col>
                    <h3>{title}</h3>
                    <span>{description}</span>
                </Col>
                <Col>{creator}</Col>
            </Row>
        </> */
}
