import Header from "./components/Header";
import Main from "./components/Main";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECONDS_PER_QUESTION = 30;

const initialState = {
    questions: [],

    status: "loading", // status =  loading, error, ready, active, finished
    index: 0, answer: null, points: 0, highScore: 0, secondsRemaining: null
};

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived': {
            return {
                ...state, questions: action.payload, status: "ready"
            }
        }
        case 'dataFailed': {
            return {
                ...state, status: "error"
            }
        }
        case 'start': {
            return {
                ...state, status: 'active',
                secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
            }
        }
        case "newAnswer": {
            const question = state.questions.at(state.index);
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points,
            }
        }
        case "nextQuestion": {
            return {
                ...state, index: state.index++, answer: null,
            }
        }
        case "finished": {
            return {
                ...state, status: 'finished', highScore: state.points > state.highScore ? state.points : state.highScore
            }
        }
        case "restart": {
            return {
                ...state,
                status: 'ready',
                points: 0,
                answer: null,
                index: 0, // ...initialState, questions: state.questions, state: 'ready'
            }
        }
        case "tick": {
            return {
                ...state,
                secondsRemaining: state.secondsRemaining !== 0 ? state.secondsRemaining - 1 : initialState.secondsRemaining,
                status: state.secondsRemaining === 0 ? "finished" : state.status
            }
        }
        default:
            throw new Error("Got Unknown Action Type");

    }
}

function App() {
    const [{
        questions, answer, points, index, highScore, status, secondsRemaining
    }, dispatch,] = useReducer(reducer, initialState);

    const numOfQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

    useEffect(() => {
        fetch('http://localhost:8000/questions')
            .then(response => response.json())
            .then(data => dispatch({
                type: 'dataReceived', payload: data
            }))
            .catch(error => dispatch({
                type: "dataFailed"
            }))
    }, []);

    console.log(questions, status)
    return (<div className={"app"}>
        <Header/>
        <Main>
            {status === "loading" && <Loader/>}
            {status === "error" && <Error/>}
            {status === "ready" && <StartScreen numOfQuestions={numOfQuestions} dispatch={dispatch}/>}
            {status === 'active' && (<>
                <Progress index={index} numOfQuestions={numOfQuestions} points={points}
                          totalPoints={maxPossiblePoints} answer={answer}/>
                <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
                <Footer>
                    <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
                    <NextButton dispatch={dispatch} answer={answer} index={index} numOfQuestions={numOfQuestions}/>
                </Footer>
            </>)}
            {status === 'finished' &&
                <FinishedScreen points={points} totalPoints={maxPossiblePoints} highScore={highScore}
                                dispatch={dispatch}/>}
        </Main>
    </div>);
}

export default App;
