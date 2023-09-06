const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')



//@desc GET all notes
//@route GET /notes
//@access Private

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found'})
    }

    //Add username to each note before sending the response
    const notesWithUser = await Promise.all(notes.map(async (note) =>{
        const user = await User.findById(note.user).lean().exec()
        return {...notes, username: user.username}
    })

    ) 
    res.json(notesWithUser)
}

)



//@desc create new note
//@route POST /note
//@access Private

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body
    //confirm data
    if(!user ||!title || !text ) {
        return res.status(400).json({message: 'All fields are required'})
    }

    //check for duplicate Title
    const duplicate = await Note.findOne({title}).lean().exec()
    if (duplicate) {
        return res.status(409).json({message: 'Duplicate note title'})
    }


    //create and store new note
    const note = await Note.create({ user, title, text})

    if (note) {
        //created
        res.status(201).json({message: `New Note with ${title} created`})
    }else{
        res.status(400).json({message: 'Invalid note data'})
    }
})





//@desc Update a note
//@route UPDATE /note
//@access Private

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    //confirm data
    if(!id || !user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message: 'All fields are required'})
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({message: 'Note not found'})
    }

    //check for duplicates
    const duplicate = await Note.findOne({title}).lean().exec()

    //Allow updates to the original note
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate Note title'})
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({ message: `${updatedNote.title} updated`})
}


)
//@desc Delete a notes
//@route DELETE /notes
//@access Private


const deleteNote = asyncHandler( async (req,res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({message: 'Note ID Required'})
    }

    //confirm note exist to be deleted
    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message: 'Note not found'})
    }

    const result = await note.deleteOne()

    const reply = `Note ${result.title} with ID ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    createNewNote,
    updateNote,
    getAllNotes,
    deleteNote
}