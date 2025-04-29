use std::{env, fs::{self, File}, io::{BufRead, BufReader, BufWriter, Read}, ops::{Div, Index, Mul}};
//a struct we are going to use as a  class which has a field words which will be filled by the words from a given text file to its constructor
#[derive(Debug,Deserialize)]
struct Dictionary{
    words:Vec<String>
}
//method definition and implementation
impl Dictionary {
    //constructor
    fn from(file_path:String)->Self{
        let mut file=File::open(file_path).unwrap();
        let reader=BufReader::new(file);
        let mut words=Vec::new();
        for line in reader.lines(){
            words.push(line.unwrap());
        }
        words.sort();
        Dictionary { words: words }
    }
    //method to check the existence of the word from the vector that was filled from the given path or text file
    fn binary_search(&mut self,word:&String)->Option<i32>{
        let mut left=0;
        let mut right=self.words.len() as i32 -1;
        let mut index=0;
        while left<=right {
            let mut mid=(left+right)/2 ;
            match self.words[mid as usize].cmp(&word) {
                std::cmp::Ordering::Equal=>return  Some(mid),
                std::cmp::Ordering::Greater=>right=mid,
                std::cmp::Ordering::Less=>left=mid+1      
            }    
        }
       None
    }
    // an aysnc method that will fetch the meaning of the word from the api and return the response in a json format with []
   async fn get_meaning(&mut self,word:String)->Vec<Word>{
    reqwest::get(format!("https://api.dictionaryapi.dev/api/v2/entries/en/{}", word))
    .await
    .unwrap()
    .json::<Vec<Word>>()
    .await
    .unwrap()
   }
}

//Structs to handle the api respone we going to call and modify them to a structure we want
#[derive(Serialize,Deserialize,Debug)]
struct Word{
    word:String,
    phonetics:Vec<Phonetic>,
    meanings:Vec<Meaning>
}
#[derive(Serialize,Deserialize,Debug)]
struct Meaning{
    partOfSpeech:String,
    definitions:Vec<Definition>,
}
#[derive(Serialize,Deserialize,Debug)]
struct Definition{
    definition:String
}
#[derive(Serialize,Deserialize,Debug)]
struct Phonetic{
    text:String,
    audio:String
}
 /*  
 {"word":"apple","phonetic":"/ˈæp.əl/","phonetics":[{"text":"/ˈæp.əl/","audio":"https://api.dictionaryapi.dev/media/pronunciations/en/apple-uk.mp3"
meanings":[{"partOfSpeech":"noun","definitions":[{"definition":"A common, round fruit produced by the tree Malus domestica, cultivated in temperate climates.
 */
//a simple get route that will handle the request from the user and checks if the word exists if so it gets its meaning by calling the Dictionary.get_meaning() method please pay attention
//to use the methods above of the dictionary struct we initiallized a an obeject of type dictionary here...
// this simple route will handle a simple http request by extracting the word provided in the url
#[get("/{word}")]
async  fn get_word(word:web::Path<String>)->impl Responder{
    let word=word.into_inner();
    let mut resp:Vec<Word>=vec![];
    let mut  dictionary=Dictionary::from("words_alpha.txt".to_string());
    if dictionary.binary_search(&word).is_some(){
         resp=dictionary.get_meaning(word).await;
    }
    web::Json(resp)
}
use actix_web::{dev::Path, *};
use reqwest::Method;
use serde::{Deserialize, Serialize};
use actix_cors::*;

#[actix_web::main]
async fn main()->std::io::Result<(),>{
    let port = env::var("PORT").unwrap_or_else(|_| String::from("8080"));
   HttpServer::new(||{
    let cors=Cors::default()
    .allow_any_origin()
    .allowed_methods(vec![Method::GET])
    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
    .allowed_header(http::header::CONTENT_TYPE)
    .max_age(3000);
    App::new()
    .wrap(cors)
   
    .service(get_word)
   })
    .bind(format!("0.0.0.0:{}",port))?
    .run()
    .await

} 
