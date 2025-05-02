export class Game {
    id: number;
    name: string;
    description: string;
    storyline: string;
    release_date: Date;
    image_url: string;
    rating: string;


    constructor(id: number, name: string, description: string, storyline: string, release_date: Date, image_url: string, rating: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.storyline = storyline;
        this.release_date = release_date;
        this.image_url = image_url;
        this.rating = rating;
    }
}