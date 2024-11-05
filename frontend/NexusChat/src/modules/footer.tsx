export const Footer = () => {

    return (
        <footer className="px-6 py-4 bg-dark-600 w-full">
            <div className="flex flex-row justify-center">
                <p className="font-medium text-dark-100">Copyright &copy; {new Date().getFullYear()} NexusChat </p>
            </div>
        </footer>
    );
};
