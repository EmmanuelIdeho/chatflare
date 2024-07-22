import { auth, provider, providerGit} from '../firebase-config.js'
import { signInWithPopup } from 'firebase/auth'

import Cookies from 'universal-cookie'

const cookies = new Cookies() //setting a cookie on the users browser so the user is not signed out after some time or when refreshing the app.

//component to handle user Authentication
const Auth = (props) => {
    const { setIsAuth } = props;

    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, provider);
            cookies.set("auth-token", auth.currentUser.getIdToken); //(name of cookie, chose the refreshToken for this example but there are other options)
            console.log("Successfully signed in with Google!");
            setIsAuth(true);
        } catch(err){
            // Handle Errors here.
            const errorCode = err.code;
            const errorMessage = err.message;
            console.log(errorCode);
            console.log(errorMessage);
        }
    }

    const signInWithGitHub = async () => {
        try{
            await signInWithPopup(auth, providerGit);
            cookies.set("auth-token", auth.currentUser.getIdToken);
            console.log("Successfully signed in with GitHub!");
            setIsAuth(true);

        } catch(err){
            // Handle Errors here.
            const errorCode = err.code;
            const errorMessage = err.message;
            //const errEmail = auth;
            console.log(errorCode);
            console.log(errorMessage);
            alert("It looks like you already have an account with an email that is connected to this GitHub account");
        }
    }

    return (
    <div className="generalForm">
        <p>🔥Welcome to ChatFlare!🔥</p>
        <button className="generalButton" onClick={ signInWithGoogle }>Sign In With Google</button>
        <button className="generalButton" onClick={ signInWithGitHub }>Sign In With GitHub</button>
    </div>
    )
}; 

export default Auth;