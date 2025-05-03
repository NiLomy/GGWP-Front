export class Game {
    id: number;
    name: string;
    description: string;
    storyline: string;
    release_date: Date;
    rating: string;
    genres: string[];


    constructor(id: number, name: string, description: string, storyline: string, release_date: Date,
                rating: string, genres: string[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.storyline = storyline;
        this.release_date = release_date;
        this.rating = rating;
        this.genres = genres;
    }
}