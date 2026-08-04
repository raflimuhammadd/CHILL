import {useState} from 'react';

function PracticeState() {
    const [text, setText] = useState('Hello');
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>Practice State</h2>

            <input 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type Something..." 
            />
            <p>You typed: {text}</p>

            <button onClick={() =>setCount(count + 1)}>
                Clicked {count} times
            </button>

            <button onClick={() => setCount(0)}>
                Reset
            </button>
        </div>
    )
}

export default PracticeState;