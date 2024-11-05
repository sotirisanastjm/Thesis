import ai from "../assets/images/ai.png";
import dev from "../assets/images/dev.png";
import decentralized from "../assets/images/decentralized.png";

export const Info = () => {
    return (
        <section className="container space-y-8">
            <div>
                <h2 className="text-3xl font-serif font-bold text-center">
                    Empower Your Blockchain Journey with NexusChat
                </h2>
                <h3 className="text-brown-300 text-2xl text-center mt-1 font-medium">
                    Explore the innovative features that make learning
                    decentralized and accessible.
                </h3>
            </div>
            <div className="grid justify-items-center items-center grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="space-y-2 p-6 border border-dark-200 h-full">
                    <img src={ai} className="h-10 object-cover invert" />
                    <h4 className="text-2xl font-bold text-brown-300">How It Works</h4>
                    <p className="text-lg font-medium">
                        Get personalized assistance in your blockchain journey
                        through an AI-driven chatbot that helps you with coding,
                        problem-solving, and learning.
                    </p>
                </div>

                <div className="space-y-2 p-6 border border-dark-200 h-full">
                    <img src={dev} className="h-10 object-cover invert" />
                    <h4 className="text-2xl font-bold text-brown-300">Decentralized Storage</h4>
                    <p className="text-lg font-medium">
                        Your data, including chat history and profiles, is
                        securely stored on the Sui Blockchain, ensuring privacy
                        and security.
                    </p>
                </div>

                <div className="space-y-2 p-6 border border-dark-200 h-full">
                    <img src={decentralized} className="h-10 object-cover invert" />
                    <h4 className="text-2xl font-bold text-brown-300">Why It Was Built</h4>
                    <p className="text-lg font-medium">
                        NexusChat was created to simplify blockchain education,
                        making it more accessible while promoting
                        decentralization and security.
                    </p>
                </div>
            </div>
        </section>
    );
};
