import React, {useEffect, useState} from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import "../styles/home.css";
import gamepad from "../static/device-gamepad-2.svg";
import Select from "react-select";
import {Game} from "../models/Game";

type Option = {
    value: string;
    label: string;
};

const apiUrl = process.env.REACT_APP_API_URL;

const Home: React.FC<{}> = () => {
    const [games, setGames] = useState<Option[]>([
        {value: 'chocolate', label: 'Chocolateeeeeeeeeeeeeeeee'},
        {value: 'strawberry', label: 'Strawberry'},
        {value: 'vanilla', label: 'Vanilla'}
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedFirstGame, setSelectedFirstGame] = useState<Option | null>(null);
    const [selectedSecondGame, setSelectedSecondGame] = useState<Option | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(apiUrl + '/games');

                const data: Game[] = await response.json();

                const formattedGames = data.map(game => ({
                    value: game.id.toString(),
                    label: game.name
                }));

                setGames(formattedGames);
            } catch (err) {

            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (isLoading) {
        return <div className="home_block home_title">Загружаем игры...</div>;
    }

    return (
        <div style={{width: '100%'}}>
            <HelmetProvider>
                <Helmet
                    title="GGWP"
                />
            </HelmetProvider>
            <div className="home_block">
                <h1 className="home_title">Скрещивайте любимые <span
                    style={{color: "var(--primary-color)"}}>игры</span> и открывайте для себя новые!</h1>
                <p className="home_desc">Найдите, что посмотреть в одиночку, в паре или компании</p>

                <div className="games_picker">
                    <div className="game_block">
                        <div className="game_img">
                            <img src={gamepad} alt="gamepad"/>
                        </div>
                        <div className="select_calculator">
                            <Select defaultValue={selectedFirstGame}
                                    onChange={setSelectedFirstGame}
                                    options={games}/>
                        </div>
                    </div>

                    <div className="game_block">
                        <div className="game_img">
                            <img src={gamepad} alt="gamepad"/>
                        </div>
                        <div className="select_calculator">
                            <Select defaultValue={selectedSecondGame}
                                    onChange={setSelectedSecondGame}
                                    options={games}/>
                        </div>
                    </div>
                </div>
                <button className="game_pick_button">Подобрать игру</button>
            </div>
        </div>
    )
}

export default Home;

