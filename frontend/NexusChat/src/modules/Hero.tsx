import heroImage from "../assets/images/chat.jpg";
import { Link } from 'react-router-dom';


export const Hero = () => {
    return (
        <section className="container">
            <div className="flex items-center justify-center flex-col-reverse md:flex-row gap-8 md:gap-12 mt-32">
                <div className="md:w-1/2 flex flex-col gap-3">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif text-dark-200">Welcome to NexusChat👋</h1>
                    <p className="font-medium text-xl text-brown-300">Empower your blockchain journey with personalized AI-driven guidance. Learn, code, and build decentralized applications with ease.</p>
                    <Link to="/chat">
                        <button className="btn-hero w-full md:w-fit mt-1"><span className="btn-hero-text">let's Chat Together</span></button>
                    </Link>
                </div>
                <img className="w-[80%] sm:w-[50%] lg:w-[40%] object-cover filter brightness-[0.9]" src={heroImage} />
            </div>
        </section>
    );
};
