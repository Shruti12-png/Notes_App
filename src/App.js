import React from 'react';
import ReactDOM from 'react-dom/client';

import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split";
import {nanoid} from "nanoid";

export default function App(){
  const [notes,setNotes]= React.useState(() =>
    JSON.parse(localStorage.getItem("notes")) || [])
  const [currentNoteId,setCurrentNoteId]= React.useState(
    (notes[0] && notes[0].id) || ""
  )

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function createNewNote(){
    const newNote={
      id: nanoid(),
      body: "#Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text){
    // will bring the updated note at the top
    setNotes(oldNotes => {
      const newArray= []
      for(let i=0;i<oldNotes.length;i++){
        const oldNote= oldNotes[i]
        if(oldNote.id=== currentNoteId){
          newArray.unshift({...oldNote, body: text})
        }
        else{
          newArray.push(oldNote)
        }
      }
      return newArray
    })

    // Will keep the order of notes intact
    /* setNotes(oldNotes => oldNotes.map(oldNote =>{
      return oldNotes.id === currentNoteId
      ? {...oldNotes, body: text}
      : oldNote
    })) */
  }

  function deleteNote( event, noteId){
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !==noteId))
  }

  function findCurrentNote(){
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  return(
    <main>
      {
        notes.length >0
        ?
        <Split sizes={[30,70]} direction= "horizontal" className= "split">
          <Sidebar notes= {notes} currentNote={findCurrentNote()} setCurrentNoteId={setCurrentNoteId} newNote= {createNewNote} deleteNote= {deleteNote} />
          {currentNoteId && notes.length>0 &&
          <Editor currentNote={findCurrentNote()} updateNote= {updateNote} />
          }
        </Split>
        :
        <div className= "no-notes">
          <h1>You have no notes</h1>
          <button className= "first-note" onClick={createNewNote} >Create one now</button>

        </div>
      }
    </main>
  )
}
