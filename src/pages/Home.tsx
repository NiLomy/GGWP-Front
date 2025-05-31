import React, {useState} from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import "../styles/home.css";
import gamepad from "../static/device-gamepad-2.svg";
import {Game} from "../models/Game";
import Popup from "../components/Popup";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Keyboard} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import GameSelector from "../components/GameSelector";

type Option = {
    value: string;
    label: string;
};

const apiUrl = process.env.REACT_APP_API_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const Home: React.FC<{}> = () => {
    const [selectedFirstGame, setSelectedFirstGame] = useState<Option | null>(null);
    const [selectedSecondGame, setSelectedSecondGame] = useState<Option | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [pairedGames, setPairedGames] = useState<Array<Game> | null>(null);

    function handleButtonClick() {
        if (localStorage.getItem("access") === null) {
            setIsPopupVisible(true);
            return;
        }
        if (selectedFirstGame === null || selectedSecondGame === null) {
            return;
        }
        fetchWithAuthRetry(apiUrl + "/games/recommend/?id1=" + selectedFirstGame?.value + "&id2=" + selectedSecondGame?.value)
            .then((resp) => {
                resp.json()
                    .then(data => {
                        setPairedGames(data);
                    })
            })
            .catch((e) => {
                console.log(e);
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
                            <GameSelector
                                onSelect={setSelectedFirstGame}
                            />
                        </div>
                    </div>

                    <div className="game_block">
                        <div className="game_img">
                            <img src={gamepad} alt="gamepad"/>
                        </div>
                        <div className="select_calculator">
                            <GameSelector
                                onSelect={setSelectedSecondGame}
                            />
                        </div>
                    </div>
                </div>
                <button type="button" onClick={handleButtonClick} className="game_pick_button">Подобрать игру</button>

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
                                          <span>{game.release_date}</span>
                                          <span className="dot">•</span>
                                          <span>{game.rating}</span>
                                      </div>
                                      <div className="genre_title">Жанр:
                                          {game.genres.map((genre, index) => (
                                              <span key={index} className="genre_item">{genre.name}
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
            {localStorage.getItem("access") === null &&
              <Popup isVisible={isPopupVisible}
                     setVisibleFalse={setIsPopupVisible}/>
            }
        </div>
    )

    function refreshAccessToken(): Promise<string> {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            return Promise.reject(new Error("No refresh token found"));
        }

        return fetch(`${apiUrl}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refresh: refreshToken})
        })
            .then(response => {
                if (!response.ok) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.assign('/');
                }
                return response.json();
            })
            .then((data: { access: string }) => {
                localStorage.setItem("access", data.access);
                return data.access;
            });
    }

    function fetchWithAuthRetry(url: string, options: FetchOptions = {}): Promise<Response> {
        const accessToken = localStorage.getItem("access") || "";

        const headers = {
            ...options.headers,
            'Authorization': 'Bearer ' + accessToken
        };

        return fetch(url, {
            ...options,
            headers,
        }).then(response => {
            if (response.status === 401) {
                // Access token просрочен, обновим
                return refreshAccessToken().then(newAccess => {
                    // Повторим запрос с новым токеном
                    const retryHeaders = {
                        ...options.headers,
                        'Authorization': 'Bearer ' + newAccess
                    };
                    return fetch(url, {
                        ...options,
                        headers: retryHeaders
                    });
                });
            }
            return response;
        });
    }

}

export default Home;

