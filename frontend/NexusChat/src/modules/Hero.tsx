import heroImage from "../assets/images/chat.jpg";
import { Link } from 'react-router-dom';


export const Hero = () => {
    return (
        <section className="container">
            <div className="flex items-center justify-center flex-col-reverse md:flex-row gap-8 md:gap-12 pt-32">
                <div className="md:w-1/2 flex flex-col gap-3">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif text-dark-200">Welcome to NexusChat👋</h1>
                    <p className="font-medium text-xl text-brown-300">Empower your blockchain journey with personalized AI-driven guidance. Learn, code, and build decentralized applications with ease.</p>
                    <Link to="/chat">
                        <button className="bg-dark-900 text-dark-200 ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-6 py-3 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400 w-full md:w-fit">let's Chat Together</button>
                    </Link>
                </div>
                <img className="w-[80%] sm:w-[50%] lg:w-[40%] object-cover filter brightness-[0.9]" src={heroImage} />
            </div>
        </section>
    );
};
