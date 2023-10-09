import {useReducer} from "react";

const initialState  = {count: 0, step: 1}
function reducer(state, action) {
  // if (action.type === "inc") return state.count + 1;
  // if (action.type === 'dec') return state.count -1;
  // if (action.type === "setCount") return action.payload;

  console.log(state, action);



  switch (action.type) {
    case 'dec':
      return {...state, count: state.count - state.step}
    case 'inc':
      return {...state, count: state.count + state.step}
    case 'setCount':
      return {...state, count: action.payload}
    case 'setStep':
      return {...state, step: action.payload}
    case 'reset':
      return initialState
    default:
      throw new Error("Unknown Actions ");
  }

}

function DateCounter() {
  // const [count, setCount] = useState(0);
  // const [step, setStep] = useState(1);

  const [state, dispatch] = useReducer(reducer, initialState);

  const {count, step} = state;



  // This mutates the date object.
  const date = new Date();
  date.setDate(date.getDate() + count);

  const dec = function () {
    dispatch({
      type: 'dec',
    });
    // dispatch(-1);
    // setCount((count) => count - 1);
    // setCount((count) => count - step);
  };

  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);

    // dispatch(1);
    dispatch({
      type: 'inc',
    });
  };

  const defineCount = function (e) {
    // dispatch(Number(e.target.value));
    dispatch({
      type: "setCount",
      payload: Number(e.target.value),
    });
    // setCount(Number(e.target.value));
  };

  const defineStep = function (e) {
    // setStep(Number(e.target.value));
    dispatch({
      type: "setStep",
      payload: Number(e.target.value),
    });
  };

  const reset = function () {
    // setCount(0);
    // setStep(1);
    dispatch({
      type: "reset",
    });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount}/>
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default DateCounter;
