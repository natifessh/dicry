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
import Alert  from 'react-bootstrap/Alert';
import { api } from './api';
function App() {
  const[value,setValue]=useState("");
  const[response,setResponse]=useState({});
  const[error,setError]=useState(false)
  useEffect(() => {
  }, [value]);
  
  useEffect(()=>{
    async function FetchCat(params) {
      try{
        const response=await api.get('/cat')
        const data= await response.data
        setResponse(data[0])
        setValue('cat')

      }catch(e){
        console.log(e)
      }
      
    }

    FetchCat()
  },[])
  async function fetchWord(){
    setError(false)
    setResponse({})
    try{
      const response=await api.get(`/${value.trim().toLowerCase()}`);
      const data= await response.data;
      setResponse(data[0])
      console.log(data[0])
     
    }catch(e){
      setError(true)
    }
  }
  const handleInput=(e)=>{
    e.preventDefault()
    setValue(e.target.value)
  }
  return (
    <>
    <Navigationbar/>
    <FormComponent handleInput={handleInput} value={value} fetchDefaultWord={fetchWord}/>
    <Word word={response} error={error} setError={setError}/>
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
          placeholder="cat"
        value={value}
        onChange={handleInput}
        style={{maxWidth:'190%'}}
        />
      </InputGroup>
        </Col>
        <Col>
        <Button variant="secondary"   style={{maxWidth:'90%'}} onClick={fetchDefaultWord}>Search</Button>
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
            <h1>D-Dictionary</h1>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </Container>
  );
}
function Word({ word, error,setError }) {
  if (error || !word || (Array.isArray(word) && word.length === 0)) {
    return (
      <Alert  variant="danger" onClose={() => setError(false)} dismissible>
        <Alert.Heading>Word not found!</Alert.Heading>
        <p>
          Please use another dictionary the API may not support this word.
        </p>
      </Alert>
    );
  }
  const entry = Array.isArray(word) ? word[0] : word;

  return (
    <Card className="my-3" style={{ maxWidth: '90%', margin: 'auto' }}>
      <Card.Body>
        <Card.Title>{entry.word}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
        <Card.Body>
  {entry?.phonetics?.map((phonetic, idx) => (
    <div key={idx} className="d-flex align-items-center mb-2">
      {phonetic.text && <span className="me-2">{phonetic.text}</span>}
      {phonetic.audio && (
        <audio controls className="flex-shrink-0" style={{ maxWidth: '80%' }}>
          <source src={phonetic.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  ))}
</Card.Body>
</Card.Subtitle>

        {entry?.meanings?.slice(0, 4).map((meaning, idx) => (
          <div key={idx}>
            <h5>{meaning.partOfSpeech}</h5>
            <ul style={{ listStyle: "none" }}>
              {meaning.definitions.slice(0, 4).map((def, idx2) => (
                <li key={idx2}># {def.definition}</li>
              ))}
            </ul>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}
