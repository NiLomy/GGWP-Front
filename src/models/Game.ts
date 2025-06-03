export class Game {
    id: number;
    name: string;
    description: string;
    storyline: string;
    release_date: string;
    image_url: string;
    rating: string;
    genres: Genre[];

    constructor(id: number, name: string, description: string, storyline: string, release_date: string,
                image_url: string, rating: string, genres: Genre[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.storyline = storyline;
        this.release_date = release_date;
        this.image_url = image_url;
        this.rating = rating;
        this.genres = genres;
    }
}

export interface Genre {
    id: number;
    name: string;
}