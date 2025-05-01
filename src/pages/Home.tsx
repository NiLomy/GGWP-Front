import React from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Home: React.FC<{}> = () => {
    return (
        <div style={{width: '100%'}}>
                <HelmetProvider>
                    <Helmet
                        title="Фулфилмент в Самаре"
                    />
                </HelmetProvider>
            <div>Дом</div>
        </div>
    )
}

export default Home;

