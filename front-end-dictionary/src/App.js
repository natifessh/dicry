import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import { api } from './api';
function App() {
  const[value,setValue]=useState("");
  const[response,setResponse]=useState({});
  async function fetchDefaultWord(){
    try{
      const response=await api.get(`http://127.0.0.1:8080/${value}`);
      const data= await response.data;
      setResponse(data[0])
      console.log(data[0])
    }catch(e){
      console.log(e)
    }
  }
  const handleInput=(e)=>{
    e.preventDefault()
    setValue(e.target.value)
  }
  return (
    <>
    <Navigationbar/>
    <FormComponent handleInput={handleInput} value={value} fetchDefaultWord={fetchDefaultWord}/>
    <Word word={response}/>
    </>
  )
}
export default App;
function FormComponent({value,fetchDefaultWord,handleInput}){
  return(
    <Container>
       <Row>
        <Col>
        <InputGroup className="mb-3">
        <Form.Control
          placeholder="Nigger"
        value={value}
        onChange={handleInput}
        />
      </InputGroup>
        </Col>
        <Col>
        <Button variant="secondary" onClick={fetchDefaultWord}>Search</Button>
        </Col>
      </Row>
    </Container>
  )
}
function Navigationbar() {
  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">
            <h1>G-Dictionary</h1>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </Container>
  );
}
function Word({ word }) {
  return (
    <Card  className="my-3" style={{ maxWidth: '80%', margin: 'auto' }}>
      <Card.Body>
        <Card.Title>Word: {word?.word || "No word found"}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {word?.phonetics?.map((phonetic, idx) => (
            <span key={idx}>{phonetic.text} </span>
          ))}
        </Card.Subtitle>
        {word?.meanings?.slice(0,4).map((meaning, idx) => (
          <div key={idx}>
            <h5>{meaning.partOfSpeech}</h5>
            <ul style={{"listStyle":"none"}}>
              {meaning.definitions.slice(0,4).map((def, idx2) => (
                <li key={idx2}># {def.definition}</li>
              ))}
            </ul>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}




