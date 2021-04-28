const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();
var fs = require('fs');
var http = require('http');
var url = require('url');
const { resolveSoa } = require('dns');
const path = require("path")

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// data
const courses = [
    { id: 1, name: "course1", code: "CSE765", description: "mainstream course" },
    { id: 2, name: "course2", code: "CSE999", description: "mainstream course" },
    { id: 3, name: "course3", code: "CSE111", description: "mainstream course" },
];

const students = [

    {id: 1, name: "Martina", code: "1601053"},
    {id: 2, name: "Fadi", code: "1601110"},
    {id: 3, name: "Fouad", code: "1609999"},

];


///postcourse
app.get('/', (req, res) => {
    res.send('Helo Word!!!!');
});
app.get('/api/courses', (req, res) => {
    res.send(courses);
});
app.post('/api/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name,
        code: req.body.code,
        description: req.body.description
    };
    courses.push(course);
    res.send(course);
});

//poststudent
app.get('/', (req, res) => {
    res.send('Helo Word!!!!');
});
app.get('/api/students/create', (req, res) => {
    res.send(students);
});
app.post('/api/students/create', (req, res) => {
    const student = {
        id: students.length + 1,
        name: req.body.name,
        code: req.body.code,
    };
    students.push(student);
    res.send(student);
});

// create course form
app.get('/api/courses', (req, res) => {
    console.log(req.body)
    res.send(courses);
});

// create student form
app.get('/api/students', (req, res) => {
    console.log(req.body)
    res.send(students);
});

//delete course
//app.delete('/api/courses/:id', (req, res) => {
app.delete('/api/courses', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.body.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});



//delete student
app.delete('/api/students', (req, res) => {
    // Look up the student
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.body.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(student);
    courses.splice(index, 1);

    // Return the same student
    res.send(student);
});

//get course
// to get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});
// to get single course
// api/courses/1 to get course of id 1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // error 404 object not found
    if (!course) return res.status(404).send('THe course with the given id was not found.');

    res.send(course);
});


//get student
// to get all students
app.get('/api/students', (req, res) => {
    res.send(students);
});
// to get single course
// api/courses/1 to get course of id 1
app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    // error 404 object not found
    if (!student) return res.status(404).send('THe student with the given id was not found.');
    res.send(student);
});



//update course
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(/^[A-Za-z]{3}[0-9]{3}$/).required(),
        description: Joi.string().max(200)
    };
    return Joi.validate(course, schema);
}


app.put('/api/courses', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.body.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    const schema = {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
    };
    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(schema); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});

//update student
function validateStudent(student) {
    const schema = {
        name: Joi.string().regex(/^[a-zA-Z-']*$/).required(),
        code: Joi.string().min(7).max(7).required()
    };
    return Joi.validate(student, schema);
}
app.put('/api/students', (req, res) => {
    // Look up the student
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.body.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }
    const schema = {
        name: req.body.name,
        code: req.body.code,
    };
    // validate 
    // If not valid, return 400 bad request
    const { error } = validateStudent(schema); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});

app.get('/web/courses/create',(req,res) =>{
    res.sendFile(__dirname+"/course.html")
})

app.get('/web/students/create',(req,res) =>{
    res.sendFile(__dirname+"/student.html")
})

app.get('/',(req,res) =>{
    res.send('Welcome');
})

const port = 57754;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))











