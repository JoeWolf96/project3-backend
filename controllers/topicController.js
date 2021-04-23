const express = require('express');
const topics = express.Router();
const topicModel = require('../models/topicModel');
const userModel = require('../models/userModel');



// GET (index) list of holidays
topics.get('/', (req, res)=>{
	//res.send('Get route is working!!!');

	userModel.findById(req.session.currentUser._id, (error, foundUser)=>{
		if (error){

			return res.status(400).json(error)
		}
		else{

			return res.status(200).json(foundUser.topics)
		}
	}).populate('Topics')

});


// POST ROUTE
topics.post('/', (req, res)=>{
	console.log(req.session.currentUser);

	topicModel.create(req.body, (error, createTopic)=>{
		if (error){
			return res.status(400).json({error: error.message})
		}
		else{

			userModel.findById(req.session.currentUser._id, (error, foundUser)=>{
				if (error) {
					return res.status(400).json({ error: error.message })
				}
				else{

          foundUser.topics.push(createTopic)
					foundUser.save((err, updatedModel) => {
    res.status(201).json(createTopic)
})
				}
			})
		}
	})
});


// DELETE ROUTE
topics.delete('/:id', (req, res)=>{

	topicModel.findByIdAndDelete(req.params.id, (error, deletedTopic)=>{
		if (error){
			return res.status(400).json({error: error.message})
		}
		else if (deletedTopic === null){
			return res.status(404).json({message: 'Topic id not Found'})
		}
		else{
			return res.status(200).json({message: `Topic ${deletedTopic.name} deleted successfully`})
		}
	})
})


// UPDATE ROUTE
topics.put('/:id', (req, res)=>{

topicModel.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedTopic)=>{
		if (error){

			return res.status(400).json({error: error.message})
		}
		else{
			return res.status(200).json({
				message: `Topic ${updatedTopic.id} updated successfully`,
				data: updatedTopic
			})
		}
	})
})

// PATCH ROUTE increments numbers of likes
topics.patch('/addlikes/:id', (req, res)=>{

	topicModel.findByIdAndUpdate(req.params.id, { $inc: { likes : 1} }, {new:true}, (error, updatedTopic)=>{
		if (error){
			return res.status(400).json({error: error.message})
		}
		else{
			return res.status(200).json({
				data: updatedTopic
			})
		}
	})
})

module.exports = topics;
