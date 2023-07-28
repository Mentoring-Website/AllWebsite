import React from 'react'
import SideBar from '../../components/sideBar/SideBar'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OppInfo from '../../components/oppInfo/OppInfo';
import './style.css'
import { useParams } from 'react-router-dom';

const ShowOpp = () => {
       const { id } = useParams();
    return (
        <div className='p-2'>
            <Container>
                <Row className='mt-3'>
                    <Col lg="3" className='d-none d-lg-block'>
                        <SideBar />
                    </Col>
                    <Col lg="9">
                        <div className='opp-info radius shadow-sm'>
                            <OppInfo id={id}/>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ShowOpp