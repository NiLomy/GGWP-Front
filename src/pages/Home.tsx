import React, {useEffect, useState} from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import "../styles/home.css";
import gamepad from "../static/device-gamepad-2.svg";
import Select from "react-select";
import {Game} from "../models/Game";
import Popup from "../components/Popup";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Keyboard} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

type Option = {
    value: string;
    label: string;
};

const apiUrl = process.env.REACT_APP_API_URL;

const Home: React.FC<{}> = () => {
    const [games, setGames] = useState<Option[]>(
        Array.from({length: 1000}, (_, i) => ({
            value: `${i + 1}`,
            label: `Игра ${i + 1}`
        }))
    );
    const [isLoading, setIsLoading] = useState(false);

    const [selectedFirstGame, setSelectedFirstGame] = useState<Option | null>(null);
    const [selectedSecondGame, setSelectedSecondGame] = useState<Option | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [pairedGames, setPairedGames] = useState<Array<Game> | null>(null);

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

    function handleButtonClick() {
        if (localStorage.getItem("jwt") === null) {
            setIsPopupVisible(true);
            return;
        }
        if (selectedFirstGame === null || selectedSecondGame === null) {
            return;
        }
        fetch(apiUrl + "/match?id=" + selectedFirstGame?.value + "&id=" + selectedSecondGame?.value)
            .then((resp) => {
                resp.json()
                    .then(data => {
                        setPairedGames(data);
                    })
            })
            .catch(() => {
                setPairedGames([new Game(2, "Имя", "Описание", "Story",
                    new Date(2023, 10, 2), "5.0", ["Жанр 1", "Жанр 2"]),
                    new Game(3, "Имя", "Когда злой дух Кромешник посягает на самое дорогое – детские " +
                        "мечты, Северянин, Ледяной Джек, Кролик, Зубная Фея и Песочный Человек впервые объединяются, " +
                        "чтобы создать команду Хранителей снов...",
                        "Когда злой дух Кромешник посягает на самое дорогое – детские мечты, Северянин, Ледяной " +
                        "Джек, Кролик, Зубная Фея и Песочный Человек впервые объединяются, чтобы создать команду Хранителей снов...",
                        new Date(2023, 10, 2), "5.0", ["Жанр 1", "Жанр 2"])])
            })
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
                <p className="home_desc">Найдите, во что поиграть в одиночку, в паре или компании</p>

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
                <button onClick={handleButtonClick} className="game_pick_button">Подобрать игру</button>

                {pairedGames != null &&
                  <Swiper
                    modules={[Navigation, Pagination, Keyboard]}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    keyboard={{enabled: true}}
                    pagination={{clickable: true}}
                    loop={true}
                    slidesPerView={1}
                    className="swiper_games"
                    style={{
                        marginTop: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative"
                    }}

                  >
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>

                      {pairedGames.map((game, index) => (
                          <SwiperSlide key={index}
                                       style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                              <div className="paired_game">
                                  <div className="paired_game_img_block">
                                      <img className="paired_game_img" src={gamepad} alt="paired_game"/>
                                  </div>
                                  <div className="paired_game_content">
                                      <div className="paired_game_title">{game.name}</div>
                                      <div className="paired_game_year_rating">
                                          <span>{game.release_date.getFullYear()}</span>
                                          <span className="dot">•</span>
                                          <span>{game.rating}</span>
                                      </div>
                                      <div className="genre_title">Жанр:
                                          {game.genres.map((genre, index) => (
                                              <span key={index} className="genre_item">
                                                  {genre}
                                                  {index < game.genres.length - 1 && ', '}
                                              </span>
                                          ))}
                                      </div>
                                      <div className="genre_title" style={{marginTop: 5}}>Описание:
                                          <span className="genre_item">
                                                  {game.description}
                                          </span>
                                      </div>
                                      <div className="paired_game_story">{game.storyline}</div>
                                  </div>
                              </div>
                          </SwiperSlide>
                      ))}
                  </Swiper>
                }
            </div>
            {localStorage.getItem("jwt") === null &&
              <Popup isVisible={isPopupVisible}
                     setVisibleFalse={setIsPopupVisible}/>
            }
        </div>
    )
}

export default Home;

