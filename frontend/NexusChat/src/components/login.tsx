import { useEffect, useState } from 'react';
import loginIMG from '../assets/svgs/signIn.svg'
import { useUser } from '../Context/UserProvider';
import { UserProviderType } from '../Models/UserProvider';

const Login = (props: { active: boolean; onPopUpChange: (newState: boolean) => void }) => {
    const isOpen = props.active;

    const userProvider: UserProviderType = useUser(); 
    const [popUp, setPopUp] = useState(false);

    const [walletStatus, setWalletStatus] = useState<{
        isValidAddress: boolean | null;
        userExist: boolean | null;
        inValidForm: boolean | null;
        loginError: string;
      }>({
        isValidAddress: null,
        userExist: null,
        inValidForm: null,
        loginError: "",
      });
      
    const [formData, setFormData] = useState({
        walletAddress: "",
        email: "",
        username: "",
        password: "",
      });

    useEffect(() => {
        if(popUp) props.onPopUpChange(popUp);
    }, [popUp, props]);
    
    const loginWithWallet = async (form: any) => {
        try {
            const response = await fetch("https://localhost:7261/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Address: form}),
            });
    
            if (!response.ok) {
                throw new Error("Failed to log in");
            }
    
            return response.json();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const RegisterUser = async (form: any) => {
        try {
            const response = await fetch("https://localhost:7261/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Address: form}),
            });
    
            if (!response.ok) {
                throw new Error("Failed to log in");
            }
    
            return response.json();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const Validate_Address = async (walletAddress: string) => {
        try {
            const response = await fetch("https://localhost:7261/api/Auth/validate-address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(walletAddress),
            });
    
            if (!response.ok) {
                throw new Error("Failed to log in");
            }
    
            return response.json();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const validateAddress = async () => {
        try {
            if (formData.walletAddress) {
                const result = await Validate_Address(formData.walletAddress);
                setWalletStatus(prevState => ({
                  ...prevState,
                    isValidAddress: result?.validate || false,
                    userExist: result?.validate ? result?.exists : null,
                }));
            }else{
                setWalletStatus(prevState => ({
                  ...prevState,
                  isValidAddress: false,
                  userExist: null,
                }));
            }
        } catch (error) {
          setWalletStatus(prevState => ({
            ...prevState,
            isValidAddress: false,
            userExist: null,
          }));
          console.error("Validation Address failed:", error);
        }
      };
      

    const handleLogin = async () => {
        try {
            if(walletStatus.userExist){
                if((formData.walletAddress != "" || formData.email != "" || formData.username != "") && formData.password != ""){
                    const data = await loginWithWallet(formData);
                    if(data){
                        userProvider.login(data.Token,data.User);
                        console.log("Login Succeed",data);
                        setPopUp(false);
                    }else{
                        setWalletStatus(prevState => ({
                            ...prevState,
                            loginError: data,
                        }));
                    }
                }else{
                    setWalletStatus(prevState => ({
                        ...prevState,
                        inValidForm: true,
                      }));
                }
            }else{
                if(formData.walletAddress != "" && formData.email != "" && formData.username != "" && formData.password != ""){
                    const data = await RegisterUser(formData);
                    if(data){
                        userProvider.login(data,{Username: formData.email, Email: formData.email});
                        console.log("Login Succeed",data);
                        setPopUp(false);
                    }else{
                        setWalletStatus(prevState => ({
                            ...prevState,
                            loginError: data,
                        }));
                    }
                }else{
                    setWalletStatus(prevState => ({
                        ...prevState,
                        inValidForm: true,
                      }));
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
            setWalletStatus(prevState => ({
                ...prevState,
                inValidForm: true,
              }));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if(walletStatus.isValidAddress){
                handleLogin();
            }else{
                validateAddress();
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handlePopup = () => {
        setPopUp(false);
        setWalletStatus(prevState => ({
            ...prevState,
            isValidAddress: null,
            userExist: null,
          }));
    };


    return (
        <div>
            {userProvider.User === null 
            ? (
                <>
                    <button onClick={() => {setPopUp(true)}} className={`${!isOpen && 'lg:hidden'} w-full bg-dark-900 text-dark-200 text-sm ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-4 py-2 lg:px-6 lg:py-3 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400`}>Login</button>
                    <div className={`p-1 bg-dark-600 rounded-xl hidden ${!isOpen && 'lg:block'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                    </div>
                </>
            ) 
            : (
                <>
                    <button onClick={() => {userProvider.logout()}} className={`${!isOpen && 'lg:hidden'} w-full bg-dark-900 text-dark-200 text-sm ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-4 py-2 lg:px-6 lg:py-3 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400`}>Log out</button>
                    <div className={`p-1 bg-dark-600 rounded-xl hidden ${!isOpen && 'lg:block'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                    </div>
                </>
            )}
            
            {popUp && (
                <div className={`fixed inset-0 backdrop-blur-sm z-10 h-full w-full flex justify-center items-center`}>
                    <div className={`transition-transform transform duration-1000 ease-in-out  ${popUp ? 'scale-100' : 'scale-50'} w-[80%] h-[55%] lg:h-[60%] lg:w-[50%] bg-dark-700 rounded-2xl shadow-2xl shadow-dark-600 relative`}>
                        <button onClick={handlePopup} className='absolute p-4 right-0 hover:cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className='p-8 h-full space-y-6'>
                            <div>
                                <h3 className='text-center text-3xl '>Login</h3>
                                <div className='text-center text-xl mt-2 mx-auto lg:w-[80%] text-brown-500'>Connect your Sui Wallet and dive into the world of decentralized app development.</div>
                            </div>
                            <img className='mx-auto object-cover h-[140px] sm:h-[160px] lg:h-[180px]' src={loginIMG}/>
                            { walletStatus.isValidAddress === null || walletStatus.isValidAddress === false ? (
                                    
                                <div className='mx-auto relative w-[80%]'>
                                    <input
                                    className="bg-dark-900 w-full placeholder:text-[12px] pr-14 text-dark-200 font-mono ring-1 ring-dark-600 focus:ring-2 focus:ring-dark-300 outline-none duration-300 placeholder:text-dark-300 placeholder:opacity-80 rounded-full py-4 shadow-md focus:shadow-lg focus:shadow-dark-400 px-6"
                                    placeholder="Type your wallet address.." name="walletAddress" type="text" value={formData.walletAddress}
                                    onChange={handleChange}  onKeyDown={handleKeyDown}
                                    />
                                    <button type="button" className="hover:cursor-pointer" onClick={validateAddress}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-dark-200 hover:stroke-brown-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                
                            ) : (
                                    
                                <>
                                    { walletStatus.userExist === null || walletStatus.userExist === false ? (

                                        <>
                                            <div className='space-y-5 mx-auto relative w-[80%] flex flex-col justify-center items-center'>
                                                <input className="bg-dark-900 w-full placeholder:text-[12px] pr-14 text-dark-200 font-mono ring-1 ring-dark-600 focus:ring-2 focus:ring-dark-300 outline-none duration-300 placeholder:text-dark-300 placeholder:opacity-80 rounded-full py-2 lg:py-4 shadow-md focus:shadow-lg focus:shadow-dark-400 px-6"
                                                placeholder="Type a Username.." name="username" type="text" value={formData.username}
                                                onChange={handleChange}
                                                />
                                                <input className="bg-dark-900 w-full placeholder:text-[12px] pr-14 text-dark-200 font-mono ring-1 ring-dark-600 focus:ring-2 focus:ring-dark-300 outline-none duration-300 placeholder:text-dark-300 placeholder:opacity-80 rounded-full py-2 lg:py-4 shadow-md focus:shadow-lg focus:shadow-dark-400 px-6"
                                                placeholder="Type an Email address.." name="email" type="email" value={formData.email}
                                                onChange={handleChange}
                                                />
                                                <input className="bg-dark-900 w-full placeholder:text-[12px] pr-14 text-dark-200 font-mono ring-1 ring-dark-600 focus:ring-2 focus:ring-dark-300 outline-none duration-300 placeholder:text-dark-300 placeholder:opacity-80 rounded-full py-2 lg:py-4 shadow-md focus:shadow-lg focus:shadow-dark-400 px-6"
                                                placeholder="Type a Password.." name="password" type="password" value={formData.password}
                                                onChange={handleChange}
                                                />
                                                <button onClick={handleLogin} className="bg-dark-900 text-dark-200 ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-6 py-3 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400 w-full md:w-fit">Register</button>
                                            </div>
                                        </>
                                    ) : (
                                        
                                        <div className='mx-auto relative w-[80%]'>
                                            <input className="bg-dark-900 w-full placeholder:text-[12px] pr-14 text-dark-200 font-mono ring-1 ring-dark-600 focus:ring-2 focus:ring-dark-300 outline-none duration-300 placeholder:text-dark-300 placeholder:opacity-80 rounded-full py-2 lg:py-4 shadow-md focus:shadow-lg focus:shadow-dark-400 px-6"
                                            placeholder="Type your Password.." name="password" type="password" value={formData.password}
                                            onChange={handleChange}
                                            />
                                            <button type="button" className="hover:cursor-pointer" onClick={handleLogin}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-dark-200 hover:stroke-brown-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </>
                                    
                            )}
                            { walletStatus.isValidAddress === false && (<label className='text-red text-xs flex justify-center animate-pulse'>Please add a Valid Wallet Address.</label>)}
                            { walletStatus.inValidForm === true && (<label className='text-red text-xs flex justify-center animate-pulse'>Missing Fields...</label>)}
                            { walletStatus.loginError != "" && (<label className='text-red text-xs flex justify-center animate-pulse'>{walletStatus.loginError}</label>)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
