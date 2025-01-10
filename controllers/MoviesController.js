const fs = require("fs");

let movies = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));

function getAllMovies(req, res) {
    res.status(200).json({
        status: "sucess",
        data: {
            movies: movies
        }
    });
}

function checkBody(req, res, next) {
    if (!req.body.name || !req.body.releaseYear || !req.body.duration) {
        return res.status(400).json({
            status: "fail",
            message: "Movie Object is not valid"
        });
    }
    next();
}

function createMovie(req, res) {
    let newMovie = {
        id: movies.length + 1,
        ...req.body
    };

    movies.push(newMovie);

    fs.writeFile("./data/data.json", JSON.stringify(movies), (err) => {
        if (err) {
            console.log(err);
        }
        res.status(201).json({
            status: "sucess",
            data: {
                movie: newMovie
            }
        });
    });
}

function checkId(req, res, next, value) {
    let index = -1;

    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === +value) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        return res.status(404).json({
            status: "fail",
            message: `The movie with id ${req.params.id} is not found`
        });
    }
    next();
}

function getSingleMovie(req, res) {
    let index = -1;

    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === +req.params.id) {
            index = i;
            break;
        }
    }

    res.status(200).json({
        status: "sucess",
        data: {
            movie: movies[index]
        }
    });
}

function updateMovie(req, res) {
    let index = -1;

    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === +req.params.id) {
            index = i;
            break;
        }
    }

    movies[index] = {
        ...movies[index],
        ...req.body
    };

    fs.writeFile("./data/data.json", JSON.stringify(movies), (err) => {
        if (err) {
            console.log(err);
        }
        res.status(200).json({
            status: "sucess",
            data: {
                movie: movies[index]
            }
        });
    });
}

function deleteMovie(req, res) {
    let index = -1;

    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === +req.params.id) {
            index = i;
            break;
        }
    }

    let part1 = movies.slice(0, index);
    let part2 = movies.slice(index + 1);
    movies = part1.concat(part2);

    fs.writeFile("./data/data.json", JSON.stringify(movies), (err) => {
        if (err) {
            console.log(err);
        }
        res.status(204).json({
            status: "sucess",
            message: `The movie has been deleted`,
            data: {
                movies: null
            }
        });
    });
}

module.exports = {
    getAllMovies,
    getSingleMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    checkId,
    checkBody
};